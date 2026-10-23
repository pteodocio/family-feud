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
    <div className="flip-card w-full h-[72px] sm:h-[84px] md:h-[96px] lg:h-[104px]">
      <motion.div
        className={`flip-card-inner ${isRevealed ? 'revealed' : ''}`}
        initial={false}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0.2, 0.2, 1] }}
      >
        {/* UNREVEALED FRONT FACE */}
        <div className="flip-card-front bg-gradient-to-b from-[#143d8a] via-[#0d2c6c] to-[#081a44] border-2 sm:border-3 border-[#2563eb] flex items-center justify-center shadow-lg rounded-xl overflow-hidden relative">
          {/* Subtle studio glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent)] pointer-events-none" />

          {/* Centered Number Badge */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#ffd15c] via-[#f5b000] to-[#b88200] border-2 border-white/80 shadow-md flex items-center justify-center">
            <span className="text-feud-dark font-display font-black text-2xl sm:text-3xl md:text-4xl leading-none">
              {index + 1}
            </span>
          </div>
        </div>

        {/* REVEALED BACK FACE */}
        <div className="flip-card-back bg-gradient-to-r from-[#0d2a6a] via-[#12388c] to-[#0b235b] border-2 sm:border-3 border-[#f5b000] shadow-gold-glow flex items-center justify-between px-3 sm:px-6 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_100%)] pointer-events-none" />

          {/* Answer Text */}
          <div className="flex-1 min-w-0 pr-3 sm:pr-4">
            <span className="text-white font-display uppercase tracking-wide font-black text-lg sm:text-2xl md:text-3xl lg:text-4xl truncate block drop-shadow-md">
              {answer?.text || ''}
            </span>
          </div>

          {/* Point Value Badge */}
          <div className="bg-gradient-to-b from-[#ffd15c] to-[#f5b000] text-feud-dark border-2 border-white/60 min-w-[50px] sm:min-w-[64px] md:min-w-[76px] h-10 sm:h-12 md:h-14 rounded-lg flex items-center justify-center px-2 shadow-inner">
            <span className="font-display font-black text-xl sm:text-2xl md:text-3xl leading-none">
              {answer?.points ?? 0}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
