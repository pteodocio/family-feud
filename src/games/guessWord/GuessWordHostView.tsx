import { useState, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, Eye, CheckCircle2, Trophy, HelpCircle } from 'lucide-react';
import { WORD_CLUES, WORD_CLUE_CATEGORIES, type WordCluePuzzle } from '../../data/hubData/wordClues';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface GuessWordHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

const CLUE_POINTS = [40, 30, 20, 10];

export function GuessWordHostView({ teams: initialTeams, onEndGame, onReturnToHub }: GuessWordHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [revealedClueCount, setRevealedClueCount] = useState(1);
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isGameFinished, setIsGameFinished] = useState(false);

  const filteredPuzzles =
    selectedCategory === 'All'
      ? WORD_CLUES
      : WORD_CLUES.filter((p) => p.category === selectedCategory);

  const currentPuzzle = filteredPuzzles[puzzleIndex % filteredPuzzles.length];
  const currentAvailablePoints = CLUE_POINTS[revealedClueCount - 1] || 10;

  // Broadcast state to TV
  useEffect(() => {
    hubSyncBus.broadcastState({
      gameId: 'guess-the-word',
      category: currentPuzzle.category,
      revealedClues: currentPuzzle.clues.slice(0, revealedClueCount),
      currentPoints: currentAvailablePoints,
      isWordRevealed,
      secretWord: isWordRevealed ? currentPuzzle.word : null,
      teams,
      isGameFinished,
    });
  }, [currentPuzzle, revealedClueCount, currentAvailablePoints, isWordRevealed, teams, isGameFinished]);

  const handleRevealNextClue = () => {
    if (revealedClueCount < 4) {
      setRevealedClueCount((prev) => prev + 1);
      soundManager.playPartyCue('tick');
    }
  };

  const handleCorrectGuess = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: t.score + currentAvailablePoints } : t))
    );
    setIsWordRevealed(true);
    setTimerRunning(false);
    soundManager.playPartyCue('correct');
  };

  const handleNextPuzzle = () => {
    setIsWordRevealed(false);
    setRevealedClueCount(1);
    setTimerRunning(false);
    setPuzzleIndex((prev) => prev + 1);
  };

  const handleAdjustScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-6xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Guess the Word Host Console
          </span>
          <h2 className="text-lg font-bold text-white">
            Puzzle {puzzleIndex + 1} of {filteredPuzzles.length}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-400">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPuzzleIndex(0);
              setRevealedClueCount(1);
              setIsWordRevealed(false);
            }}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="All">All Categories</option>
            {WORD_CLUE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsGameFinished(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            Finish Game
          </button>
        </div>
      </div>

      {/* Main Host Section: Secret Word Box + Clues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-4 bg-[#110924] p-5 sm:p-6 rounded-3xl border border-purple-900/60 shadow-xl">
          {/* Secret Word Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                SECRET WORD (HOST ONLY):
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                {currentPuzzle.word}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700 text-xs font-black text-purple-300">
                Worth: {currentAvailablePoints} PTS
              </span>
              <SharedTimer
                initialSeconds={30}
                isRunning={timerRunning}
                onExpire={() => setTimerRunning(false)}
              />
            </div>
          </div>

          {/* 4 Clues Progression */}
          <div className="space-y-2.5 my-3">
            {currentPuzzle.clues.map((clue, idx) => {
              const isRevealed = idx < revealedClueCount;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                    isRevealed
                      ? 'bg-purple-950/60 border-purple-600 text-purple-100 shadow-md'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                      Clue {idx + 1} ({CLUE_POINTS[idx]} pts)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isRevealed ? 'Visible on TV' : 'Hidden from TV'}
                    </span>
                  </div>
                  <div>{clue}</div>
                </div>
              );
            })}
          </div>

          {/* Host Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-purple-950">
            <button
              onClick={() => setTimerRunning((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow"
            >
              {timerRunning ? 'Pause Timer' : 'Start 30s Timer'}
            </button>

            <button
              onClick={handleRevealNextClue}
              disabled={revealedClueCount >= 4}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors disabled:opacity-40"
            >
              Reveal Next Clue ({revealedClueCount}/4)
            </button>

            <button
              onClick={() => setIsWordRevealed((prev) => !prev)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              {isWordRevealed ? 'Hide Word on TV' : 'Reveal Word on TV'}
            </button>

            <button
              onClick={handleNextPuzzle}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors ml-auto"
            >
              Next Puzzle →
            </button>
          </div>
        </div>

        {/* Right Col: Award Points */}
        <div className="flex flex-col gap-4 bg-[#110924] p-5 rounded-3xl border border-purple-900/60 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-purple-400" />
            Correct Guess (+{currentAvailablePoints} pts)
          </h3>

          <div className="flex flex-col gap-2.5">
            {teams.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800"
              >
                <div>
                  <span className="font-bold text-sm text-white">{t.name}</span>
                  <div className="font-mono text-xs text-purple-400 font-bold">{t.score} pts</div>
                </div>

                <button
                  onClick={() => handleCorrectGuess(t.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors active:scale-95 shadow"
                >
                  +{currentAvailablePoints} pts
                </button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-purple-950 text-[11px] text-slate-400">
            Points decrease as more clues are unveiled!
          </div>
        </div>
      </div>

      {/* Shared Scoreboard */}
      <SharedScoreboard
        teams={teams}
        showControls={true}
        onAdjustScore={handleAdjustScore}
      />

      {/* Winner Podium Modal */}
      <WinnerPodiumModal
        isOpen={isGameFinished}
        gameTitle="Guess the Word"
        participants={teams}
        onPlayAgain={() => {
          setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          setPuzzleIndex(0);
          setRevealedClueCount(1);
          setIsWordRevealed(false);
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
