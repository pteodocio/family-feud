import { useState, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface HeadsUpTvState {
  gameId: string;
  item: string;
  category: string;
  activeTeamName: string;
  activeTeamColor: string;
  correctCount: number;
  passCount: number;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function HeadsUpTvView() {
  const [state, setState] = useState<HeadsUpTvState | null>(() => {
    return hubSyncBus.getLastState('heads-up');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 60,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'heads-up') {
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
        <Smile className="w-16 h-16 text-yellow-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Heads Up! TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to start timer...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
            <Smile className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Category</span>
            <span className="font-display font-black text-2xl text-white">{state.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <span>Score: <b className="text-emerald-400 text-lg">+{state.correctCount}</b></span>
            <span>·</span>
            <span>Passes: <b className="text-rose-400">{state.passCount}</b></span>
          </div>

          <div
            className={`px-8 py-3 rounded-2xl font-display font-black text-3xl border ${
              timerState.remaining <= 10
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950 border-slate-700 text-white'
            }`}
          >
            {timerState.remaining}s
          </div>
        </div>
      </div>

      <div className="my-10 text-center">
        <div className="mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
            Active Guesser Team
          </span>
          <span className="font-display font-black text-3xl px-8 py-2 rounded-full inline-block bg-yellow-950/90 text-yellow-300 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20">
            {state.activeTeamName}
          </span>
        </div>

        {/* Giant TV Word Card for Audience Clue Shouting */}
        <div className="p-10 sm:p-16 rounded-3xl bg-slate-950 border-4 border-yellow-500/60 shadow-2xl inline-block max-w-4xl w-full animate-in zoom-in-95 duration-200">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">
            SHOUT CLUES (DON’T SAY THE NAME!)
          </span>
          <div className="text-5xl sm:text-7xl font-display font-black text-white tracking-wide drop-shadow-xl text-yellow-300">
            {state.item}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
