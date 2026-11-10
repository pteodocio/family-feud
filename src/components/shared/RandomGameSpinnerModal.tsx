import { useState, useEffect } from 'react';
import { Play, RotateCcw, X, Dices } from 'lucide-react';
import { GAMES_CATALOG } from '../../games/registry';
import { soundManager } from '../../audio/soundManager';
import { triggerConfetti } from '../../utils/confetti';
import type { GameCatalogItem } from '../../types/hub';

interface RandomGameSpinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (gameId: string) => void;
}

export function RandomGameSpinnerModal({
  isOpen,
  onClose,
  onSelectGame,
}: RandomGameSpinnerModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<GameCatalogItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedGame(null);
      setIsSpinning(false);
    }
  }, [isOpen]);

  const startSpin = () => {
    setIsSpinning(true);
    setSelectedGame(null);
    soundManager.init();

    let speed = 60;
    let currentIdx = 0;
    let ticks = 0;
    const totalTicks = 25 + Math.floor(Math.random() * 15);

    const step = () => {
      currentIdx = (currentIdx + 1) % GAMES_CATALOG.length;
      setHighlightedIndex(currentIdx);
      soundManager.playPartyCue('tick');
      ticks++;

      if (ticks < totalTicks) {
        speed = Math.floor(speed * 1.07); // Slow down gradually
        setTimeout(step, speed);
      } else {
        // Landed!
        const finalGame = GAMES_CATALOG[currentIdx];
        setSelectedGame(finalGame);
        setIsSpinning(false);
        soundManager.playPartyCue('fanfare');
        triggerConfetti(2500);
      }
    };

    setTimeout(step, speed);
  };

  useEffect(() => {
    if (isOpen) {
      startSpin();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#0c1836] to-[#050b18] border-2 border-amber-400/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Dices className="w-6 h-6 text-amber-400" />
            <h3 className="font-display font-black text-xl text-white">
              Surprise Game Wheel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel / Wheel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
          {GAMES_CATALOG.map((g, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={g.id}
                className={`p-3 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center min-h-[90px] ${
                  isHighlighted
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black scale-105 shadow-lg shadow-amber-500/40 ring-2 ring-amber-300'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full mb-1.5"
                  style={{ backgroundColor: g.accentColor }}
                />
                <span className="font-display font-bold text-xs text-center leading-tight">
                  {g.name}
                </span>
                <span className="text-[10px] opacity-75 mt-0.5">{g.category}</span>
              </div>
            );
          })}
        </div>

        {/* Result Announcement */}
        {selectedGame && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/60 mb-6 animate-in zoom-in-95 duration-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              ✨ Tonight's Chosen Game
            </span>
            <h4 className="font-display font-black text-2xl text-white">
              {selectedGame.name}
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              {selectedGame.description}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={startSpin}
            disabled={isSpinning}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Spinning...' : selectedGame ? 'Spin Again' : 'Spin The Wheel'}
          </button>

          {selectedGame && (
            <button
              onClick={() => {
                onSelectGame(selectedGame.id);
                onClose();
              }}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-black text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Play {selectedGame.name} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
