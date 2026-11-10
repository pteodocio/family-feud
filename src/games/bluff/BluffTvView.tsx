import { useState, useEffect } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface BluffTvChoice {
  id: string;
  letter: string;
  text: string;
  isTrue: boolean;
  authorTeamName: string | null;
  votesCount: number;
}

interface BluffTvState {
  gameId: string;
  question: string;
  explanation: string | null;
  choices: BluffTvChoice[];
  isVotingActive: boolean;
  isRevealed: boolean;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function BluffTvView() {
  const [state, setState] = useState<BluffTvState | null>(() => {
    return hubSyncBus.getLastState('bluff-the-answer');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean } | null>(() => {
    return hubSyncBus.getLastTimer();
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'bluff-the-answer') {
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
        <MessageSquareQuote className="w-16 h-16 text-purple-400 animate-pulse mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Bluff the Answer TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to present trivia question...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Question Card */}
      <div className="max-w-4xl mx-auto w-full p-8 sm:p-12 rounded-3xl bg-slate-900/90 border-2 border-purple-500/50 shadow-2xl text-center relative">
        {timerState && timerState.running && timerState.remaining > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-black text-sm">
            <span>{timerState.remaining}s</span>
          </div>
        )}
        <span className="text-xs font-black uppercase tracking-widest text-purple-400 block mb-3">
          Bizarre Trivia Challenge
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-white leading-snug drop-shadow-md">
          "{state.question}"
        </h2>
      </div>

      {/* Choices Grid */}
      <div className="my-8 max-w-4xl mx-auto w-full">
        {state.isVotingActive && state.choices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.choices.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-3xl border-2 transition-all duration-300 flex items-start gap-4 shadow-xl ${
                  state.isRevealed
                    ? c.isTrue
                      ? 'bg-emerald-950/90 border-emerald-400 scale-105 shadow-emerald-500/30'
                      : 'bg-slate-950/80 border-slate-800 opacity-70'
                    : 'bg-slate-900/90 border-slate-700 hover:border-purple-400'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-2xl font-display font-black text-lg flex items-center justify-center shrink-0 shadow ${
                    state.isRevealed && c.isTrue
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-purple-900 text-purple-200'
                  }`}
                >
                  {c.letter}
                </span>

                <div className="flex-1">
                  <p className="font-display font-bold text-lg sm:text-xl text-white leading-tight">
                    {c.text}
                  </p>

                  {state.isRevealed && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span
                        className={`font-black uppercase tracking-wider ${
                          c.isTrue ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {c.authorTeamName}
                      </span>
                      <span className="text-amber-400 font-bold">
                        {c.votesCount} {c.votesCount === 1 ? 'Vote' : 'Votes'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-950/40 rounded-3xl border border-slate-800">
            Teams are writing their fake answers... Get ready to spot the truth!
          </div>
        )}

        {/* Explanation upon reveal */}
        {state.explanation && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center animate-in fade-in duration-300">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              The Real Story:
            </span>
            <p className="text-sm text-slate-200 font-medium">{state.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Scoreboard */}
      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
