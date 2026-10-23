import { motion, AnimatePresence } from 'motion/react';

interface StrikeGraphicProps {
  show: boolean;
  count: number; // 1, 2, 3
}

export function StrikeGraphic({ show, count }: StrikeGraphicProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="strike-overlay"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 sm:gap-8 md:gap-12 animate-shake">
            {Array.from({ length: Math.min(3, Math.max(1, count)) }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  damping: 12,
                  stiffness: 250,
                  delay: idx * 0.1,
                }}
                className="w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-2xl bg-gradient-to-b from-[#ef4444] to-[#b91c1c] border-4 sm:border-8 border-white shadow-red-strike flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent)]" />
                <span className="font-display font-black text-white text-6xl sm:text-8xl md:text-9xl leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] select-none">
                  X
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
