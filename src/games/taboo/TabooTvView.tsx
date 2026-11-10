import { useState, useEffect } from 'react';
import { Ban, ShieldAlert } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface TabooTvState {
  gameId: string;
  category: string;
  activeTeamName: string;
  activeTeamColor: string;
  strikes: number;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function TabooTvView() {
  const [state, setState] = useState<TabooTvState | null>(() => {
    return hubSyncBus.getLastState('taboo');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>(() => {
    return hubSyncBus.getLastTimer() || { remaining: 60, running: false };
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'taboo') {
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
        <Ban className="w-16 h-16 text-pink-500 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Taboo: Forbidden Words Battle
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to start timer...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <Ban className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Category</span>
            <span className="font-display font-black text-2xl text-white">{state.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 px-4 py-2 rounded-xl border border-rose-800">
            <ShieldAlert className="w-4 h-4" />
            <span>Buzzer Strikes: {state.strikes}</span>
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

      <div className="my-12 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-3">
          Active Clue-Giving Team
        </span>

        <div className="inline-block p-10 sm:p-14 rounded-3xl bg-slate-950/90 border-2 border-pink-500/60 shadow-2xl shadow-pink-500/10 max-w-2xl w-full">
          <span className="font-display font-black text-4xl sm:text-6xl text-pink-400 block drop-shadow-md">
            {state.activeTeamName}
          </span>
          <p className="text-sm sm:text-base text-slate-300 mt-4 font-medium">
            Listen closely to your teammate’s clues! Opposing team is watching for forbidden words.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
