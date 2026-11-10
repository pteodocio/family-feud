import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowRight, Dices, Trophy, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { generateProceduralScattergories, type ScattergoriesRound } from '../../services/localGenerators/scattergoriesGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface ScattergoriesHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function ScattergoriesHostView({ teams: initialTeams, onEndGame, onReturnToHub }: ScattergoriesHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [roundData, setRoundData] = useState<ScattergoriesRound>({
    letter: 'S',
    categories: [
      'Things in a Supermarket',
      'Animals',
      'Things You See in School',
      'Foods or Snacks',
      'Movie Titles',
      'Things in the Kitchen',
    ],
  });

  const [timerRunning, setTimerRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [teamAnswers, setTeamAnswers] = useState<Record<string, Record<number, string>>>({});
  const [isGameFinished, setIsGameFinished] = useState(false);

  const rollNewRound = async () => {
    const res = await generateProceduralScattergories({ categoryCount: 6 });
    setRoundData(res);
    setTeamAnswers({});
    setIsReviewing(false);
    setTimerRunning(false);
    soundManager.playPartyCue('whistle');
    hubSyncBus.broadcastSoundTrigger('whistle');
  };

  useEffect(() => {
    rollNewRound();
  }, []);

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'scattergories',
      letter: roundData.letter,
      categories: roundData.categories,
      isReviewing,
      teams,
      isGameFinished,
    });
  }, [roundData, isReviewing, teams, isGameFinished]);

  const handleUpdateAnswer = (teamId: string, catIdx: number, val: string) => {
    setTeamAnswers((prev) => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [catIdx]: val,
      },
    }));
  };

  const handleScoreRound = () => {
    soundManager.playPartyCue('round_win');
    hubSyncBus.broadcastSoundTrigger('round_win');

    const pointsDelta: Record<string, number> = {};
    teams.forEach((t) => (pointsDelta[t.id] = 0));

    // Award 1 pt for unique valid answers starting with round letter
    roundData.categories.forEach((_, catIdx) => {
      teams.forEach((t) => {
        const myAns = (teamAnswers[t.id]?.[catIdx] || '').trim().toLowerCase();
        if (!myAns) return;

        // Must start with letter
        if (!myAns.startsWith(roundData.letter.toLowerCase())) return;

        // Must be unique across all other teams
        const otherTeamsAns = teams
          .filter((other) => other.id !== t.id)
          .map((other) => (teamAnswers[other.id]?.[catIdx] || '').trim().toLowerCase());

        const isDuplicate = otherTeamsAns.includes(myAns);
        if (!isDuplicate) {
          pointsDelta[t.id] = (pointsDelta[t.id] || 0) + 1;
        }
      });
    });

    setTeams((prev) =>
      prev.map((t) => ({ ...t, score: t.score + (pointsDelta[t.id] || 0) }))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Scattergories Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Selected Letter:</span>
              <span className="text-rose-400 font-display font-black text-lg">"{roundData.letter}"</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={120}
            isRunning={timerRunning}
            onExpire={() => {
              setTimerRunning(false);
              setIsReviewing(true);
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
          {/* Categories Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-rose-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-400">
                Write answers starting with letter: <b className="text-rose-400 font-display text-lg">"{roundData.letter}"</b>
              </span>
              <button
                onClick={rollNewRound}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Spin New Letter
              </button>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {roundData.categories.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-950 text-rose-300 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-white">{cat}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Answer Entry and Scoring Matrix */}
            {isReviewing ? (
              <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                <span className="text-xs font-bold uppercase text-slate-400 block">
                  Review & Compare Team Answers:
                </span>

                <div className="space-y-3">
                  {roundData.categories.map((cat, cIdx) => (
                    <div key={cIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-400 block">
                        #{cIdx + 1} {cat}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {teams.map((t) => (
                          <div key={t.id} className="flex items-center gap-2">
                            <span className="w-24 text-[11px] font-bold text-slate-400 truncate">{t.name}:</span>
                            <input
                              type="text"
                              placeholder={`Starts with ${roundData.letter}...`}
                              value={teamAnswers[t.id]?.[cIdx] || ''}
                              onChange={(e) => handleUpdateAnswer(t.id, cIdx, e.target.value)}
                              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleScoreRound}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-sm shadow transition-transform active:scale-95"
                >
                  Calculate & Award Unique Answer Points!
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsReviewing(true)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Open Review & Scoring Matrix
              </button>
            )}
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
          gameTitle="Scattergories Championship"
          onPlayAgain={() => {
            setIsGameFinished(false);
            rollNewRound();
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
