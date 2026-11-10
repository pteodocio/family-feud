import { useState, useEffect, useRef } from 'react';
import { Shuffle, CheckCircle2 } from 'lucide-react';
import { PICTIONARY_WORDS, PICTIONARY_CATEGORIES, type PictionaryWord } from '../../data/hubData/pictionaryWords';
import { DrawingCanvas, type DrawingCanvasHandle } from '../../components/shared/DrawingCanvas';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface PictionaryHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function PictionaryHostView({ teams: initialTeams, onEndGame, onReturnToHub }: PictionaryHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<PictionaryWord>(PICTIONARY_WORDS[0]);
  const [isWordRevealedOnTv, setIsWordRevealedOnTv] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isGameFinished, setIsGameFinished] = useState(false);
  const canvasRef = useRef<DrawingCanvasHandle | null>(null);

  const activeTeam = teams[activeTeamIndex % teams.length];

  const strokesHistoryRef = useRef<any[]>([]);

  const pickRandomWord = () => {
    let pool = PICTIONARY_WORDS;
    if (selectedCategory !== 'All') {
      pool = pool.filter((w) => w.category === selectedCategory);
    }
    if (pool.length === 0) pool = PICTIONARY_WORDS;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(chosen);
    setIsWordRevealedOnTv(false);
    setTimerRunning(false);
    strokesHistoryRef.current = [];
    canvasRef.current?.clear();
    hubSyncBus.broadcastCanvasClear();
    hubSyncBus.broadcastTimer(60, false);
  };

  const broadcastCurrentState = () => {
    hubSyncBus.broadcastState({
      gameId: 'pictionary',
      category: currentWord.category,
      activeTeamName: activeTeam.name,
      revealedWord: isWordRevealedOnTv ? currentWord.word : null,
      teams,
      isGameFinished,
    });
  };

  useEffect(() => {
    broadcastCurrentState();
  }, [currentWord, isWordRevealedOnTv, activeTeam, teams, isGameFinished]);

  useEffect(() => {
    const unsub = hubSyncBus.onRequestSync(() => {
      broadcastCurrentState();
      if (strokesHistoryRef.current.length > 0) {
        hubSyncBus.broadcastCanvasHistory(strokesHistoryRef.current);
      }
    });
    return () => unsub();
  }, [currentWord, isWordRevealedOnTv, activeTeam, teams, isGameFinished]);

  const handleCorrectGuess = () => {
    setTeams((prev) =>
      prev.map((t, idx) =>
        idx === activeTeamIndex % prev.length ? { ...t, score: t.score + 25 } : t
      )
    );
    setIsWordRevealedOnTv(true);
    setTimerRunning(false);
    hubSyncBus.broadcastTimer(0, false);
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSound('correct');
  };

  const handleNextTurn = () => {
    setActiveTeamIndex((prev) => prev + 1);
    pickRandomWord();
  };

  const handleAdjustScore = (teamId: string, delta: number) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-6xl mx-auto text-slate-100">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Pictionary Host Canvas
          </span>
          <h2 className="text-lg font-bold text-white">
            Artist Team:{' '}
            <span className="text-emerald-400 font-black">{activeTeam.name}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="All">All Categories</option>
            {PICTIONARY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={pickRandomWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            New Word
          </button>

          <button
            onClick={() => setIsGameFinished(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Secret Word Box & Timer Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            SECRET WORD (DO NOT SAY OUT LOUD):
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {currentWord.word}
            <span className="text-xs font-normal text-emerald-300/80 ml-3">
              ({currentWord.category})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SharedTimer
            initialSeconds={60}
            isRunning={timerRunning}
            onTick={(sec) => hubSyncBus.broadcastTimer(sec, true)}
            onExpire={() => {
              setTimerRunning(false);
              hubSyncBus.broadcastTimer(0, false);
            }}
          />

          <button
            onClick={handleCorrectGuess}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors active:scale-95 shadow"
          >
            <CheckCircle2 className="w-4 h-4" />
            Correct (+25 pts)
          </button>

          <button
            onClick={() => setIsWordRevealedOnTv((prev) => !prev)}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            {isWordRevealedOnTv ? 'Hide on TV' : 'Reveal on TV'}
          </button>

          <button
            onClick={handleNextTurn}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Next Turn →
          </button>
        </div>
      </div>

      {/* Interactive Drawing Canvas */}
      <div className="h-[460px] w-full">
        <DrawingCanvas
          ref={canvasRef}
          onStroke={(stroke) => {
            strokesHistoryRef.current.push(stroke);
            hubSyncBus.broadcastCanvasStroke(stroke);
          }}
          onClear={() => {
            strokesHistoryRef.current = [];
            hubSyncBus.broadcastCanvasClear();
          }}
        />
      </div>

      {/* Scoreboard */}
      <SharedScoreboard
        teams={teams}
        activeTeamId={activeTeam.id}
        showControls={true}
        onAdjustScore={handleAdjustScore}
      />

      {/* Winner Podium Modal */}
      <WinnerPodiumModal
        isOpen={isGameFinished}
        gameTitle="Pictionary"
        participants={teams}
        onPlayAgain={() => {
          setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          setActiveTeamIndex(0);
          pickRandomWord();
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
