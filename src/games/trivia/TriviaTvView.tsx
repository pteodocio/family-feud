import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface TriviaTvState {
  gameId: string;
  question: {
    category: string;
    prompt: string;
    options: string[];
    isAnswerRevealed: boolean;
    correctOptionIndex: number | null;
  };
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function TriviaTvView() {
  const [state, setState] = useState<TriviaTvState | null>(() => {
    return hubSyncBus.getLastState('family-trivia');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 20,
    running: false,
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'family-trivia') {
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

  if (!state || !state.question) {
    return (
      <div className="min-h-screen bg-[#060b18] text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-sky-400 mb-4 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-4xl text-white">Family Trivia</h1>
        <p className="text-sm text-slate-400 mt-2">Waiting for host to start the round...</p>
      </div>
    );
  }

  const { question, teams, isGameFinished } = state;
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-[#050a16] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden">
      {/* Category & Timer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl w-full mx-auto">
        <span className="text-sm sm:text-base font-black uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800 px-4 py-1.5 rounded-full shadow-lg">
          {question.category}
        </span>

        {timerState.running && timerState.remaining > 0 ? (
          <div
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono font-black text-base sm:text-xl border transition-all ${
              timerState.remaining <= 5
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-900/50'
                : 'bg-sky-950/80 border-sky-700 text-sky-300'
            }`}
          >
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{timerState.remaining}s</span>
          </div>
        ) : (
          <span className="text-xs sm:text-sm font-bold text-slate-400 tracking-wider">
            FAMILY GAME HUB TV
          </span>
        )}
      </div>

      {/* Main Question & Options Board OR Winner Podium */}
      {isGameFinished && winner ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-6 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/30 animate-pulse">
            <Trophy className="w-12 h-12" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400 block mb-2">
            Trivia Champion
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
        <div className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto my-6">
          {/* Question Prompt */}
          <div className="bg-[#0b1733] border-2 border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center mb-8">
            <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              {question.prompt}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {question.options.map((opt, idx) => {
              const isCorrect =
                question.isAnswerRevealed && idx === question.correctOptionIndex;

              return (
                <div
                  key={idx}
                  className={`p-5 sm:p-7 rounded-2xl border-2 flex items-center justify-between text-lg sm:text-2xl font-bold transition-all duration-300 ${
                    isCorrect
                      ? 'bg-gradient-to-r from-emerald-950 to-emerald-900 border-emerald-400 text-white scale-[1.02] shadow-2xl shadow-emerald-500/30'
                      : 'bg-[#0c1630]/90 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                        isCorrect ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-sky-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isCorrect && (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Live Scoreboard */}
      <div className="max-w-6xl w-full mx-auto pt-4 border-t border-slate-800">
        <SharedScoreboard teams={teams} />
      </div>
    </div>
  );
}
