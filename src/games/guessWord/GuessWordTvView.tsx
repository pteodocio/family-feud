import { useState, useEffect } from 'react';
import { Trophy, Sparkles, Clock } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface GuessWordTvState {
  gameId: string;
  category: string;
  revealedClues: string[];
  currentPoints: number;
  isWordRevealed: boolean;
  secretWord: string | null;
  letterCount?: number;
  wordLetterBlanks?: string;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function GuessWordTvView() {
  const [state, setState] = useState<GuessWordTvState | null>(() => {
    return hubSyncBus.getLastState('guess-the-word');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 30,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'guess-the-word') {
        setState(incoming);
      }
    });

    const unsubTimer = hubSyncBus.onTimerUpdate((timer) => {
      setTimerState(timer);
    });

    hubSyncBus.requestSync();

    return () => {
      unsubState();
      unsubTimer();
    };
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#0e071c] text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-400 mb-4 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-4xl text-white">Guess the Word</h1>
        <p className="text-sm text-slate-400 mt-2">Waiting for host to unveil the first mystery clue...</p>
      </div>
    );
  }

  const {
    category,
    revealedClues,
    currentPoints,
    isWordRevealed,
    secretWord,
    letterCount,
    wordLetterBlanks,
    teams,
    isGameFinished,
  } = state;
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-[#090412] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-900/60 pb-3 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-purple-300 bg-purple-950/80 border border-purple-800 px-4 py-1.5 rounded-full shadow-lg">
            Category: {category}
          </span>
        </div>

        {timerState.running && timerState.remaining > 0 ? (
          <div
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full font-mono font-black text-base sm:text-xl border transition-all ${
              timerState.remaining <= 10
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-900/50'
                : 'bg-purple-950/80 border-purple-700 text-purple-300'
            }`}
          >
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{timerState.remaining}s</span>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-widest block">Current Value</span>
            <span className="text-base sm:text-xl font-black text-amber-300">
              {currentPoints} POINTS
            </span>
          </div>
        )}
      </div>

      {/* Main Mystery Stage: Clues & Secret Word OR Winner Podium */}
      {isGameFinished && winner ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-6 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/30 animate-pulse">
            <Trophy className="w-12 h-12" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400 block mb-2">
            Guess the Word Champion
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight drop-shadow-2xl">
            {winner.name} WINS!
          </h1>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-3">{winner.score} POINTS</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            Official Match Concluded
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto my-6">
          {isWordRevealed && secretWord ? (
            <div className="bg-gradient-to-b from-purple-950 to-indigo-950 border-4 border-purple-400 rounded-3xl p-8 sm:p-14 shadow-2xl text-center animate-in zoom-in duration-300 mb-6">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-purple-300 block mb-3">
                The Mystery Word Is:
              </span>
              <h1 className="font-display font-black text-4xl sm:text-7xl text-white tracking-tight drop-shadow-2xl">
                {secretWord}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                Puzzle Solved!
              </div>
            </div>
          ) : (
            <div className="bg-[#120824] border-2 border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl mb-6 text-center">
              <div className="flex items-center justify-between mb-3 px-2 sm:px-4">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-purple-400 animate-pulse">
                  [ MYSTERY WORD ]
                </span>
                {letterCount ? (
                  <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-3 py-0.5 rounded-full border border-purple-800">
                    {letterCount} Letters
                  </span>
                ) : null}
              </div>
              <div className="font-mono font-black text-3xl sm:text-5xl text-purple-200 tracking-[0.3em]">
                {wordLetterBlanks || '? ? ? ? ?'}
              </div>
            </div>
          )}

          {/* Revealed Clues List */}
          <div className="space-y-3">
            {revealedClues.map((clue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-[#140b28] border-2 border-purple-600/70 text-base sm:text-xl font-bold text-white shadow-lg animate-in slide-in-from-bottom-2 duration-300"
              >
                <span className="w-8 h-8 rounded-full bg-purple-500 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <span className="leading-snug">{clue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scoreboard at bottom */}
      <div className="max-w-6xl w-full mx-auto pt-3 border-t border-purple-950">
        <SharedScoreboard teams={teams} />
      </div>
    </div>
  );
}
