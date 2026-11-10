import { useState, useEffect } from 'react';
import { Play, Shuffle, Eye, CheckCircle2, Sparkles, SkipForward, Clock } from 'lucide-react';
import { CHARADES_WORDS, CHARADES_CATEGORIES, type CharadesWord } from '../../data/hubData/charadesWords';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';
import { recordContentUsage } from '../../services/contentHistory';
import { regenerateSingleCharadesItem } from '../../services/contentEngine';

interface CharadesHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function CharadesHostView({ teams: initialTeams, onEndGame, onReturnToHub }: CharadesHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );
  const [words, setWords] = useState<CharadesWord[]>(() => {
    try {
      const raw = sessionStorage.getItem('hub_custom_content_charades');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return CHARADES_WORDS;
  });
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<CharadesWord>(() => {
    try {
      const raw = sessionStorage.getItem('hub_custom_content_charades');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return CHARADES_WORDS[0];
  });
  const [isWordRevealedOnTv, setIsWordRevealedOnTv] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState<30 | 60 | 90>(60);
  const [skipsCount, setSkipsCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);

  const activeTeam = teams[activeTeamIndex % teams.length];

  // Pick random word based on filters
  const pickRandomWord = () => {
    let pool = words;
    if (selectedCategory !== 'All') {
      pool = pool.filter((w) => w.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      pool = pool.filter((w) => w.difficulty === selectedDifficulty);
    }
    if (pool.length === 0) pool = words;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(chosen);
    setIsWordRevealedOnTv(false);
    setTimerRunning(false);
  };

  const handleSkipWord = () => {
    setSkipsCount((prev) => prev + 1);
    soundManager.playPartyCue('tick');
    pickRandomWord();
  };

  const handleGenerateFreshWord = async () => {
    setIsGeneratingNext(true);
    try {
      const fresh = await regenerateSingleCharadesItem({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        difficulty: selectedDifficulty,
      });
      if (fresh) {
        setWords((prev) => [...prev, fresh]);
        setCurrentWord(fresh);
        setIsWordRevealedOnTv(false);
        setTimerRunning(false);
      }
    } finally {
      setIsGeneratingNext(false);
    }
  };

  // Broadcast state to TV Display whenever state changes or sync is requested
  const broadcastCurrentState = () => {
    hubSyncBus.broadcastState({
      gameId: 'charades',
      category: currentWord.category,
      difficulty: currentWord.difficulty,
      points: currentWord.points,
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
    });
    return () => unsub();
  }, [currentWord, isWordRevealedOnTv, activeTeam, teams, isGameFinished]);

  const handleCorrectGuess = () => {
    setTeams((prev) =>
      prev.map((t, idx) =>
        idx === activeTeamIndex % prev.length ? { ...t, score: t.score + currentWord.points } : t
      )
    );
    setIsWordRevealedOnTv(true);
    setTimerRunning(false);
    hubSyncBus.broadcastTimer(0, false);
    soundManager.playPartyCue('correct');
    hubSyncBus.broadcastSound('correct');

    if (currentWord) {
      recordContentUsage({
        gameId: 'charades',
        itemTitle: currentWord.word,
        category: currentWord.category,
        difficulty: currentWord.difficulty,
      });
    }
  };

  const handleNextTurn = () => {
    setActiveTeamIndex((prev) => prev + 1);
    setSkipsCount(0);
    setTimerRunning(false);
    hubSyncBus.broadcastTimer(timerDuration, false);
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
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Charades Party Host Console
          </span>
          <h2 className="text-lg font-bold text-white">
            Current Turn:{' '}
            <span className="text-amber-400 font-black">{activeTeam.name}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Timer preset selector */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value) as any)}
              className="bg-transparent text-xs text-white focus:outline-none"
              title="Timer Duration"
            >
              <option value={30}>30s</option>
              <option value={60}>60s</option>
              <option value={90}>90s</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="All">All Categories</option>
            {CHARADES_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="all">Any Difficulty</option>
            <option value="easy">Easy (1 pt)</option>
            <option value="medium">Medium (2 pts)</option>
            <option value="hard">Hard (3 pts)</option>
          </select>

          <button
            onClick={pickRandomWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Pick from Pool
          </button>

          <button
            onClick={handleGenerateFreshWord}
            disabled={isGeneratingNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
            title="Generate a fresh prompt on the fly"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNext ? 'animate-spin' : ''}`} />
            <span>{isGeneratingNext ? 'Generating...' : '+ Generate New'}</span>
          </button>

          <button
            onClick={() => setIsGameFinished(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            End Game
          </button>
        </div>
      </div>

      {/* Secret Word Box (Host Eyes Only) */}
      <div className="bg-[#12081d] border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-800 px-3 py-1 rounded-full">
            {currentWord.category} · {currentWord.difficulty.toUpperCase()} ({currentWord.points} PTS)
          </span>

          <span className="text-xs font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full">
            SECRET WORD — HOST ONLY
          </span>

          <SharedTimer
            initialSeconds={timerDuration}
            resetKey={`${currentWord?.word}_${activeTeamIndex}`}
            isRunning={timerRunning}
            onToggle={() => setTimerRunning((prev) => !prev)}
            onReset={() => setTimerRunning(false)}
            onExpire={() => {
              setTimerRunning(false);
            }}
          />
        </div>

        <div className="py-6">
          <span className="text-xs text-rose-300 font-bold uppercase tracking-widest block mb-1">
            Act Out This Phrase:
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight drop-shadow-lg">
            {currentWord.word}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-rose-950">
          <button
            onClick={() => setTimerRunning((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            {timerRunning ? `Pause ${timerDuration}s Timer` : `Start ${timerDuration}s Timer`}
          </button>

          <button
            onClick={handleCorrectGuess}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            Guessed Correctly! (+{currentWord.points} pts)
          </button>

          <button
            onClick={handleSkipWord}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-sm font-bold transition-colors"
            title="Pass to next word if actor is stumped"
          >
            <SkipForward className="w-4 h-4" />
            Pass / Skip ({skipsCount})
          </button>

          <button
            onClick={() => setIsWordRevealedOnTv((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isWordRevealedOnTv ? 'Hide on TV' : 'Reveal Word to Audience'}
          </button>

          <button
            onClick={handleNextTurn}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors ml-auto"
          >
            Next Team Turn
          </button>
        </div>
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
        gameTitle="Charades Party"
        participants={teams}
        onPlayAgain={() => {
          setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          setActiveTeamIndex(0);
          setSkipsCount(0);
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
