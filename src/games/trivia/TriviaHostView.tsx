import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowRight, ArrowLeft, Eye, Trophy, Sparkles } from 'lucide-react';
import { TRIVIA_QUESTIONS, TRIVIA_CATEGORIES, type TriviaQuestion } from '../../data/hubData/triviaQuestions';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';
import { recordContentUsage } from '../../services/contentHistory';
import { regenerateSingleTriviaItem } from '../../services/contentEngine';

interface TriviaHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function TriviaHostView({ teams: initialTeams, onEndGame, onReturnToHub }: TriviaHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );
  const [questions, setQuestions] = useState<TriviaQuestion[]>(() => {
    try {
      const raw = sessionStorage.getItem('hub_custom_content_family-trivia');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return TRIVIA_QUESTIONS;
  });
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);

  const filteredQuestions =
    selectedCategory === 'All'
      ? questions
      : questions.filter((q) => q.category === selectedCategory);

  const currentQ = filteredQuestions[questionIndex % Math.max(1, filteredQuestions.length)] || questions[0];

  // Broadcast state to TV display whenever state changes or sync is requested
  const broadcastCurrentState = () => {
    hubSyncBus.broadcastState({
      gameId: 'family-trivia',
      question: {
        category: currentQ.category,
        prompt: currentQ.prompt,
        options: currentQ.options,
        isAnswerRevealed,
        correctOptionIndex: isAnswerRevealed ? currentQ.correctOptionIndex : null,
      },
      teams,
      isGameFinished,
    });
  };

  useEffect(() => {
    broadcastCurrentState();
  }, [currentQ, isAnswerRevealed, teams, isGameFinished]);

  useEffect(() => {
    const unsub = hubSyncBus.onRequestSync(() => {
      broadcastCurrentState();
    });
    return () => unsub();
  }, [currentQ, isAnswerRevealed, teams, isGameFinished]);

  const handleRevealAnswer = () => {
    setIsAnswerRevealed(true);
    setTimerRunning(false);
    hubSyncBus.broadcastTimer(0, false);
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSound('correct');

    if (currentQ) {
      recordContentUsage({
        gameId: 'family-trivia',
        itemTitle: currentQ.prompt,
        category: currentQ.category,
      });
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerRevealed(false);
    setTimerRunning(false);
    hubSyncBus.broadcastTimer(20, false);
    setQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setIsAnswerRevealed(false);
      setTimerRunning(false);
      hubSyncBus.broadcastTimer(20, false);
      setQuestionIndex((prev) => prev - 1);
    }
  };

  const handleGenerateFreshQuestion = async () => {
    setIsGeneratingNext(true);
    try {
      const fresh = await regenerateSingleTriviaItem({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      });
      if (fresh) {
        setQuestions((prev) => [...prev, fresh]);
        setQuestionIndex(questions.length);
        setIsAnswerRevealed(false);
        setTimerRunning(false);
      }
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const handleAwardPoints = (teamId: string, pts: number = 20) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + pts } : t))
    );
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSound('correct');
  };

  const handleAdjustScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-6xl mx-auto text-slate-100">
      {/* Top Controls & Category Picker */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Family Trivia Host Console
            </span>
            <h2 className="text-lg font-bold text-white">
              Question {questionIndex + 1} of {filteredQuestions.length}
            </h2>
          </div>

          {/* Jump to Question Dropdown */}
          <select
            value={questionIndex}
            onChange={(e) => {
              setQuestionIndex(Number(e.target.value));
              setIsAnswerRevealed(false);
              setTimerRunning(false);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white"
            title="Jump directly to question"
          >
            {filteredQuestions.map((_, idx) => (
              <option key={idx} value={idx}>
                Q{idx + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setQuestionIndex(0);
              setIsAnswerRevealed(false);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="All">All Categories</option>
            {TRIVIA_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateFreshQuestion}
            disabled={isGeneratingNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 text-xs font-bold transition-colors"
            title="Generate a fresh question right now"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNext ? 'animate-spin' : ''}`} />
            <span>{isGeneratingNext ? 'Generating...' : '+ Generate New'}</span>
          </button>

          <button
            onClick={() => setIsGameFinished(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            Finish Game
          </button>
        </div>
      </div>

      {/* Main Grid: Question Card & Host Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Question & Answers Details */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-[#0a1428] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-3 py-1 rounded-full">
              {currentQ.category}
            </span>

            <SharedTimer
              initialSeconds={20}
              resetKey={questionIndex}
              isRunning={timerRunning}
              onToggle={() => setTimerRunning((prev) => !prev)}
              onReset={() => setTimerRunning(false)}
              onExpire={() => {
                setTimerRunning(false);
              }}
            />
          </div>

          <div className="my-2">
            <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {currentQ.prompt}
            </p>
          </div>

          {/* Options List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {currentQ.options.map((opt, idx) => {
              const isCorrect = idx === currentQ.correctOptionIndex;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-sm font-medium flex items-center justify-between transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-xs flex items-center justify-center font-bold text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isCorrect && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Correct Answer
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Host Action Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => setTimerRunning((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4" />
              {timerRunning ? 'Pause Clock' : 'Start 20s Clock'}
            </button>

            <button
              onClick={handleRevealAnswer}
              disabled={isAnswerRevealed}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isAnswerRevealed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
              }`}
            >
              <Eye className="w-4 h-4" />
              Reveal Answer on TV
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handlePrevQuestion}
                disabled={questionIndex === 0}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
                title="Previous Question"
              >
                <ArrowLeft className="w-4 h-4" />
                Prev
              </button>

              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md"
                title="Next Question"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Scoreboard & Points Awarding */}
        <div className="flex flex-col gap-4 bg-[#0a1428] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Award Points (+20 pts)
          </h3>

          <div className="flex flex-col gap-2.5">
            {teams.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800"
              >
                <div>
                  <span className="font-bold text-sm text-white">{t.name}</span>
                  <div className="font-mono text-xs text-sky-400 font-bold">{t.score} pts</div>
                </div>

                <button
                  onClick={() => handleAwardPoints(t.id, 20)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors active:scale-95 shadow"
                >
                  +20 pts
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              Scores update live on the TV display screen.
            </span>
          </div>
        </div>
      </div>

      {/* Shared Scoreboard display at bottom */}
      <SharedScoreboard
        teams={teams}
        showControls={true}
        onAdjustScore={handleAdjustScore}
      />

      {/* Winner Podium Modal when game finishes */}
      <WinnerPodiumModal
        isOpen={isGameFinished}
        gameTitle="Family Trivia"
        participants={teams}
        onPlayAgain={() => {
          setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          setQuestionIndex(0);
          setIsAnswerRevealed(false);
          setIsGameFinished(false);
        }}
        onReturnToHub={() => {
          onEndGame(teams);
          onReturnToHub();
        }}
      />
    </div>
  );
}
