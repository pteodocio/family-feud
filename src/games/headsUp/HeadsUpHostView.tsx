import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Smile } from 'lucide-react';
import { generateProceduralHeadsUp, type HeadsUpCard } from '../../services/localGenerators/headsUpGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';
import { loadCustomHubContent } from '../../utils/hubContentLoader';
import { useHubHostSync } from '../../utils/useHubHostSync';

interface HeadsUpHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function HeadsUpHostView({ teams: initialTeams, onEndGame, onReturnToHub }: HeadsUpHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [cards, setCards] = useState<HeadsUpCard[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    const custom = loadCustomHubContent<HeadsUpCard>('heads-up');
    if (custom) {
      setCards(custom);
      return;
    }
    generateProceduralHeadsUp({ count: 25 }).then((res) => {
      setCards(res);
    });
  }, []);

  const currentCard = cards[cardIdx] || {
    id: 'hu_default',
    item: 'Harry Potter',
    category: 'Movies & Characters',
  };

  const syncPayload = useMemo(
    () => ({
      gameId: 'heads-up',
      item: currentCard.item,
      category: currentCard.category,
      activeTeamName: teams[activeTeamIdx]?.name || 'Team 1',
      activeTeamColor: teams[activeTeamIdx]?.color || 'blue',
      correctCount,
      passCount,
      teams,
      isGameFinished,
    }),
    [currentCard, activeTeamIdx, correctCount, passCount, teams, isGameFinished]
  );
  useHubHostSync(syncPayload);

  const advanceCard = (latestTeams: ScoreboardParticipant[] = teams) => {
    if (cardIdx >= cards.length - 1) {
      setTimerRunning(false);
      setIsGameFinished(true);
      onEndGame(latestTeams);
      return;
    }
    setCardIdx((prev) => prev + 1);
  };

  const handleCorrect = () => {
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSoundTrigger('correct');

    setCorrectCount((prev) => prev + 1);
    const updatedTeams = teams.map((t, idx) =>
      idx === activeTeamIdx ? { ...t, score: t.score + 1 } : t
    );
    setTeams(updatedTeams);
    advanceCard(updatedTeams);
  };

  const handlePass = () => {
    soundManager.playPartyCue('wrong');
    hubSyncBus.broadcastSoundTrigger('wrong');

    setPassCount((prev) => prev + 1);
    advanceCard(teams);
  };

  const handleSwitchTeam = () => {
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
    setCorrectCount(0);
    setPassCount(0);
    setTimerRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Heads Up! Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Card {cardIdx + 1} of {cards.length || 25}</span>
              <span>•</span>
              <span className="text-yellow-400">{currentCard.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={60}
            resetKey={activeTeamIdx}
            isRunning={timerRunning}
            onExpire={() => {
              setTimerRunning(false);
              soundManager.playPartyCue('strike');
              hubSyncBus.broadcastSoundTrigger('strike');
            }}
            onToggle={() => setTimerRunning((prev) => !prev)}
            onReset={() => setTimerRunning(false)}
          />

          <button
            onClick={() => {
              setTimerRunning(false);
              setIsGameFinished(true);
              onEndGame(teams);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            End Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-yellow-500/50 shadow-2xl text-center space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">Active Guesser Team:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-yellow-950 text-yellow-300 border border-yellow-700">
                  {teams[activeTeamIdx]?.name}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-300">
                Round: <b className="text-emerald-400">+{correctCount}</b> / <b className="text-rose-400">-{passCount}</b>
              </div>
            </div>

            {/* Giant Card Display */}
            <div className="my-8 py-10 px-6 rounded-3xl bg-slate-950 border-2 border-slate-800 shadow-inner">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">
                Shout Clues To Guesser!
              </span>
              <div className="text-4xl sm:text-6xl font-display font-black text-white tracking-wide">
                {currentCard.item}
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleCorrect}
                className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-6 h-6" />
                CORRECT! (+1)
              </button>

              <button
                onClick={handlePass}
                className="py-4 px-6 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-display font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
              >
                <XCircle className="w-6 h-6" />
                PASS (Next)
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSwitchTeam}
              className="py-2.5 px-6 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-sm shadow transition-transform active:scale-95"
            >
              Switch Team Turn →
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <SharedScoreboard
            participants={teams}
            onUpdateScore={(id, newScore) => {
              setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: newScore } : t)));
            }}
          />
        </div>
      </div>

      {isGameFinished && (
        <WinnerPodiumModal
          isOpen={isGameFinished}
          onClose={() => setIsGameFinished(false)}
          participants={teams}
          gameTitle="Heads Up! Champions"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setTimerRunning(false);
            setCardIdx(0);
            setCorrectCount(0);
            setPassCount(0);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
