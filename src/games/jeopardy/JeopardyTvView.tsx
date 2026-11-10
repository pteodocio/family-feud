import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface JeopardyTvCategory {
  id: string;
  name: string;
  tiles: {
    id: string;
    value: number;
    isUsed: boolean;
  }[];
}

interface JeopardyTvState {
  gameId: string;
  categories: JeopardyTvCategory[];
  activeQuestion: {
    catName: string;
    value: number;
    clue: string;
    isDailyDouble: boolean;
    answer: string | null;
  } | null;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function JeopardyTvView() {
  const [state, setState] = useState<JeopardyTvState | null>(() => {
    return hubSyncBus.getLastState('jeopardy');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 30,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'jeopardy') {
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
        <Trophy className="w-16 h-16 text-blue-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Jeopardy! TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to initialize game board...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Active Clue Overlay Mode */}
      {state.activeQuestion ? (
        <div className="flex-1 flex flex-col items-center justify-center my-6 animate-in zoom-in-95 duration-300">
          <div className="max-w-4xl w-full p-8 sm:p-12 rounded-3xl bg-blue-950/90 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-blue-800">
              <span className="font-display font-black text-xl sm:text-2xl text-amber-300 uppercase tracking-widest">
                {state.activeQuestion.catName}
              </span>

              <div className="flex items-center gap-4">
                {state.activeQuestion.isDailyDouble && (
                  <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 animate-bounce">
                    DAILY DOUBLE!
                  </span>
                )}
                <span className="font-display font-black text-2xl text-white">
                  ${state.activeQuestion.value}
                </span>
                <span className="px-4 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-lg text-amber-400">
                  {timerState.remaining}s
                </span>
              </div>
            </div>

            {/* Clue Text */}
            <div className="my-10">
              <p className="font-display font-black text-3xl sm:text-5xl text-white leading-tight drop-shadow-md">
                "{state.activeQuestion.clue}"
              </p>
            </div>

            {/* Answer (Only if Host revealed) */}
            {state.activeQuestion.answer && (
              <div className="mt-8 pt-6 border-t border-blue-800 animate-in fade-in duration-300">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Correct Response:
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-emerald-300">
                  {state.activeQuestion.answer}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Regular 5x5 TV Board */
        <div className="my-6">
          <div className="grid grid-cols-5 gap-3 bg-blue-950/40 p-4 rounded-3xl border-2 border-blue-800 shadow-2xl">
            {state.categories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                <div className="h-20 p-2 rounded-2xl bg-gradient-to-b from-blue-900 to-blue-950 text-center flex items-center justify-center font-display font-black text-sm sm:text-base text-amber-300 uppercase tracking-tight shadow border-2 border-blue-700">
                  {cat.name}
                </div>

                {cat.tiles.map((tile) => (
                  <div
                    key={tile.id}
                    className={`h-16 rounded-2xl font-display font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg transition-all ${
                      tile.isUsed
                        ? 'bg-slate-950/80 text-slate-700 border border-slate-900'
                        : 'bg-gradient-to-b from-blue-800 to-blue-900 text-amber-400 border border-blue-600 shadow-blue-900/60'
                    }`}
                  >
                    {tile.isUsed ? '' : `$${tile.value}`}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Scoreboard */}
      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
