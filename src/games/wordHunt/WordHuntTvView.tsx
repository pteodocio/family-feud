import { useState, useEffect } from 'react';
import { Grid, Clock, Trophy } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface WordHuntTvState {
  gameId: string;
  grid: string[][];
  roundNumber: number;
  isScoringRound: boolean;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function WordHuntTvView() {
  const [state, setState] = useState<WordHuntTvState | null>(() => {
    return hubSyncBus.getLastState('word-hunt');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 90,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'word-hunt') {
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
        <Grid className="w-16 h-16 text-teal-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Word Hunt 4x4 Grid
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to roll the letter grid...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
            <Grid className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Round {state.roundNumber}</span>
            <span className="font-display font-black text-2xl text-white">Trace Connected Words</span>
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

      {/* Giant 4x4 Letter Grid */}
      <div className="my-10 flex flex-col items-center justify-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border-4 border-teal-500/60 shadow-2xl inline-block">
          <div className="grid grid-cols-4 gap-4 sm:gap-6">
            {state.grid.map((row, rIdx) =>
              row.map((char, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-teal-500/50 font-display font-black text-4xl sm:text-6xl text-white flex items-center justify-center shadow-xl shadow-teal-950/40"
                >
                  {char}
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mt-6 font-medium text-center max-w-lg">
          Trace adjacent letters horizontally, vertically, or diagonally. 3+ letters. Duplicate words cancel out!
        </p>
      </div>

      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
