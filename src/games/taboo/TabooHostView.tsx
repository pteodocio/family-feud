import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowRight, Ban, Trophy, Volume2, Sparkles, ShieldAlert } from 'lucide-react';
import { generateProceduralTaboo, type TabooCard } from '../../services/localGenerators/tabooGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface TabooHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function TabooHostView({ teams: initialTeams, onEndGame, onReturnToHub }: TabooHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [cards, setCards] = useState<TabooCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralTaboo({ count: 15 }).then((res) => {
      setCards(res);
    });
  }, []);

  const currentCard = cards[cardIndex] || {
    id: 'taboo_default',
    target: 'BALIKBAYAN BOX',
    category: 'Pinoy Culture',
    tabooWords: ['OFW', 'Padala', 'Kahon', 'Pasalubong', 'Duty Free'],
  };

  // Broadcast to TV (AUDIENCE CONCEALMENT: omit target and tabooWords from TV payload until guessed)
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'taboo',
      category: currentCard.category,
      activeTeamName: teams[activeTeamIdx]?.name || 'Team 1',
      activeTeamColor: teams[activeTeamIdx]?.color || 'blue',
      strikes,
      teams,
      isGameFinished,
    });
  }, [currentCard, activeTeamIdx, strikes, teams, isGameFinished]);

  const handleCorrect = () => {
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSoundTrigger('correct');

    setTeams((prev) =>
      prev.map((t, idx) => (idx === activeTeamIdx ? { ...t, score: t.score + 1 } : t))
    );
    advanceCard();
  };

  const handlePenaltyStrike = () => {
    soundManager.playPartyCue('strike');
    hubSyncBus.broadcastSoundTrigger('strike');

    setStrikes((prev) => prev + 1);
    setTeams((prev) =>
      prev.map((t, idx) => (idx === activeTeamIdx ? { ...t, score: Math.max(0, t.score - 1) } : t))
    );
    advanceCard();
  };

  const handlePass = () => {
    soundManager.playPartyCue('wrong');
    hubSyncBus.broadcastSoundTrigger('wrong');
    advanceCard();
  };

  const advanceCard = () => {
    if (cardIndex >= cards.length - 1) {
      setIsGameFinished(true);
      onEndGame(teams);
      return;
    }
    setCardIndex((prev) => prev + 1);
  };

  const handleSwitchTeamTurn = () => {
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
    setStrikes(0);
    setTimerRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Taboo Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Card {cardIndex + 1} of {cards.length || 15}</span>
              <span>•</span>
              <span className="text-pink-400">{currentCard.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={60}
            isRunning={timerRunning}
            onExpire={() => {
              setTimerRunning(false);
              soundManager.playPartyCue('whistle');
              hubSyncBus.broadcastSoundTrigger('whistle');
            }}
            onToggle={() => setTimerRunning((prev) => !prev)}
            onReset={() => setTimerRunning(false)}
          />

          <button
            onClick={() => {
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
          {/* Authentic Physical Taboo Card Look */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-pink-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Clue-Givers:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-pink-950 text-pink-300 border border-pink-700">
                  {teams[activeTeamIdx]?.name}
                </span>
              </div>
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Strikes: {strikes}
              </span>
            </div>

            {/* Target Word */}
            <div className="my-6 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                TARGET WORD (Say This!)
              </span>
              <div className="text-3xl sm:text-5xl font-display font-black text-white tracking-widest bg-pink-950/80 border-2 border-pink-500 py-4 px-8 rounded-2xl inline-block shadow-lg">
                {currentCard.target}
              </div>
            </div>

            {/* 5 Forbidden Taboo Words */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-rose-900/60 my-4">
              <span className="text-xs font-black uppercase tracking-widest text-rose-400 block text-center mb-3">
                FORBIDDEN BUZZWORDS (DO NOT SAY!)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                {currentCard.tabooWords.map((word, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 font-display font-black text-base"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleCorrect}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Correct! (+1 pt)
              </button>

              <button
                onClick={handlePenaltyStrike}
                className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
                title="Hit if clue-giver said a taboo word!"
              >
                <Ban className="w-5 h-5" />
                BUZZER! (-1 pt)
              </button>

              <button
                onClick={handlePass}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Pass Card
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Opposing team acts as the Buzzer Police watching this laptop screen!
            </span>
            <button
              onClick={handleSwitchTeamTurn}
              className="py-2.5 px-6 rounded-2xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
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
          gameTitle="Taboo Championship"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setCardIndex(0);
            setStrikes(0);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
