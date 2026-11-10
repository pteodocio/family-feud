import { useState, useEffect } from 'react';
import { Trophy, Sparkles, Clock } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface CharadesTvState {
  gameId: string;
  category: string;
  difficulty: string;
  points: number;
  activeTeamName: string;
  revealedWord: string | null;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function CharadesTvView() {
  const [state, setState] = useState<CharadesTvState | null>(() => {
    return hubSyncBus.getLastState('charades');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>(() => {
    return hubSyncBus.getLastTimer() || { remaining: 60, running: false };
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'charades') {
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
      <div className="min-h-screen bg-[#0d0517] text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400 mb-4 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-4xl text-white">Charades Party</h1>
        <p className="text-sm text-slate-400 mt-2">Waiting for host to begin the round...</p>
      </div>
    );
  }

  const { category, difficulty, points, activeTeamName, revealedWord, teams, isGameFinished } = state;
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-[#0a0412] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-900/60 pb-4 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-black uppercase tracking-widest text-rose-300 bg-rose-950/80 border border-rose-800 px-4 py-1.5 rounded-full shadow-lg">
            {category}
          </span>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full">
            {difficulty.toUpperCase()} · {points} PTS
          </span>
        </div>

        {timerState.running && timerState.remaining > 0 ? (
          <div
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono font-black text-base sm:text-xl border transition-all ${
              timerState.remaining <= 10
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-900/50'
                : 'bg-rose-950/80 border-rose-700 text-rose-300'
            }`}
          >
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{timerState.remaining}s</span>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-widest block">Acting Now</span>
            <span className="text-lg font-black text-white">{activeTeamName}</span>
          </div>
        )}
      </div>

      {/* Main Acting & Word Stage OR Winner Podium */}
      {isGameFinished && winner ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-6 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/30 animate-pulse">
            <Trophy className="w-12 h-12" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400 block mb-2">
            Charades Champion
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
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto my-8 text-center">
          {revealedWord ? (
            <div className="bg-gradient-to-b from-rose-950/90 to-purple-950/90 border-4 border-rose-400 rounded-3xl p-8 sm:p-16 shadow-2xl shadow-rose-500/30 w-full animate-in zoom-in duration-300">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-rose-300 block mb-3">
                The Secret Word Was:
              </span>
              <h1 className="font-display font-black text-4xl sm:text-7xl text-white tracking-tight drop-shadow-2xl">
                {revealedWord}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                Round Completed!
              </div>
            </div>
          ) : (
            <div className="bg-[#130722] border-2 border-slate-800 rounded-3xl p-8 sm:p-16 shadow-2xl w-full">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-rose-400/80 block mb-4 animate-pulse">
                [ ACTING IN PROGRESS - NO TALKING! ]
              </span>
              <div className="font-display font-black text-3xl sm:text-5xl text-slate-400 tracking-tight">
                Guess the Word!
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-4 max-w-md mx-auto">
                Shout out guesses to your teammate before the countdown timer hits zero!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scoreboard at bottom */}
      <div className="max-w-6xl w-full mx-auto pt-4 border-t border-rose-950">
        <SharedScoreboard teams={teams} />
      </div>
    </div>
  );
}
