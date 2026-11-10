import { useState, useEffect } from 'react';
import { RotateCw, Sparkles } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface WheelTvState {
  gameId: string;
  phrase: string;
  category: string;
  guessedLetters: string[];
  activeTeamName: string;
  activeTeamColor: string;
  roundBank: number;
  currentWedge: string | null;
  isSpinning: boolean;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function WheelFortuneTvView() {
  const [state, setState] = useState<WheelTvState | null>(() => {
    return hubSyncBus.getLastState('wheel-of-fortune');
  });

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'wheel-of-fortune') {
        setState(incoming);
      }
    });

    hubSyncBus.requestSync();

    return () => {
      unsubState();
    };
  }, []);

  if (!state) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8">
        <RotateCw className="w-16 h-16 text-emerald-400 animate-spin mb-4" />
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
          Wheel of Fortune TV Board
        </h2>
        <p className="text-slate-400 mt-2">Waiting for Host to spin the wheel...</p>
      </div>
    );
  }

  // Split phrase into words for clean wrapped lines
  const words = state.phrase.split(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-between min-h-[85vh]">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <RotateCw className={`w-8 h-8 ${state.isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Category</span>
            <span className="font-display font-black text-2xl text-white">{state.category}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-display font-black text-xl">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Round Pot: ${state.roundBank}</span>
          </div>

          {state.currentWedge && (
            <div className="px-6 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 font-display font-black text-xl shadow-lg animate-in zoom-in-95 duration-200">
              {state.currentWedge}
            </div>
          )}
        </div>
      </div>

      {/* Centerpiece: Word Tile Wall */}
      <div className="my-8 text-center">
        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
            Active Team
          </span>
          <span className="font-display font-black text-3xl sm:text-4xl px-8 py-2 rounded-full inline-block bg-emerald-950/90 text-emerald-300 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
            {state.activeTeamName}
          </span>
        </div>

        {/* Puzzle Board Tiles */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border-4 border-emerald-500/60 shadow-2xl inline-block max-w-5xl w-full">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {words.map((word, wIdx) => (
              <div key={wIdx} className="flex items-center gap-2">
                {word.split('').map((char, cIdx) => {
                  const upperChar = char.toUpperCase();
                  const isRevealed = state.guessedLetters.includes(upperChar);
                  const isSpecial = !/[A-Z]/.test(upperChar);

                  return (
                    <div
                      key={cIdx}
                      className={`w-12 h-16 sm:w-16 sm:h-20 rounded-xl font-display font-black text-3xl sm:text-4xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isSpecial
                          ? 'bg-transparent text-white border-transparent'
                          : isRevealed
                          ? 'bg-emerald-400 text-slate-950 border-white shadow-lg animate-in flip-in-y duration-300'
                          : 'bg-slate-900 border-slate-700 text-transparent shadow-inner'
                      }`}
                    >
                      {isSpecial ? char : isRevealed ? char : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Scoreboard */}
      <div className="mt-6">
        <SharedScoreboard participants={state.teams || []} isTvView={true} />
      </div>
    </div>
  );
}
