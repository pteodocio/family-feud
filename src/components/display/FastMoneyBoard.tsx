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
    <div className="w-full flex-1 flex flex-col justify-between py-2 px-4 sm:px-8 select-none max-w-7xl mx-auto">
      {/* HEADER: TITLE & TIMER */}
      <div className="flex items-center justify-between mb-3 border-b-2 border-feud-gold/40 pb-3">
        <div>
          <span className="text-feud-gold font-bold text-xs uppercase tracking-widest block">
            THE FINAL ROUND
          </span>
          <h1 className="text-white font-display font-black text-3xl sm:text-5xl tracking-tight text-glow-gold">
            FAST MONEY
          </h1>
        </div>

        {/* TIMER DISPLAY */}
        <div className="flex items-center gap-4">
          <div
            className={`px-6 py-2 rounded-2xl border-3 flex flex-col items-center transition-all ${
              timerRunning
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-feud-board border-feud-gold/60'
            }`}
          >
            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">
              TIME REMAINING
            </span>
            <span
              className={`font-display font-black text-4xl sm:text-5xl leading-none ${
                timerRemaining <= 5 && timerRunning ? 'text-red-500' : 'text-feud-gold'
              }`}
            >
              {timerRemaining}
            </span>
          </div>

          {/* TARGET SCORE BOX */}
          <div className="bg-feud-board border-2 border-feud-gold/60 rounded-2xl px-5 py-2 flex flex-col items-center">
            <span className="text-gray-300 text-[10px] font-bold uppercase tracking-wider">
              TARGET
            </span>
            <span className="font-display font-black text-3xl sm:text-4xl text-feud-goldLight leading-none">
              {targetScore}
            </span>
          </div>
        </div>
      </div>

      {/* 5-ROW FAST MONEY GRID */}
      <div className="flex-1 flex flex-col gap-2.5 sm:gap-3.5 my-2 justify-center">
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
              className="grid grid-cols-12 gap-2 sm:gap-4 items-center bg-[#07173e]/90 border-2 border-blue-900/80 rounded-xl p-2 sm:p-3 shadow-md"
            >
              {/* Question prompt (compact) */}
              <div className="col-span-12 sm:col-span-4 text-gray-300 text-xs sm:text-sm font-semibold truncate border-b sm:border-b-0 sm:border-r border-blue-900/60 pb-1 sm:pb-0 sm:pr-2">
                <span className="text-feud-gold font-bold mr-1.5">{idx + 1}.</span>
                {q.prompt}
              </div>

              {/* Player 1 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/50 rounded-lg px-3 py-1.5 min-h-[42px] sm:min-h-[48px]">
                <span className="text-white font-display font-black uppercase text-base sm:text-xl truncate">
                  {p1Revealed ? p1Ans?.submittedText || '—' : '••••••••'}
                </span>
                <span className="bg-feud-gold text-feud-dark font-display font-black text-base sm:text-xl px-2.5 py-0.5 rounded ml-2 min-w-[36px] text-center">
                  {p1PtsRevealed ? p1Ans?.points ?? 0 : '—'}
                </span>
              </div>

              {/* Player 2 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/50 rounded-lg px-3 py-1.5 min-h-[42px] sm:min-h-[48px]">
                <span className="text-white font-display font-black uppercase text-base sm:text-xl truncate">
                  {p2Revealed ? p2Ans?.submittedText || '—' : '••••••••'}
                </span>
                <span className="bg-feud-gold text-feud-dark font-display font-black text-base sm:text-xl px-2.5 py-0.5 rounded ml-2 min-w-[36px] text-center">
                  {p2PtsRevealed ? p2Ans?.points ?? 0 : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TOTALS */}
      <div className="mt-3 bg-gradient-to-r from-[#0d2354] via-[#143d8a] to-[#0d2354] border-3 border-feud-gold rounded-2xl p-4 flex items-center justify-between shadow-gold-glow">
        <div className="flex gap-6 sm:gap-12">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block">
              PLAYER 1 TOTAL
            </span>
            <span className="text-white font-display font-black text-2xl sm:text-3xl">
              {player1.totalScore}
            </span>
          </div>
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider block">
              PLAYER 2 TOTAL
            </span>
            <span className="text-white font-display font-black text-2xl sm:text-3xl">
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
              className={`font-display font-black text-4xl sm:text-6xl leading-none ${
                totalScore >= targetScore ? 'text-green-400 text-glow-gold' : 'text-feud-gold text-glow-gold'
              }`}
            >
              {totalScore}
            </span>
          </div>

          {won && (
            <div className="bg-green-500 text-feud-dark px-4 py-2 rounded-xl font-display font-black text-xl sm:text-2xl animate-bounce shadow-lg">
              WINNER!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
