import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { getBingoLetter, type BingoPattern } from '../../data/hubData/bingoPatterns';

interface BingoTvState {
  gameId: string;
  calledNumbers: number[];
  currentNumber: number | null;
  selectedPattern: BingoPattern | null;
  winnerName: string | null;
  isGameFinished: boolean;
}

export function BingoTvView() {
  const [state, setState] = useState<BingoTvState | null>(null);

  useEffect(() => {
    const unsub = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'family-bingo') {
        setState(incoming);
      }
    });

    hubSyncBus.requestSync();
    return () => unsub();
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#110c03] text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-4xl text-white">Family Bingo</h1>
        <p className="text-sm text-slate-400 mt-2">Waiting for caller to roll the first ball...</p>
      </div>
    );
  }

  const { calledNumbers, currentNumber, selectedPattern, winnerName, isGameFinished } = state;

  return (
    <div className="min-h-screen bg-[#070501] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-900/60 pb-3 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 border border-amber-800 px-4 py-1.5 rounded-full shadow-lg">
            Pattern: {selectedPattern?.name || 'Standard Line'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase tracking-widest block">Numbers Called</span>
          <span className="text-base sm:text-lg font-black text-amber-300">
            {calledNumbers.length} / 75
          </span>
        </div>
      </div>

      {/* Main Display: Caller Spotlight & 75-Number Master Grid */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl w-full mx-auto my-6">
        {/* Ball Spotlight */}
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#140e02] border-4 border-amber-400/80 shadow-2xl shadow-amber-500/20 text-center min-w-[280px]">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400 mb-3">
            Last Called Ball
          </span>

          {currentNumber ? (
            <div className="w-40 h-40 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-amber-100 flex flex-col items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/50 animate-in zoom-in duration-200">
              <span className="text-3xl font-black leading-none">{getBingoLetter(currentNumber)}</span>
              <span className="text-7xl font-black font-mono leading-none">{currentNumber}</span>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center text-sm text-amber-400/60 font-bold">
              Waiting for Ball
            </div>
          )}

          <div className="text-xs text-amber-300/80 mt-4 max-w-[220px]">
            {selectedPattern?.description}
          </div>
        </div>

        {/* 75-Number Master Tracking Grid */}
        <div className="flex-1 p-6 rounded-3xl bg-[#0c0903] border-2 border-amber-900/60 shadow-2xl w-full">
          {/* B I N G O Row labels */}
          <div className="space-y-3 font-mono">
            {(['B', 'I', 'N', 'G', 'O'] as const).map((letter, rowIdx) => {
              const start = rowIdx * 15 + 1;
              const nums = Array.from({ length: 15 }, (_, i) => start + i);

              return (
                <div key={letter} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black font-display text-sm flex items-center justify-center shadow">
                    {letter}
                  </span>
                  <div className="grid grid-cols-15 gap-1.5 flex-1">
                    {nums.map((n) => {
                      const isCalled = calledNumbers.includes(n);
                      const isLatest = currentNumber === n;

                      return (
                        <div
                          key={n}
                          className={`h-9 flex items-center justify-center rounded-lg border font-bold text-xs sm:text-sm transition-all ${
                            isLatest
                              ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-300 scale-110 font-black shadow-lg shadow-amber-500/50'
                              : isCalled
                              ? 'bg-amber-500/30 text-amber-300 border-amber-500/80'
                              : 'bg-slate-950/70 text-slate-600 border-slate-900'
                          }`}
                        >
                          {n}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Winner Celebration Banner if BINGO called */}
      {isGameFinished && winnerName && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 py-4 px-8 rounded-2xl text-center font-display font-black text-2xl sm:text-4xl shadow-2xl animate-bounce max-w-4xl mx-auto w-full">
          BINGO! WINNER: {winnerName.toUpperCase()}!
        </div>
      )}
    </div>
  );
}
