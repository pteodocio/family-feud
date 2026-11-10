import { useState, useEffect } from 'react';
import { Heart, ShieldAlert } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface EliminationTvState {
  gameId: string;
  question: string;
  options: string[];
  correctOptionIndex: number | null;
  explanation: string | null;
  teamLives: Record<string, number>;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function EliminationTvView() {
  const [state, setState] = useState<EliminationTvState | null>(() => {
    return hubSyncBus.getLastState('trivia-elimination');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 30,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'trivia-elimination') {
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
        <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Trivia Elimination TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to start survival round...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Top Banner with Team Life Meters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-6 flex-wrap">
          {state.teams.map((t) => {
            const lives = state.teamLives[t.id] ?? 3;
            const isEliminated = lives <= 0;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isEliminated
                    ? 'bg-red-950/20 border-red-900/40 opacity-40'
                    : 'bg-slate-950 border-slate-800 shadow'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-white">{t.name}</span>
                  {isEliminated && (
                    <span className="text-[10px] font-black uppercase text-red-500 bg-red-950 px-2 py-0.5 rounded-full border border-red-800">
                      ELIMINATED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-2 text-red-500">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-5 h-5 transition-transform duration-300 ${
                        i < lives ? 'fill-current scale-100' : 'text-slate-800 scale-90'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`px-8 py-3 rounded-2xl font-display font-black text-3xl border shrink-0 ${
            timerState.remaining <= 5
              ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-950 border-slate-700 text-white'
          }`}
        >
          {timerState.remaining}s
        </div>
      </div>

      {/* Main Question Display */}
      <div className="my-8 max-w-4xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border-4 border-red-500/60 shadow-2xl text-center">
          <span className="text-xs font-black uppercase tracking-widest text-red-400 block mb-3">
            Survival Trivia Question
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white leading-snug drop-shadow-md">
            "{state.question}"
          </h2>
        </div>

        {/* 4 Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {state.options.map((opt, idx) => {
            const isRevealed = state.correctOptionIndex !== null;
            const isCorrect = idx === state.correctOptionIndex;

            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                  isRevealed
                    ? isCorrect
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 scale-105 shadow-xl shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-900 text-slate-600 opacity-60'
                    : 'bg-slate-900/90 border-slate-800 text-white'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-xl font-display font-black text-lg flex items-center justify-center shrink-0 ${
                    isRevealed && isCorrect
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-red-950 text-red-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-display font-bold text-lg sm:text-xl leading-tight">
                  {opt}
                </span>
              </div>
            );
          })}
        </div>

        {state.explanation && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center animate-in fade-in duration-300">
            <span className="text-xs font-bold text-slate-400 block mb-1">Answer Note:</span>
            <p className="text-sm text-slate-300 font-medium">{state.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
