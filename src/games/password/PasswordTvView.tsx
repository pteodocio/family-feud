import { useState, useEffect } from 'react';
import { KeyRound, Sparkles, Trophy } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface PasswordTvState {
  gameId: string;
  secretWord: string | null;
  isRevealed: boolean;
  category: string;
  clueCount: number;
  pointsValue: number;
  activeTeamIndex: number;
  activeTeamName: string;
  activeTeamColor: string;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function PasswordTvView() {
  const [state, setState] = useState<PasswordTvState | null>(() => {
    return hubSyncBus.getLastState('password');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 15,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'password') {
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <KeyRound className="w-16 h-16 text-cyan-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Password: Team Battle
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to start round...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Top Banner: Category & Timer */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Category</span>
            <span className="font-display font-black text-2xl text-white">{state.category}</span>
          </div>
        </div>

        {/* Clue Ladder points badge */}
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-display font-black text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Worth: {state.pointsValue} Pts</span>
          </div>

          <div
            className={`px-6 py-2.5 rounded-2xl font-display font-black text-2xl border ${
              timerState.remaining <= 5
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-700 text-white'
            }`}
          >
            {timerState.remaining}s
          </div>
        </div>
      </div>

      {/* Centerpiece Word / Mystery Box */}
      <div className="my-8 text-center">
        <div className="mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
            Active Guessing Team
          </span>
          <span className="font-display font-black text-3xl sm:text-4xl px-8 py-2 rounded-full inline-block bg-cyan-950/90 text-cyan-300 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
            {state.activeTeamName}
          </span>
        </div>

        <div className="mt-8 max-w-3xl mx-auto p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
          {state.isRevealed ? (
            <div className="animate-in zoom-in-95 duration-500">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-3">
                Password Solved!
              </span>
              <div className="text-5xl sm:text-7xl font-display font-black text-white tracking-widest drop-shadow-xl text-emerald-300">
                {state.secretWord}
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">
                Secret Password Clue #{state.clueCount}
              </span>
              <div className="flex items-center justify-center gap-3 text-5xl sm:text-6xl text-cyan-400/80 font-mono tracking-widest">
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-6 font-medium">
                Listen carefully to the 1-word clue from your teammate!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Live Scoreboard */}
      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
