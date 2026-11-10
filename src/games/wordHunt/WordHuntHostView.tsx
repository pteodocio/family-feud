import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowRight, Grid, Trophy, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { generateProceduralWordHunt, checkWordPathOnGrid } from '../../services/localGenerators/wordHuntGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface WordHuntHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function WordHuntHostView({ teams: initialTeams, onEndGame, onReturnToHub }: WordHuntHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [grid, setGrid] = useState<string[][]>([
    ['C', 'A', 'T', 'S'],
    ['O', 'R', 'E', 'P'],
    ['D', 'O', 'G', 'S'],
    ['F', 'I', 'S', 'H'],
  ]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isScoringRound, setIsScoringRound] = useState(false);
  const [submittedWords, setSubmittedWords] = useState<Record<string, string[]>>({});
  const [currentInputs, setCurrentInputs] = useState<Record<string, string>>({});
  const [isGameFinished, setIsGameFinished] = useState(false);

  const startNewBoard = async () => {
    const res = await generateProceduralWordHunt();
    setGrid(res.grid);
    setSubmittedWords({});
    setCurrentInputs({});
    setIsScoringRound(false);
    setTimerRunning(false);
  };

  useEffect(() => {
    startNewBoard();
  }, []);

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'word-hunt',
      grid,
      roundNumber,
      isScoringRound,
      teams,
      isGameFinished,
    });
  }, [grid, roundNumber, isScoringRound, teams, isGameFinished]);

  const getBoggleScore = (word: string) => {
    const len = word.length;
    if (len < 3) return 0;
    if (len <= 4) return 1;
    if (len === 5) return 2;
    if (len === 6) return 3;
    if (len === 7) return 5;
    return 11;
  };

  const handleAddWordToTeam = (teamId: string) => {
    const text = (currentInputs[teamId] || '').trim().toUpperCase();
    if (!text || text.length < 3) return;

    setSubmittedWords((prev) => ({
      ...prev,
      [teamId]: [...(prev[teamId] || []), text],
    }));

    setCurrentInputs((prev) => ({ ...prev, [teamId]: '' }));
  };

  const handleCalculateRoundScores = () => {
    soundManager.playPartyCue('round_win');
    hubSyncBus.broadcastSoundTrigger('round_win');

    const teamPoints: Record<string, number> = {};
    teams.forEach((t) => (teamPoints[t.id] = 0));

    // Calculate valid words, canceling out cross-team duplicates
    teams.forEach((t) => {
      const myWords = submittedWords[t.id] || [];
      const otherWords = teams
        .filter((other) => other.id !== t.id)
        .flatMap((other) => submittedWords[other.id] || []);

      myWords.forEach((word) => {
        const isValidPath = checkWordPathOnGrid(word, grid);
        const isDuplicate = otherWords.includes(word);

        if (isValidPath && !isDuplicate) {
          teamPoints[t.id] += getBoggleScore(word);
        }
      });
    });

    setTeams((prev) =>
      prev.map((t) => ({ ...t, score: t.score + (teamPoints[t.id] || 0) }))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Word Hunt Console</h2>
            <p className="text-xs text-slate-400">4x4 Boggle letter matrix race · Adjacent path scoring</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={90}
            isRunning={timerRunning}
            onExpire={() => {
              setTimerRunning(false);
              setIsScoringRound(true);
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
          {/* 4x4 Grid Display */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-teal-500/50 shadow-2xl flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2.5 max-w-sm w-full my-4">
              {grid.map((row, rIdx) =>
                row.map((char, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-teal-500/40 font-display font-black text-2xl text-white flex items-center justify-center shadow-lg"
                  >
                    {char}
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={startNewBoard}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Roll New 4x4 Board
              </button>
            </div>
          </div>

          {/* Post-Round Word Entry & Validation */}
          {isScoringRound && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <h3 className="font-display font-black text-base text-white">
                Enter Found Words for Each Team:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <span className="font-bold text-xs text-teal-400 block">{t.name}</span>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add word..."
                        value={currentInputs[t.id] || ''}
                        onChange={(e) =>
                          setCurrentInputs((prev) => ({ ...prev, [t.id]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleAddWordToTeam(t.id)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white uppercase"
                      />
                      <button
                        onClick={() => handleAddWordToTeam(t.id)}
                        className="px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {(submittedWords[t.id] || []).map((w, idx) => {
                        const isValid = checkWordPathOnGrid(w, grid);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-slate-900"
                          >
                            <span className={isValid ? 'text-white' : 'text-rose-400 line-through'}>
                              {w} ({getBoggleScore(w)} pts)
                            </span>
                            {isValid ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-rose-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCalculateRoundScores}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm shadow transition-transform active:scale-95"
              >
                Apply Valid Words & Tally Scores!
              </button>
            </div>
          )}
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
          gameTitle="Word Hunt Championship"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setRoundNumber(1);
            startNewBoard();
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
