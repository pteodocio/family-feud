import { useEffect } from 'react';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../audio/soundManager';
import type { ScoreboardParticipant } from './SharedScoreboard';

interface WinnerPodiumModalProps {
  isOpen: boolean;
  gameTitle: string;
  participants: ScoreboardParticipant[];
  onPlayAgain: () => void;
  onReturnToHub: () => void;
}

export function WinnerPodiumModal({
  isOpen,
  gameTitle,
  participants,
  onPlayAgain,
  onReturnToHub,
}: WinnerPodiumModalProps) {
  useEffect(() => {
    if (isOpen) {
      soundManager.playPartyCue('fanfare');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort participants by score descending
  const sorted = [...participants].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-[#0e1d3e] to-[#060c1d] border-2 border-amber-400/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 blur-3xl pointer-events-none rounded-full" />

        {/* Trophy icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/30 animate-pulse">
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-300 block mb-1">
          {gameTitle} Champion
        </span>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight drop-shadow-md">
          {winner ? winner.name : 'Game Complete!'}
        </h2>

        {winner && (
          <div className="my-3 font-mono font-black text-2xl sm:text-3xl text-amber-400">
            {winner.score} PTS
          </div>
        )}

        {/* Final Standings Table */}
        <div className="my-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-left">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Final Standings
          </h4>
          <div className="space-y-1.5">
            {sorted.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      index === 0
                        ? 'bg-amber-400 text-slate-950'
                        : index === 1
                        ? 'bg-slate-300 text-slate-950'
                        : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-100">{item.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            onClick={onPlayAgain}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          <button
            onClick={onReturnToHub}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Game Hub
          </button>
        </div>
      </div>
    </div>
  );
}
