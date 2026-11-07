import { useEffect, useState } from 'react';
import { Maximize, Minimize, AlertTriangle } from 'lucide-react';
import { GamePhase } from '../types/game';
import type { GameSession } from '../types/game';
import { loadGameSession, loadSettings } from '../db/database';
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
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>({
    remaining: 20,
    running: false,
  });
  const [strikeGraphic, setStrikeGraphic] = useState<{ show: boolean; count: number }>({
    show: false,
    count: 0,
  });

  // Load session & set up Broadcast sync & Heartbeat
  useEffect(() => {
    let isMounted = true;
    let audioDest: string = 'auto';

    // Unlock Web Audio context on user interaction (resolves browser autoplay policy)
    const unlockAudio = () => {
      soundManager.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    loadSettings().then((s) => {
      if (!isMounted || !s) return;
      audioDest = s.audioDestination || 'auto';
      soundManager.setMasterVolume(s.masterVolume);
      soundManager.setEffectsVolume(s.effectsVolume);
      soundManager.setBgmVolume(s.bgmVolume);
      soundManager.setEffectsEnabled(s.effectsEnabled ?? true);
      soundManager.setBgmEnabled(s.bgmEnabled ?? true);
      soundManager.setMuted(!s.soundEnabled);
    });

    loadGameSession(gameId).then((loaded) => {
      if (isMounted && loaded) {
        setSession(loaded);
      }
    });

    // Request initial state and announce presence to host
    syncBus.requestSync();
    syncBus.sendPong();

    const unsubState = syncBus.subscribeState((updated) => {
      if (updated.id === gameId) {
        setSession((prev) => {
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
      if (audioDest === 'host_only') return;
      soundManager.play(sound);
    });

    const unsubBgm = syncBus.subscribeBgm(({ track, action }) => {
      if (audioDest === 'host_only') return;
      if (action === 'play') {
        soundManager.playBgm(track);
      } else {
        soundManager.stopBgm();
      }
    });

    const unsubPing = syncBus.subscribePing((timestamp) => {
      syncBus.sendPong(timestamp);
    });

    const unsubFullscreen = syncBus.subscribeRequestFullscreen(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    const unsubClose = syncBus.subscribeCloseDisplay(() => {
      try {
        window.close();
      } catch (err) {
        console.warn('Cannot close window programmatically:', err);
      }
    });

    const unsubTimer = syncBus.subscribeTimer((timer) => {
      setTimerState(timer);
    });

    return () => {
      isMounted = false;
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      soundManager.stopBgm(0.1);
      unsubState();
      unsubSound();
      unsubBgm();
      unsubPing();
      unsubFullscreen();
      unsubClose();
      unsubTimer();
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
          Connecting to TV Game Board...
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Waiting for host broadcast · Session: {gameId}
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

      {/* GIANT RED X STRIKE GRAPHIC OVERLAY */}
      <StrikeGraphic show={strikeGraphic.show} count={strikeGraphic.count} />

      {/* TOP SCOREBOARD (Always visible during main game) */}
      {session.phase !== GamePhase.FAST_MONEY && session.phase !== GamePhase.FINAL_RESULTS && currentRound && (
        <ScoreHeader
          team1={session.team1}
          team2={session.team2}
          currentRound={currentRound}
          activeTeamId={currentRound.activeTeamId}
          phase={session.phase}
        />
      )}

      {/* MAIN GAME SHOW BOARD AREA */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-2 sm:px-4 my-auto">
        {/* BROADCAST QUESTION BANNER (Clean, ultra-readable, crystal-clear typography) */}
        {session.phase !== GamePhase.FAST_MONEY && session.phase !== GamePhase.FINAL_RESULTS && currentRound && (
          <div className="w-full max-w-5xl mb-3 sm:mb-4">
            {/* Phase Context Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-gradient-to-r from-blue-950 via-[#0e2c6d] to-blue-950 border-t border-x border-feud-gold/60 rounded-t-xl text-center">
              <span className="text-feud-goldLight text-xs sm:text-sm font-display font-extrabold tracking-widest uppercase flex-1 text-center">
                {session.phase === GamePhase.FACEOFF
                  ? '★ FACE-OFF ROUND · CONTESTANTS BUZZ IN ★'
                  : session.phase === GamePhase.STEAL
                  ? `⚡ STEAL OPPORTUNITY: ${
                      currentRound.stealTeamId === session.team1.id ? session.team1.name : session.team2.name
                    } CAN STEAL! ⚡`
                  : `SURVEY QUESTION · ROUND ${currentRound.roundIndex + 1}`}
              </span>
              {timerState.running && (
                <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500 rounded-lg px-2.5 py-0.5 animate-pulse shrink-0">
                  <span className="text-[10px] uppercase font-bold text-red-200">TIME:</span>
                  <span className="font-mono font-black text-sm text-red-400">{timerState.remaining}s</span>
                </div>
              )}
            </div>

            {/* The Question Text Box */}
            <div className="bg-gradient-to-b from-[#091e4e] via-[#051438] to-[#020b22] border-2 border-feud-gold rounded-b-xl p-3 sm:p-4 shadow-stage text-center">
              <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-normal leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
                "{currentRound.question.prompt}"
              </h1>
            </div>
          </div>
        )}

        {/* THE ICONIC FAMILY FEUD 8-SLOT BOARD (Visible during Face-Off, Regular Play, and Steal!) */}
        {(session.phase === GamePhase.FACEOFF ||
          session.phase === GamePhase.REGULAR ||
          session.phase === GamePhase.STEAL) &&
          currentRound && (
            <div className="w-full max-w-5xl feud-board-outer">
              <div className="feud-board-inner p-3 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Left Column of Answers */}
                <div className="flex flex-col gap-2.5 sm:gap-3">
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

                {/* Right Column of Answers */}
                <div className="flex flex-col gap-2.5 sm:gap-3">
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

        {/* ROUND SUMMARY SCREEN */}
        {session.phase === GamePhase.ROUND_SUMMARY && currentRound && (
          <div className="w-full max-w-4xl feud-board-outer animate-fadeIn">
            <div className="feud-board-inner p-6 sm:p-10 flex flex-col items-center justify-center text-center">
              <span className="text-feud-gold font-display font-extrabold text-sm sm:text-base tracking-widest uppercase mb-2">
                ROUND {currentRound.roundIndex + 1} RESOLUTION
              </span>

              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white mb-4 text-glow-gold tracking-wide">
                {currentRound.awardedToTeamId === session.team1.id
                  ? session.team1.name
                  : session.team2.name}{' '}
                WINS THE ROUND!
              </h1>

              <div className="bg-[#03091a] border-2 border-feud-gold rounded-2xl p-6 my-4 min-w-[280px] shadow-gold-glow">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-wider block mb-1">
                  AWARDED POINTS
                </span>
                <span className="led-score text-5xl sm:text-7xl text-feud-gold text-glow-gold leading-none">
                  +{currentRound.awardedPoints}
                </span>
                <span className="text-gray-400 text-xs block mt-2 font-medium">
                  ({currentRound.roundBank} Bank × {currentRound.multiplier}x Multiplier)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full max-w-lg mt-4 border-t border-blue-900/80 pt-6">
                <div className="text-center">
                  <span className="text-blue-300 text-sm font-bold block">{session.team1.name}</span>
                  <span className="led-score text-3xl sm:text-4xl text-white">{session.team1.score}</span>
                </div>
                <div className="text-center">
                  <span className="text-red-300 text-sm font-bold block">{session.team2.name}</span>
                  <span className="led-score text-3xl sm:text-4xl text-white">{session.team2.score}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAST MONEY SCREEN */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoney && !session.fastMoneyError && (
          <FastMoneyBoard
            fastMoney={session.fastMoney}
            timerRemaining={timerState.remaining}
            timerRunning={timerState.running}
          />
        )}

        {/* FAST MONEY ERROR */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoneyError && (
          <div className="w-full max-w-2xl feud-board-outer shadow-stage my-8">
            <div className="feud-board-inner p-8 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
              <h2 className="text-2xl font-black font-display text-white uppercase tracking-wider mb-2">
                Fast Money Unavailable
              </h2>
              <p className="text-red-300 font-medium text-sm max-w-md">
                {session.fastMoneyError}
              </p>
            </div>
          </div>
        )}

        {/* FINAL RESULTS SCREEN */}
        {session.phase === GamePhase.FINAL_RESULTS && (
          <div className="w-full max-w-4xl feud-board-outer shadow-stage">
            <div className="feud-board-inner p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <span className="text-feud-gold font-display font-extrabold text-sm sm:text-base tracking-widest uppercase mb-2">
                GRAND VICTORY · FINAL RESULTS
              </span>

              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white mb-6 text-glow-gold tracking-wide">
                🏆 {session.team1.score >= session.team2.score ? session.team1.name : session.team2.name} IS THE CHAMPION!
              </h1>

              <div className="grid grid-cols-2 gap-8 w-full max-w-xl bg-black/60 border-2 border-feud-gold/70 rounded-3xl p-6 sm:p-8 my-4">
                <div className="border-r border-blue-900/80 pr-4">
                  <span className="text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider block">TEAM 1</span>
                  <span className="text-white font-display font-extrabold text-xl sm:text-2xl truncate block mb-2">{session.team1.name}</span>
                  <span className="led-score text-5xl sm:text-6xl text-blue-400 leading-none">{session.team1.score}</span>
                </div>
                <div className="pl-4">
                  <span className="text-red-400 text-xs sm:text-sm font-bold uppercase tracking-wider block">TEAM 2</span>
                  <span className="text-white font-display font-extrabold text-xl sm:text-2xl truncate block mb-2">{session.team2.name}</span>
                  <span className="led-score text-5xl sm:text-6xl text-red-400 leading-none">{session.team2.score}</span>
                </div>
              </div>

              {session.fastMoney && (
                <p className="text-feud-gold font-display font-bold text-lg sm:text-xl mt-4">
                  Fast Money Total Score: {session.fastMoney.totalScore} / {session.fastMoney.targetScore}{' '}
                  {session.fastMoney.won ? '(Target Achieved!)' : '(Target Missed)'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER */}
      <div className="w-full flex items-center justify-between text-gray-400 text-[11px] px-4 py-1">
        <span>Family Feud Live Show</span>
        <span>Television Studio Board</span>
      </div>
    </div>
  );
}
