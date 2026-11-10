import { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Heart, Trophy, Sparkles, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { generateProceduralElimination, type EliminationQuestion } from '../../services/localGenerators/eliminationGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface EliminationHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function EliminationHostView({ teams: initialTeams, onEndGame, onReturnToHub }: EliminationHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [teamLives, setTeamLives] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    (initialTeams.length > 0 ? initialTeams : [{ id: 't1' }, { id: 't2' }]).forEach((t) => {
      init[t.id] = 3; // 3 lives ❤️❤️❤️
    });
    return init;
  });

  const [questions, setQuestions] = useState<EliminationQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralElimination({ count: 12 }).then((res) => {
      setQuestions(res);
    });
  }, []);

  const currentQ = questions[qIdx] || {
    id: 'elim_default',
    question: 'Which element has the highest melting point of all metals?',
    options: ['Tungsten', 'Titanium', 'Platinum', 'Osmium'],
    correctOptionIndex: 0,
    explanation: 'Tungsten has the highest melting point of any metal at 3,422 °C.',
    difficulty: 'hard' as const,
  };

  // Check how many teams remain alive
  const survivingTeams = teams.filter((t) => (teamLives[t.id] || 0) > 0);

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'trivia-elimination',
      question: currentQ.question,
      options: currentQ.options,
      correctOptionIndex: isAnswerRevealed ? currentQ.correctOptionIndex : null,
      explanation: isAnswerRevealed ? currentQ.explanation : null,
      teamLives,
      teams,
      isGameFinished,
    });
  }, [currentQ, isAnswerRevealed, teamLives, teams, isGameFinished]);

  const handleDeductLife = (teamId: string) => {
    soundManager.playPartyCue('strike');
    hubSyncBus.broadcastSoundTrigger('strike');

    setTeamLives((prev) => {
      const nextLives = Math.max(0, (prev[teamId] || 3) - 1);
      const updated = { ...prev, [teamId]: nextLives };

      // If only 1 team remains alive, award win
      const alive = teams.filter((t) => (updated[t.id] || 0) > 0);
      if (alive.length === 1) {
        setTimeout(() => {
          setIsGameFinished(true);
          onEndGame(teams);
        }, 800);
      }

      return updated;
    });
  };

  const handleRewardSurviving = () => {
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSoundTrigger('correct');
    setIsAnswerRevealed(true);

    // Each alive team gets 100 points
    setTeams((prev) =>
      prev.map((t) =>
        (teamLives[t.id] || 0) > 0 ? { ...t, score: t.score + 100 } : t
      )
    );
  };

  const handleNextQuestion = () => {
    if (qIdx >= questions.length - 1 || survivingTeams.length <= 1) {
      setIsGameFinished(true);
      onEndGame(teams);
      return;
    }
    setQIdx((prev) => prev + 1);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Trivia Elimination Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Question {qIdx + 1} of {questions.length || 12}</span>
              <span>•</span>
              <span className="text-red-400 font-bold">Surviving: {survivingTeams.length} Teams</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={30}
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
          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-red-500/50 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Survival Question (3 Lives per Team):
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-snug">
                "{currentQ.question}"
              </h3>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isCorrect = idx === currentQ.correctOptionIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border font-bold text-sm flex items-center gap-3 transition-colors ${
                      isAnswerRevealed
                        ? isCorrect
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
                        : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Team Life Deductions Controls */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase text-slate-400 block">
                Manage Team Lives (Click -1 Life on Wrong Answer):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teams.map((t) => {
                  const lives = teamLives[t.id] ?? 3;
                  const isAlive = lives > 0;
                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        isAlive ? 'bg-slate-950 border-slate-800' : 'bg-red-950/20 border-red-900/50 opacity-60'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-white block">{t.name}</span>
                        <div className="flex items-center gap-1 mt-1 text-red-500">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Heart
                              key={i}
                              className={`w-4 h-4 ${i < lives ? 'fill-current' : 'text-slate-800'}`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeductLife(t.id)}
                        disabled={!isAlive}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white font-bold text-xs flex items-center gap-1 shadow"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        -1 Life
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRewardSurviving}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reveal Answer & Reward Survivors (+100 pts)
              </button>

              <button
                onClick={handleNextQuestion}
                className="py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center gap-2 shadow"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
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
          participants={survivingTeams.length > 0 ? survivingTeams : teams}
          gameTitle="Trivia Elimination Champions"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setQIdx(0);
            setIsAnswerRevealed(false);
            const resetLives: Record<string, number> = {};
            teams.forEach((t) => (resetLives[t.id] = 3));
            setTeamLives(resetLives);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
