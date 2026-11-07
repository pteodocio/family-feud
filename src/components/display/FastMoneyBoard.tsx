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
  const {
    player1,
    player2,
    targetScore,
    totalScore,
    won,
    setTitle,
    step = 'setup',
    currentQuestionIndex = 0,
    duplicateWarning,
    isCompleted,
  } = fastMoney;

  useEffect(() => {
    if (won) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, [won]);

  const isPlayer1Playing = step === 'player1_playing';
  const isPlayer2Playing = step === 'player2_playing';
  const isPlayer1Review = step === 'player1_review';
  const isRevealMode = step === 'reveal' || step === 'player2_review' || isCompleted;

  // Active question being asked during live stepper
  const activeQuestion = fastMoney.questions[currentQuestionIndex];

  return (
    <div className="w-full flex-1 flex flex-col justify-between py-2 px-3 sm:px-6 select-none max-w-6xl mx-auto">
      {/* HEADER: TITLE, SET INFO & TIMER */}
      <div className="flex items-center justify-between mb-2 border-b-2 border-feud-gold/40 pb-2.5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-feud-gold font-display font-extrabold text-[11px] sm:text-xs uppercase tracking-widest block">
              THE FINAL SHOWDOWN
            </span>
            {setTitle && (
              <span className="bg-blue-900/80 border border-blue-600/60 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {setTitle}
              </span>
            )}
          </div>
          <h1 className="text-white font-display font-black text-2xl sm:text-4xl md:text-5xl tracking-wide uppercase text-glow-gold">
            FAST MONEY
          </h1>
        </div>

        {/* TIMER & TARGET BOXES */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* TIMER DISPLAY */}
          <div
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl border-3 flex flex-col items-center transition-all ${
              timerRunning
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-[#061536] border-feud-gold/60'
            }`}
          >
            <span className="text-gray-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              TIMER
            </span>
            <span
              className={`led-score text-3xl sm:text-5xl leading-none ${
                timerRemaining <= 5 && timerRunning ? 'text-red-500 text-glow-red' : 'text-feud-gold text-glow-gold'
              }`}
            >
              {timerRemaining}
            </span>
          </div>

          {/* TARGET SCORE BOX */}
          <div className="bg-[#061536] border-2 border-feud-gold/60 rounded-2xl px-4 sm:px-5 py-1.5 sm:py-2 flex flex-col items-center">
            <span className="text-gray-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              TARGET
            </span>
            <span className="led-score text-2xl sm:text-4xl text-feud-goldLight leading-none">
              {targetScore}
            </span>
          </div>
        </div>
      </div>

      {/* LIVE GAMEPLAY STAGE BANNER */}
      {isPlayer1Playing && (
        <div className="bg-gradient-to-r from-blue-900/90 via-blue-800 to-blue-900/90 border-2 border-blue-400 rounded-xl px-4 py-2 mb-2 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-feud-gold text-[#071638] font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
              Player 1 Playing
            </span>
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              Question {currentQuestionIndex + 1} of 5: &ldquo;{activeQuestion?.prompt}&rdquo;
            </span>
          </div>
          <span className="text-blue-200 text-xs font-mono shrink-0 hidden sm:inline">
            20s Clock
          </span>
        </div>
      )}

      {isPlayer1Review && (
        <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 border-2 border-feud-gold rounded-xl px-4 py-2 mb-2 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-feud-gold text-[#071638] font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
              Player 1 Done
            </span>
            <span className="text-white text-xs sm:text-sm font-semibold">
              Bring in Player 2 from the isolation booth. Player 1 answers are now hidden!
            </span>
          </div>
        </div>
      )}

      {isPlayer2Playing && (
        <div className="bg-gradient-to-r from-indigo-950/90 via-indigo-900 to-indigo-950/90 border-2 border-indigo-400 rounded-xl px-4 py-2 mb-2 shadow-md flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-400 text-[#071638] font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
                Player 2 Playing
              </span>
              <span className="text-white text-xs sm:text-sm font-semibold truncate">
                Question {currentQuestionIndex + 1} of 5: &ldquo;{activeQuestion?.prompt}&rdquo;
              </span>
            </div>
            <span className="text-indigo-200 text-xs font-mono shrink-0 hidden sm:inline">
              25s Clock
            </span>
          </div>

          {duplicateWarning && (
            <div className="bg-red-600/90 border border-white text-white font-black text-xs sm:text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 animate-bounce">
              <span className="text-base">🚨</span>
              <span>{duplicateWarning}</span>
            </div>
          )}
        </div>
      )}

      {isRevealMode && !won && !isCompleted && (
        <div className="bg-[#0b1d42]/90 border border-feud-gold/50 rounded-xl px-4 py-1.5 mb-2 shadow flex items-center justify-between">
          <span className="text-feud-gold font-bold text-xs uppercase tracking-widest">
            THE DRAMATIC REVEAL
          </span>
          <span className="text-gray-300 text-xs">
            Watching the board unfold answer by answer!
          </span>
        </div>
      )}

      {/* 5-ROW FAST MONEY GRID */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 my-1 justify-center">
        {fastMoney.questions.map((q, idx) => {
          const p1Ans = player1.answers[idx];
          const p2Ans = player2.answers[idx];

          const isCurrentActive =
            (isPlayer1Playing || isPlayer2Playing) && currentQuestionIndex === idx;

          // Player 1 visibility rules:
          // In reveal mode: shows if revealed.
          // In Player 1 playing mode: shows as submitted or pass indicator.
          // In Player 2 playing / review mode: STRICTLY HIDDEN to match TV rules!
          const p1AnsRevealed = isRevealMode
            ? player1.revealedAnswerIndices.includes(idx)
            : isPlayer1Playing && !isPlayer2Playing && !isPlayer1Review
            ? Boolean(p1Ans?.submittedText)
            : false;

          const p1PtsRevealed = isRevealMode && player1.revealedPointsIndices.includes(idx);

          // Player 2 visibility rules:
          const p2AnsRevealed = isRevealMode
            ? player2.revealedAnswerIndices.includes(idx)
            : isPlayer2Playing
            ? Boolean(p2Ans?.submittedText && !p2Ans.isPassed)
            : false;

          const p2PtsRevealed = isRevealMode && player2.revealedPointsIndices.includes(idx);

          return (
            <div
              key={q.id}
              className={`grid grid-cols-12 gap-2 sm:gap-3 items-center rounded-xl p-2 sm:p-2.5 transition-all shadow-md ${
                isCurrentActive
                  ? 'bg-[#0e2760] border-2 border-feud-gold shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-[1.01]'
                  : 'bg-[#07173e]/95 border-2 border-blue-900'
              }`}
            >
              {/* Question prompt (Clear, legible, un-truncated) */}
              <div className="col-span-12 sm:col-span-4 text-white text-xs sm:text-sm font-bold border-b sm:border-b-0 sm:border-r border-blue-900/80 pb-1 sm:pb-0 sm:pr-2 leading-snug flex items-start gap-1.5">
                <span className={`font-extrabold shrink-0 ${isCurrentActive ? 'text-feud-gold' : 'text-blue-300'}`}>
                  {idx + 1}.
                </span>
                <span className="line-clamp-2">{q.prompt}</span>
              </div>

              {/* Player 1 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/60 rounded-lg px-2.5 sm:px-3 py-1.5 min-h-[42px] sm:min-h-[46px]">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-blue-300 hidden sm:inline">P1:</span>
                  <span className="text-white font-display font-extrabold uppercase text-xs sm:text-base md:text-lg tracking-wide truncate">
                    {p1AnsRevealed ? (
                      p1Ans?.submittedText || '—'
                    ) : isPlayer2Playing || isPlayer1Review ? (
                      <span className="text-blue-400/50 tracking-widest text-xs font-mono">LOCKED</span>
                    ) : (
                      '••••••••'
                    )}
                  </span>
                </div>
                <span className="bg-feud-gold text-[#071638] font-display font-black text-sm sm:text-lg px-2 sm:px-2.5 py-0.5 rounded ml-2 min-w-[34px] sm:min-w-[38px] text-center shrink-0">
                  {p1PtsRevealed ? p1Ans?.points ?? 0 : '—'}
                </span>
              </div>

              {/* Player 2 Slot */}
              <div className="col-span-6 sm:col-span-4 flex items-center justify-between bg-[#0b2256] border border-blue-500/60 rounded-lg px-2.5 sm:px-3 py-1.5 min-h-[42px] sm:min-h-[46px]">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-blue-300 hidden sm:inline">P2:</span>
                  <span className="text-white font-display font-extrabold uppercase text-xs sm:text-base md:text-lg tracking-wide truncate">
                    {p2AnsRevealed ? p2Ans?.submittedText || '—' : '••••••••'}
                  </span>
                </div>
                <span className="bg-feud-gold text-[#071638] font-display font-black text-sm sm:text-lg px-2 sm:px-2.5 py-0.5 rounded ml-2 min-w-[34px] sm:min-w-[38px] text-center shrink-0">
                  {p2PtsRevealed ? p2Ans?.points ?? 0 : '—'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TOTALS & DYNAMIC WIN/LOSS BANNER */}
      <div className="mt-2 bg-gradient-to-r from-[#0d2354] via-[#143d8a] to-[#0d2354] border-3 border-feud-gold rounded-2xl p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 shadow-gold-glow">
        <div className="flex gap-5 sm:gap-10">
          <div>
            <span className="text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
              PLAYER 1 TOTAL
            </span>
            <span className="led-score text-xl sm:text-3xl text-white">
              {player1.totalScore}
            </span>
          </div>
          <div>
            <span className="text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
              PLAYER 2 TOTAL
            </span>
            <span className="led-score text-xl sm:text-3xl text-white">
              {player2.totalScore}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-feud-goldLight text-[10px] sm:text-xs font-black uppercase tracking-widest block">
              COMBINED SCORE
            </span>
            <span
              className={`led-score text-3xl sm:text-5xl leading-none ${
                totalScore >= targetScore ? 'text-green-400 text-glow-gold' : 'text-feud-gold text-glow-gold'
              }`}
            >
              {totalScore}
            </span>
          </div>

          {won && (
            <div className="bg-green-500 border-2 border-white text-[#071638] px-4 py-1.5 sm:py-2 rounded-xl font-display font-black text-base sm:text-xl animate-bounce shadow-lg">
              FAST MONEY WINNER!
            </div>
          )}

          {isCompleted && won === false && (
            <div className="bg-red-600 border border-white text-white px-3 sm:px-4 py-1.5 rounded-xl font-display font-extrabold text-xs sm:text-sm shadow-md">
              SO CLOSE! BETTER LUCK NEXT TIME!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
