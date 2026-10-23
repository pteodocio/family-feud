import { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { GamePhase } from '../types/game';
import type { GameSession } from '../types/game';
import { loadGameSession } from '../db/database';
import { syncBus } from '../sync/broadcast';
import { soundManager } from '../audio/soundManager';
import { ScoreHeader } from '../components/display/ScoreHeader';
import { AnswerSlotTile } from '../components/display/AnswerSlotTile';
import { StrikeGraphic } from '../components/display/StrikeGraphic';
import { FastMoneyBoard } from '../components/display/FastMoneyBoard';
import confetti from 'canvas-confetti';

interface DisplayPageProps {
  gameId: string;
}

export function DisplayPage({ gameId }: DisplayPageProps) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [strikeGraphic, setStrikeGraphic] = useState<{ show: boolean; count: number }>({
    show: false,
    count: 0,
  });

  // Load session & set up Broadcast sync
  useEffect(() => {
    let isMounted = true;

    // Load from DB first
    loadGameSession(gameId).then((loaded) => {
      if (isMounted && loaded) {
        setSession(loaded);
      }
    });

    // Request active state from host window
    syncBus.requestSync();

    // Listen for live updates
    const unsubState = syncBus.subscribeState((updated) => {
      if (updated.id === gameId) {
        setSession((prev) => {
          // If strikes increased, trigger graphic on display
          if (prev) {
            const prevStrikes = prev.rounds[prev.currentRoundIndex]?.strikes ?? 0;
            const newStrikes = updated.rounds[updated.currentRoundIndex]?.strikes ?? 0;
            if (newStrikes > prevStrikes && updated.phase !== GamePhase.ROUND_SUMMARY) {
              setStrikeGraphic({ show: true, count: newStrikes });
              setTimeout(() => setStrikeGraphic({ show: false, count: 0 }), 1400);
            }
          }
          return updated;
        });
      }
    });

    const unsubSound = syncBus.subscribeSound((sound) => {
      soundManager.play(sound);
    });

    return () => {
      isMounted = false;
      unsubState();
      unsubSound();
    };
  }, [gameId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Fire confetti if final results or round summary with big score
  useEffect(() => {
    if (session?.phase === GamePhase.FINAL_RESULTS) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 },
      });
    }
  }, [session?.phase]);

  if (!session) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-feud-dark text-white p-8 stage-background">
        <div className="w-16 h-16 border-4 border-feud-gold border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-display font-bold text-feud-gold">
          Connecting to Game Show Board...
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Waiting for host broadcast or session ID: {gameId}
        </p>
      </div>
    );
  }

  const currentRound = session.rounds[session.currentRoundIndex];
  const totalAnswers = currentRound?.question.answers.length ?? 0;
  const leftColCount = Math.ceil(totalAnswers / 2);

  return (
    <div className="w-screen h-screen overflow-hidden bg-feud-dark text-white stage-background flex flex-col justify-between p-2 sm:p-4 select-none relative">
      {/* FULLSCREEN CONTROLLER PILL */}
      <div className="absolute top-2 right-2 z-40 opacity-20 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/60 text-feud-gold hover:text-white border border-feud-gold/40 shadow-md"
          title="Toggle Fullscreen (F11)"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      </div>

      {/* GIANT STRIKE GRAPHIC OVERLAY */}
      <StrikeGraphic show={strikeGraphic.show} count={strikeGraphic.count} />

      {/* TOP SCOREBOARD HEADER (Always visible in regular and faceoff rounds) */}
      {session.phase !== GamePhase.FAST_MONEY && session.phase !== GamePhase.FINAL_RESULTS && currentRound && (
        <ScoreHeader
          team1={session.team1}
          team2={session.team2}
          currentRound={currentRound}
          activeTeamId={currentRound.activeTeamId}
          phase={session.phase}
        />
      )}

      {/* MAIN STAGE CONTENT AREA */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-2 sm:px-6">
        {/* PHASE 1: FACE-OFF SCREEN */}
        {session.phase === GamePhase.FACEOFF && currentRound && (
          <div className="w-full flex flex-col items-center justify-center py-4 text-center">
            <div className="bg-gradient-to-r from-transparent via-feud-blue to-transparent py-2 px-12 mb-4">
              <span className="font-display font-black text-feud-gold text-2xl sm:text-4xl tracking-widest uppercase text-glow-gold animate-pulse">
                FACE-OFF ROUND
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white max-w-5xl leading-tight drop-shadow-lg mb-8">
              "{currentRound.question.prompt}"
            </h1>

            <div className="flex gap-8 items-center justify-center">
              <div className="bg-blue-900/40 border-2 border-blue-500 rounded-2xl px-8 py-4 shadow-blue-glow">
                <span className="text-blue-300 font-bold block text-sm uppercase">CONTESTANT 1</span>
                <span className="font-display font-black text-2xl sm:text-3xl text-white">{session.team1.name}</span>
              </div>
              <span className="font-display font-black text-4xl text-feud-gold">VS</span>
              <div className="bg-red-900/40 border-2 border-red-500 rounded-2xl px-8 py-4 shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                <span className="text-red-300 font-bold block text-sm uppercase">CONTESTANT 2</span>
                <span className="font-display font-black text-2xl sm:text-3xl text-white">{session.team2.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2: REGULAR PLAY OR STEAL BOARD */}
        {(session.phase === GamePhase.REGULAR || session.phase === GamePhase.STEAL) && currentRound && (
          <div className="w-full flex flex-col items-center justify-center">
            {/* STEAL ALERT BANNER */}
            {session.phase === GamePhase.STEAL && (
              <div className="w-full max-w-4xl bg-gradient-to-r from-red-950 via-red-600 to-red-950 border-3 border-white rounded-2xl py-2 px-6 mb-3 text-center shadow-red-strike animate-pulse">
                <span className="font-display font-black text-white text-2xl sm:text-4xl tracking-widest uppercase drop-shadow-md">
                  ★ STEAL OPPORTUNITY: {currentRound.stealTeamId === session.team1.id ? session.team1.name : session.team2.name} CAN STEAL! ★
                </span>
              </div>
            )}

            {/* QUESTION DISPLAY */}
            <div className="w-full max-w-5xl text-center mb-3 sm:mb-5">
              <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-white leading-tight drop-shadow-md">
                "{currentRound.question.prompt}"
              </h1>
            </div>

            {/* THE GAME SHOW 8-SLOT BOARD */}
            <div className="w-full max-w-5xl bg-[#071638] game-board-frame p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Left Column */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                {currentRound.question.answers.slice(0, leftColCount).map((ans, idx) => (
                  <AnswerSlotTile
                    key={ans.id}
                    index={idx}
                    answer={ans}
                    isRevealed={currentRound.revealedAnswerIds.includes(ans.id)}
                    totalSlots={totalAnswers}
                  />
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-2.5 sm:gap-3.5">
                {currentRound.question.answers.slice(leftColCount).map((ans, idx) => {
                  const actualIdx = leftColCount + idx;
                  return (
                    <AnswerSlotTile
                      key={ans.id}
                      index={actualIdx}
                      answer={ans}
                      isRevealed={currentRound.revealedAnswerIds.includes(ans.id)}
                      totalSlots={totalAnswers}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: ROUND SUMMARY SCREEN */}
        {session.phase === GamePhase.ROUND_SUMMARY && currentRound && (
          <div className="w-full max-w-4xl bg-[#071638] game-board-frame p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-stage animate-fadeIn">
            <span className="text-feud-gold font-bold text-sm tracking-widest uppercase mb-1">
              ROUND {currentRound.roundIndex + 1} COMPLETE
            </span>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-4 text-glow-gold">
              {currentRound.awardedToTeamId === session.team1.id
                ? session.team1.name
                : session.team2.name}{' '}
              WINS THE ROUND!
            </h1>

            <div className="bg-feud-dark/90 border-2 border-feud-gold rounded-2xl p-6 my-4 min-w-[280px]">
              <span className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-1">
                AWARDED POINTS
              </span>
              <span className="font-display font-black text-5xl sm:text-7xl text-feud-gold text-glow-gold leading-none">
                +{currentRound.awardedPoints}
              </span>
              <span className="text-gray-400 text-xs block mt-2">
                ({currentRound.roundBank} bank × {currentRound.multiplier}x multiplier)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-lg mt-4 border-t border-blue-900/80 pt-6">
              <div className="text-center">
                <span className="text-blue-300 text-sm font-bold block">{session.team1.name}</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-white">{session.team1.score}</span>
              </div>
              <div className="text-center">
                <span className="text-red-300 text-sm font-bold block">{session.team2.name}</span>
                <span className="font-display font-black text-3xl sm:text-4xl text-white">{session.team2.score}</span>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: FAST MONEY SCREEN */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoney && (
          <FastMoneyBoard
            fastMoney={session.fastMoney}
            timerRemaining={session.fastMoney.player1.timerRemaining}
            timerRunning={session.fastMoney.player1.timerRunning}
          />
        )}

        {/* PHASE 5: FINAL RESULTS SCREEN */}
        {session.phase === GamePhase.FINAL_RESULTS && (
          <div className="w-full max-w-4xl bg-[#071638] game-board-frame p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-stage">
            <span className="text-feud-gold font-bold text-sm sm:text-base tracking-widest uppercase mb-2">
              GAME OVER · FINAL RESULTS
            </span>

            <h1 className="font-display font-black text-5xl sm:text-7xl text-white mb-6 text-glow-gold">
              🏆 {session.team1.score >= session.team2.score ? session.team1.name : session.team2.name} IS THE CHAMPION!
            </h1>

            <div className="grid grid-cols-2 gap-8 w-full max-w-xl bg-feud-dark/80 border-2 border-feud-gold/60 rounded-3xl p-6 sm:p-8 my-4">
              <div className="border-r border-blue-900/80 pr-4">
                <span className="text-blue-400 text-sm font-bold uppercase tracking-wider block">TEAM 1</span>
                <span className="text-white font-display font-black text-2xl sm:text-3xl truncate block mb-2">{session.team1.name}</span>
                <span className="font-display font-black text-5xl sm:text-6xl text-blue-400 leading-none">{session.team1.score}</span>
              </div>
              <div className="pl-4">
                <span className="text-red-400 text-sm font-bold uppercase tracking-wider block">TEAM 2</span>
                <span className="text-white font-display font-black text-2xl sm:text-3xl truncate block mb-2">{session.team2.name}</span>
                <span className="font-display font-black text-5xl sm:text-6xl text-red-400 leading-none">{session.team2.score}</span>
              </div>
            </div>

            {session.fastMoney && (
              <p className="text-feud-gold font-semibold text-lg sm:text-xl mt-4">
                Fast Money Total Score: {session.fastMoney.totalScore} / {session.fastMoney.targetScore}{' '}
                {session.fastMoney.won ? '(Target Achieved!)' : '(Target Missed)'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER */}
      <div className="w-full flex items-center justify-between text-gray-500 text-xs px-4 py-1">
        <span>Family Feud Live Experience</span>
        <span>Display Mode (16:9 Optimized)</span>
      </div>
    </div>
  );
}
