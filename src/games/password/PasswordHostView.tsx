import { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Eye, KeyRound, Sparkles } from 'lucide-react';
import { generateProceduralPassword, type PasswordItem } from '../../services/localGenerators/passwordGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface PasswordHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function PasswordHostView({ teams: initialTeams, onEndGame, onReturnToHub }: PasswordHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [words, setWords] = useState<PasswordItem[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [clueCount, setClueCount] = useState(1);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralPassword({ count: 10 }).then((res) => {
      setWords(res);
    });
  }, []);

  const currentWord = words[wordIndex] || {
    id: 'pw_default',
    word: 'JEEPNEY',
    category: 'Pinoy Culture',
    sampleClues: ['Biyahe', 'Tsuper', 'Sakay'],
  };

  const getPointsForClue = (clueNum: number) => {
    const ladder = [10, 8, 6, 4];
    return ladder[Math.min(clueNum - 1, ladder.length - 1)] || 4;
  };

  const currentPoints = getPointsForClue(clueCount);

  // Sync state to TV Display (AUDIENCE CONCEALMENT: hide secret word until isRevealed)
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'password',
      secretWord: isRevealed ? currentWord.word : null,
      isRevealed,
      category: currentWord.category,
      clueCount,
      pointsValue: currentPoints,
      activeTeamIndex: activeTeamIdx,
      activeTeamName: teams[activeTeamIdx]?.name || 'Team 1',
      activeTeamColor: teams[activeTeamIdx]?.color || 'blue',
      teams,
      isGameFinished,
    });
  }, [currentWord, isRevealed, clueCount, currentPoints, activeTeamIdx, teams, isGameFinished]);

  const handleCorrectGuess = () => {
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSoundTrigger('correct');
    setIsRevealed(true);

    const updated = teams.map((t, idx) =>
      idx === activeTeamIdx ? { ...t, score: t.score + currentPoints } : t
    );
    setTeams(updated);
  };

  const handlePassOrWrong = () => {
    soundManager.playPartyCue('wrong');
    hubSyncBus.broadcastSoundTrigger('wrong');

    // Switch team and increment clue count (max 4)
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
    setClueCount((prev) => Math.min(prev + 1, 4));
  };

  const handleNextWord = () => {
    if (wordIndex >= words.length - 1) {
      setIsGameFinished(true);
      onEndGame(teams);
      return;
    }
    setWordIndex((prev) => prev + 1);
    setClueCount(1);
    setIsRevealed(false);
    setTimerRunning(false);
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Top Console Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Password Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Word {wordIndex + 1} of {words.length || 10}</span>
              <span>•</span>
              <span className="text-cyan-400">{currentWord.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={15}
            resetKey={`${wordIndex}_${clueCount}`}
            isRunning={timerRunning}
            onToggle={() => setTimerRunning((prev) => !prev)}
            onReset={() => setTimerRunning(false)}
            onExpire={() => {
              setTimerRunning(false);
              soundManager.playPartyCue('whistle');
              hubSyncBus.broadcastSoundTrigger('whistle');
            }}
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

      {/* Main Secret Card Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500/50 shadow-2xl relative overflow-hidden">
            {/* Active Turn Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Guessing Team:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {teams[activeTeamIdx]?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Worth: {currentPoints} Points (Clue #{clueCount})</span>
              </div>
            </div>

            {/* Secret Word Display (Host eyes only) */}
            <div className="my-8 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                Secret Password (Host & Clue-Giver Only)
              </span>
              <div className="text-4xl sm:text-6xl font-display font-black text-white tracking-widest bg-slate-950 py-6 px-8 rounded-3xl border border-slate-800 inline-block shadow-inner">
                {currentWord.word}
              </div>

              {currentWord.sampleClues && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span className="font-bold">Idea Clues:</span>
                  {currentWord.sampleClues.map((c, idx) => (
                    <span key={idx} className="bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleCorrectGuess}
                disabled={isRevealed}
                className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Correct! (+{currentPoints} pts)
              </button>

              <button
                onClick={handlePassOrWrong}
                disabled={isRevealed}
                className="py-3 px-4 rounded-2xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                Pass / Wrong Guess
              </button>

              <button
                onClick={() => setIsRevealed(true)}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-5 h-5 text-amber-400" />
                Reveal to TV
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Rule: Clue-giver must only speak ONE word per turn. No rhymes or charades!
            </span>
            <button
              onClick={handleNextWord}
              className="py-2.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              Next Password
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Scoreboard */}
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
          gameTitle="Password Battle"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setWordIndex(0);
            setClueCount(1);
            setIsRevealed(false);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
