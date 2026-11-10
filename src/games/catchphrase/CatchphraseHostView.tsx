import { useState, useEffect } from 'react';
import { CheckCircle2, Flame } from 'lucide-react';
import { generateProceduralCatchphrase, type CatchphraseItem } from '../../services/localGenerators/catchphraseGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface CatchphraseHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function CatchphraseHostView({ teams: initialTeams, onEndGame, onReturnToHub }: CatchphraseHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [phrases, setPhrases] = useState<CatchphraseItem[]>([]);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [wordsPassed, setWordsPassed] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralCatchphrase({ count: 20 }).then((res) => {
      setPhrases(res);
    });
  }, []);

  const currentPhrase = phrases[phraseIdx] || {
    id: 'cp_default',
    phrase: 'Picture Muna Bago Kain',
    category: 'Pinoy Culture',
  };

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'catchphrase',
      category: currentPhrase.category,
      activeTeamName: teams[activeTeamIdx]?.name || 'Team 1',
      activeTeamColor: teams[activeTeamIdx]?.color || 'blue',
      wordsPassed,
      teams,
      isGameFinished,
    });
  }, [currentPhrase, activeTeamIdx, wordsPassed, teams, isGameFinished]);

  const handleGuessedAndPass = () => {
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSoundTrigger('correct');

    // Award 1 pt to active team, pass turn to next team, advance phrase
    setTeams((prev) =>
      prev.map((t, idx) => (idx === activeTeamIdx ? { ...t, score: t.score + 1 } : t))
    );
    setWordsPassed((prev) => prev + 1);
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
    setPhraseIdx((prev) => (prev + 1) % (phrases.length || 1));
  };

  const handleSkipWord = () => {
    soundManager.playPartyCue('wrong');
    hubSyncBus.broadcastSoundTrigger('wrong');
    setPhraseIdx((prev) => (prev + 1) % (phrases.length || 1));
  };

  const handleTimerBuzzerExpire = () => {
    setTimerRunning(false);
    soundManager.playPartyCue('strike');
    hubSyncBus.broadcastSoundTrigger('strike');

    // Team caught holding it when timer runs out: opposing team gets bonus or current team gets strike
    const opposingTeamIdx = (activeTeamIdx + 1) % teams.length;
    setTeams((prev) =>
      prev.map((t, idx) => (idx === opposingTeamIdx ? { ...t, score: t.score + 1 } : t))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Catchphrase Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Hot Potato Word Pass</span>
              <span>•</span>
              <span className="text-orange-400">{currentPhrase.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={60}
            isRunning={timerRunning}
            onExpire={handleTimerBuzzerExpire}
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
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-orange-500/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Holding Phrase:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-orange-950 text-orange-300 border border-orange-700">
                  {teams[activeTeamIdx]?.name}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Words Passed: <b className="text-white">{wordsPassed}</b>
              </span>
            </div>

            <div className="my-8 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                Secret Phrase (Describe Fast!)
              </span>
              <div className="text-3xl sm:text-5xl font-display font-black text-white tracking-wide bg-slate-950 py-6 px-8 rounded-3xl border border-slate-800 inline-block shadow-inner max-w-xl">
                {currentPhrase.phrase}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleGuessedAndPass}
                className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Guessed! Pass to Next Team →
              </button>

              <button
                onClick={handleSkipWord}
                className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Skip / Next Phrase
              </button>
            </div>
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
          gameTitle="Catchphrase Championship"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setPhraseIdx(0);
            setWordsPassed(0);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
