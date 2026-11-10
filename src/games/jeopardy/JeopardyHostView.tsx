import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Eye, Trophy } from 'lucide-react';
import { generateProceduralJeopardy, type JeopardyBoard, type JeopardyQuestion } from '../../services/localGenerators/jeopardyGenerator';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface JeopardyHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function JeopardyHostView({ teams: initialTeams, onEndGame, onReturnToHub }: JeopardyHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [board, setBoard] = useState<JeopardyBoard | null>(null);
  const [usedTileIds, setUsedTileIds] = useState<string[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<{
    catName: string;
    question: JeopardyQuestion;
  } | null>(null);
  const [selectedBuzzedTeamId, setSelectedBuzzedTeamId] = useState<string>('');
  const [dailyDoubleWager, setDailyDoubleWager] = useState<number>(500);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralJeopardy().then((b) => {
      setBoard(b);
    });
  }, []);

  // Broadcast to TV
  useEffect(() => {
    if (!board) return;
    hubSyncBus.broadcastStateUpdate({
      gameId: 'jeopardy',
      categories: board.categories.map((c) => ({
        id: c.id,
        name: c.name,
        tiles: c.questions.map((q) => ({
          id: q.id,
          value: q.value,
          isUsed: usedTileIds.includes(q.id),
        })),
      })),
      activeQuestion: activeQuestion
        ? {
            catName: activeQuestion.catName,
            value: activeQuestion.question.isDailyDouble
              ? dailyDoubleWager
              : activeQuestion.question.value,
            clue: activeQuestion.question.clue,
            isDailyDouble: Boolean(activeQuestion.question.isDailyDouble),
            answer: isAnswerRevealed ? activeQuestion.question.answer : null,
          }
        : null,
      teams,
      isGameFinished,
    });
  }, [board, usedTileIds, activeQuestion, isAnswerRevealed, dailyDoubleWager, teams, isGameFinished]);

  const handleSelectTile = (catName: string, q: JeopardyQuestion) => {
    if (usedTileIds.includes(q.id)) return;
    setActiveQuestion({ catName, question: q });
    setIsAnswerRevealed(false);
    setSelectedBuzzedTeamId(teams[0]?.id || '');
    setDailyDoubleWager(q.value);
    setTimerRunning(false);

    if (q.isDailyDouble) {
      soundManager.playPartyCue('fanfare');
      hubSyncBus.broadcastSoundTrigger('fanfare');
    }
  };

  const handleAwardPoints = (isCorrect: boolean) => {
    if (!activeQuestion) return;
    const value = activeQuestion.question.isDailyDouble
      ? dailyDoubleWager
      : activeQuestion.question.value;

    if (isCorrect) {
      soundManager.playPartyCue('correct');
      hubSyncBus.broadcastSoundTrigger('correct');
      setIsAnswerRevealed(true);

      setTeams((prev) =>
        prev.map((t) => (t.id === selectedBuzzedTeamId ? { ...t, score: t.score + value } : t))
      );
    } else {
      soundManager.playPartyCue('wrong');
      hubSyncBus.broadcastSoundTrigger('wrong');

      setTeams((prev) =>
        prev.map((t) => (t.id === selectedBuzzedTeamId ? { ...t, score: t.score - value } : t))
      );
    }
  };

  const handleCloseActiveQuestion = () => {
    if (activeQuestion) {
      setUsedTileIds((prev) => [...prev, activeQuestion.question.id]);
    }
    setActiveQuestion(null);
    setIsAnswerRevealed(false);
    setTimerRunning(false);
  };

  if (!board) {
    return <div className="p-8 text-center text-slate-400">Loading Jeopardy Board...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Jeopardy! Host Console</h2>
            <p className="text-xs text-slate-400">Click tiles to reveal clues · Mark buzzer answers</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SharedTimer
            initialSeconds={30}
            resetKey={activeQuestion?.question?.id || 'grid'}
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
              setIsGameFinished(true);
              onEndGame(teams);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Jeopardy 5x5 Board Grid */}
      <div className="grid grid-cols-5 gap-3 bg-blue-950/40 p-4 rounded-3xl border border-blue-900 shadow-2xl">
        {board.categories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            {/* Category Header */}
            <div className="h-16 p-2 rounded-2xl bg-blue-900 text-center flex items-center justify-center font-display font-black text-xs sm:text-sm text-amber-300 uppercase tracking-tight shadow border border-blue-700">
              {cat.name}
            </div>

            {/* 5 Questions */}
            {cat.questions.map((q) => {
              const isUsed = usedTileIds.includes(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectTile(cat.name, q)}
                  disabled={isUsed}
                  className={`w-full h-14 rounded-2xl font-display font-black text-lg sm:text-xl transition-all flex items-center justify-center border shadow ${
                    isUsed
                      ? 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-blue-800 hover:bg-blue-700 text-amber-400 border-blue-600 hover:scale-105 active:scale-95 shadow-blue-900/50'
                  }`}
                >
                  {isUsed ? '—' : `$${q.value}`}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active Question Modal / Drawer */}
      {activeQuestion && (
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-blue-500 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-400">
                {activeQuestion.catName}
              </span>
              <span>•</span>
              <span className="text-xs font-bold text-slate-300">
                Value: ${activeQuestion.question.value}
              </span>
              {activeQuestion.question.isDailyDouble && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  DAILY DOUBLE!
                </span>
              )}
            </div>

            <button
              onClick={handleCloseActiveQuestion}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Close Clue ✕
            </button>
          </div>

          <div className="my-6">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Clue Prompt:</span>
            <p className="text-xl sm:text-2xl font-display font-bold text-white bg-slate-950 p-4 rounded-2xl border border-slate-800">
              "{activeQuestion.question.clue}"
            </p>
          </div>

          <div className="my-4 p-4 rounded-2xl bg-blue-950/60 border border-blue-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-300 font-bold block">Correct Answer (Host Eye):</span>
              <span className="font-display font-black text-lg text-amber-400">
                {activeQuestion.question.answer}
              </span>
            </div>

            <button
              onClick={() => setIsAnswerRevealed((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              {isAnswerRevealed ? 'Hide Answer from TV' : 'Reveal Answer to TV'}
            </button>
          </div>

          {/* Awarding Team Points */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400">Answering Team:</span>
              <select
                value={selectedBuzzedTeamId}
                onChange={(e) => setSelectedBuzzedTeamId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (${t.score})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAwardPoints(true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                Correct (+${activeQuestion.question.value})
              </button>

              <button
                onClick={() => handleAwardPoints(false)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <XCircle className="w-4 h-4" />
                Wrong (-${activeQuestion.question.value})
              </button>

              <button
                onClick={handleCloseActiveQuestion}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Done / Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Scoreboard */}
      <div className="mt-6">
        <SharedScoreboard
          participants={teams}
          onUpdateScore={(id, newScore) => {
            setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: newScore } : t)));
          }}
        />
      </div>

      {isGameFinished && (
        <WinnerPodiumModal
          isOpen={isGameFinished}
          onClose={() => setIsGameFinished(false)}
          participants={teams}
          gameTitle="Jeopardy! Championship"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setUsedTileIds([]);
            setActiveQuestion(null);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
