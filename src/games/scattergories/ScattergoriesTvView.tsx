import { useState, useEffect } from 'react';
import { Dices } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface ScattergoriesTvState {
  gameId: string;
  letter: string;
  categories: string[];
  isReviewing: boolean;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function ScattergoriesTvView() {
  const [state, setState] = useState<ScattergoriesTvState | null>(() => {
    return hubSyncBus.getLastState('scattergories');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 120,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'scattergories') {
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
        <Dices className="w-16 h-16 text-rose-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Scattergories TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to roll the letter...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Top Banner with Giant Letter and Timer */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white font-display font-black text-4xl flex items-center justify-center shadow-lg shadow-rose-900/40">
            {state.letter}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
              Round Key Letter
            </span>
            <span className="font-display font-black text-2xl text-white">
              All answers must begin with "{state.letter}"
            </span>
          </div>
        </div>

        <div
          className={`px-8 py-3 rounded-2xl font-display font-black text-3xl border ${
            timerState.remaining <= 15
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-950 border-slate-700 text-white'
          }`}
        >
          {timerState.remaining}s
        </div>
      </div>

      {/* Category List */}
      <div className="my-8 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {state.categories.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 flex items-center gap-4 shadow-lg hover:border-rose-500/50 transition-colors"
            >
              <span className="w-10 h-10 rounded-xl bg-rose-950 text-rose-300 font-display font-black text-lg flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="font-display font-bold text-lg sm:text-xl text-white leading-tight">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
