import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { FastMoneyState } from '../../types/game';

interface FastMoneyBoardProps {
  fastMoney: FastMoneyState;
  timerRemaining: number;
  timerRunning: boolean;
}

export function FastMoneyBoard({
  fastMoney,
  timerRemaining,
  timerRunning,
}: FastMoneyBoardProps) {
  const { player1, player2, targetScore, totalScore, won } = fastMoney;

  useEffect(() => {
    if (won) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [won]);

  return (
    <div className="w-full flex-1 flex flex-col justify-between py-2 px-3 sm:px-6 select-none max-w-6xl mx-auto">
      {/* HEADER: TITLE & TIMER */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-feud-gold/40 pb-3">
        <div>
          <span className="text-feud-gold font-display font-extrabold text-xs uppercase tracking-widest block mb-0.5">
            THE FINAL SHOWDOWN
          </span>
          <h1 className="text-white font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-glow-gold">
            FAST MONEY
          </h1>
        </div>

        {/* TIMER & TARGET BOXES */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* TIMER DISPLAY */}
          <div
            className={`px-5 py-1.5 sm:py-2 rounded-2xl border-3 flex flex-col items-center transition-all ${
              timerRunning
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-[#061536] border-feud-gold/60'
            }`}
          >
            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">
              TIMER
            </span>
            <span
              className={`led-score text-4xl sm:text-5xl leading-none ${
                timerRemaining <= 5 && timerRunning ? 'text-red-500 text-glow-red' : 'text-feud-gold text-glow-gold'
              }`}
            >
              {timerRemaining}
            </span>
          </div>

          {/* TARGET SCORE BOX */}
          <div className="bg-[#061536] border-2 border-feud-gold/60 rounded-2xl px-5 py-1.5 sm:py-2 flex flex-col items-center">
            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">
              TARGET
            </span>
            <span className="led-score text-3xl sm:text-4xl text-feud-goldLight leading-none">
              {targetScore}
            </span>
          </div>
        </div>
      </div>

      {/* 5-ROW FAST MONEY GRID */}
      <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 my-2 justify-center">
        {fastMoney.questions.map((q, idx) => {
          const p1Ans = player1.answers[idx];
          const p2Ans = player2.answers[idx];

          const p1Revealed = player1.revealedAnswerIndices.includes(idx);
          const p1PtsRevealed = player1.revealedPointsIndices.includes(idx);

          const p2Revealed = player2.revealedAnswerIndices.includes(idx);
          const p2PtsRevealed = player2.revealedPointsIndices.includes(idx);

          return (
            <div
              key={q.id}
              className="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-[#07173e]/95 border-2 border-blue-900 rounded-xl p-2.5 sm:p-3 shadow-md"
            >
              {/* Question prompt (Clear, legible, un-truncated) */}
              <div className="col-span-12 sm:col-span-4 text-white text-xs sm:text-sm font-bold border-b sm:border-b-0 sm:border-r border-blue-900/80 pb-1.5 sm:pb-0 sm:pr-2 leading-snug">
                <span className="text-feud-gold font-extrabold mr-1.5">{idx + 1}.</span>
                {q.prompt}
              </div>

              {/* Player 1 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/60 rounded-lg px-3 py-1.5 min-h-[44px] sm:min-h-[48px]">
                <span className="text-white font-display font-extrabold uppercase text-sm sm:text-base md:text-lg tracking-wide truncate">
                  {p1Revealed ? p1Ans?.submittedText || '—' : '••••••••'}
                </span>
                <span className="bg-feud-gold text-[#071638] font-display font-black text-base sm:text-xl px-2.5 py-0.5 rounded ml-2 min-w-[38px] text-center shrink-0">
                  {p1PtsRevealed ? p1Ans?.points ?? 0 : '—'}
                </span>
              </div>

              {/* Player 2 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/60 rounded-lg px-3 py-1.5 min-h-[44px] sm:min-h-[48px]">
                <span className="text-white font-display font-extrabold uppercase text-sm sm:text-base md:text-lg tracking-wide truncate">
                  {p2Revealed ? p2Ans?.submittedText || '—' : '••••••••'}
                </span>
                <span className="bg-feud-gold text-[#071638] font-display font-black text-base sm:text-xl px-2.5 py-0.5 rounded ml-2 min-w-[38px] text-center shrink-0">
                  {p2PtsRevealed ? p2Ans?.points ?? 0 : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TOTALS */}
      <div className="mt-2 bg-gradient-to-r from-[#0d2354] via-[#143d8a] to-[#0d2354] border-3 border-feud-gold rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-gold-glow">
        <div className="flex gap-6 sm:gap-12">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block">
              PLAYER 1 TOTAL
            </span>
            <span className="led-score text-2xl sm:text-3xl text-white">
              {player1.totalScore}
            </span>
          </div>
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block">
              PLAYER 2 TOTAL
            </span>
            <span className="led-score text-2xl sm:text-3xl text-white">
              {player2.totalScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-feud-goldLight text-xs font-black uppercase tracking-widest block">
              COMBINED SCORE
            </span>
            <span
              className={`led-score text-4xl sm:text-6xl leading-none ${
                totalScore >= targetScore ? 'text-green-400 text-glow-gold' : 'text-feud-gold text-glow-gold'
              }`}
            >
              {totalScore}
            </span>
          </div>

          {won && (
            <div className="bg-green-500 text-[#071638] px-4 py-2 rounded-xl font-display font-black text-lg sm:text-xl animate-bounce shadow-lg">
              WINNER!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
