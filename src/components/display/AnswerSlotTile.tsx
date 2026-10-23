import { motion } from 'motion/react';
import type { Answer } from '../../types/game';

interface AnswerSlotTileProps {
  index: number;
  answer?: Answer;
  isRevealed: boolean;
  totalSlots: number;
}

export function AnswerSlotTile({
  index,
  answer,
  isRevealed,
}: AnswerSlotTileProps) {
  return (
    <div className="flip-card w-full h-[68px] sm:h-[78px] md:h-[88px] lg:h-[94px]">
      <motion.div
        className={`flip-card-inner ${isRevealed ? 'revealed' : ''}`}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0.2, 0.2, 1] }}
      >
        {/* UNREVEALED FRONT FACE */}
        <div className="flip-card-front bg-gradient-to-b from-[#163f91] via-[#0d2b6b] to-[#071842] border-2 sm:border-3 border-[#2563eb] flex items-center justify-center shadow-lg rounded-xl overflow-hidden relative">
          {/* Subtle glossy top highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* Centered Number Oval Badge */}
          <div className="w-16 h-11 sm:w-20 sm:h-13 md:w-24 md:h-15 rounded-full bg-gradient-to-b from-[#ffd700] via-[#f5b000] to-[#b88200] border-2 border-white shadow-md flex items-center justify-center">
            <span className="text-[#071638] font-display font-black text-2xl sm:text-3xl md:text-4xl leading-none drop-shadow-sm">
              {index + 1}
            </span>
          </div>
        </div>

        {/* REVEALED BACK FACE */}
        <div className="flip-card-back bg-gradient-to-r from-[#0d2c70] via-[#133b91] to-[#0b2561] border-2 sm:border-3 border-[#f5b000] shadow-gold-glow flex items-center justify-between px-3 sm:px-5 rounded-xl overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Answer Text - Highly Readable Sans-Serif Typography */}
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <span className="text-white font-display uppercase tracking-wide font-extrabold text-base sm:text-xl md:text-2xl lg:text-3xl line-clamp-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {answer?.text || ''}
            </span>
          </div>

          {/* Point Value Badge (Classic Yellow/Gold Eggshell Box) */}
          <div className="bg-gradient-to-b from-[#ffe07a] via-[#f5b000] to-[#d49200] text-[#071638] border-2 border-white min-w-[52px] sm:min-w-[66px] md:min-w-[76px] h-10 sm:h-12 md:h-14 rounded-lg flex items-center justify-center px-2 shadow-inner shrink-0">
            <span className="font-display font-black text-xl sm:text-2xl md:text-3xl leading-none">
              {answer?.points ?? 0}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
