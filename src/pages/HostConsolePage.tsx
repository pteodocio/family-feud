import { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Tv,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Play,
  Pause,
  Maximize,
  X,
  Radio,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Shuffle,
  Sparkles,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useRouter } from '../router/Router';
import { syncBus } from '../sync/broadcast';
import { GamePhase } from '../types/game';
import type { FastMoneyStep } from '../types/game';
import { matchAnswer } from '../engine/answerMatcher';
import { ScoreAdjustModal } from '../components/host/ScoreAdjustModal';
import { FAST_MONEY_SETS, getRandomFastMoneySet } from '../data/fastMoney';

interface HostConsolePageProps {
  gameId: string;
}

export function HostConsolePage({ gameId }: HostConsolePageProps) {
  const {
    session,
    loadSession,
    undoStack,
    settings,
    updateSettings,
    revealAnswer,
    hideAnswer,
    revealAllRemainingAnswers,
    recordStrike,
    clearStrike,
    resolveFaceOff,
    resolveSteal,
    awardRoundBank,
    advanceRound,
    navigateToRound,
    previousRound,
    restartRound,
    endGame,
    adjustScore,
    undo,
    submitFastMoneyAnswer,
    revealFastMoneyAnswer,
    revealFastMoneyPoints,
    resolveFastMoney,
    initFastMoneyWithSet,
    startFastMoneyPlayer,
    submitFastMoneyStepAnswer,
    passFastMoneyQuestion,
    setFastMoneyQuestionIndex,
    setFastMoneyStep,
    restartFastMoneyRound,
    revealAllFastMoney,
    fastMoneyTimer,
    startFastMoneyTimer,
    pauseFastMoneyTimer,
    resetFastMoneyTimer,
    tickFastMoneyTimer,
    setTvConnected,
    playBgm,
    stopBgm,
  } = useGameStore();

  const { openDisplayWindow, closeDisplayWindow, isDisplayWindowOpen, navigate } = useRouter();

  const [guessInput, setGuessInput] = useState('');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [fastMoneyActivePlayer, setFastMoneyActivePlayer] = useState<1 | 2>(1);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [tvStatus, setTvStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastPongTime, setLastPongTime] = useState<number>(0);
  const [showFmSetModal, setShowFmSetModal] = useState(false);
  const [fmSearchQuery, setFmSearchQuery] = useState('');
  const [fmStepInput, setFmStepInput] = useState('');
  const [playedFmSetIds, setPlayedFmSetIds] = useState<string[]>([]);
  const [previewSetId, setPreviewSetId] = useState<string | null>(null);

  // Load session on mount
  useEffect(() => {
    loadSession(gameId);
  }, [gameId, loadSession]);

  // Auto-initialize Fast Money with Set 01 if setId is not set yet
  useEffect(() => {
    if (session?.phase === GamePhase.FAST_MONEY && session.fastMoney && !session.fastMoney.setId) {
      initFastMoneyWithSet(FAST_MONEY_SETS[0]);
    }
  }, [session?.phase, session?.fastMoney?.setId, initFastMoneyWithSet]);

  // TV Heartbeat ping/pong and sync listener
  useEffect(() => {
    const pingInterval = setInterval(() => {
      syncBus.sendPing(Date.now());
      setLastPongTime((prevPong) => {
        if (prevPong > 0 && Date.now() - prevPong > 7000) {
          setTvStatus('disconnected');
          setTvConnected(false);
        }
        return prevPong;
      });
    }, 3000);

    syncBus.sendPing(Date.now());

    const unsubPong = syncBus.subscribePong(() => {
      setTvStatus('connected');
      setTvConnected(true);
      setLastPongTime(Date.now());
    });

    const unsubReqSync = syncBus.subscribeRequestSync(() => {
      setTvStatus('connected');
      setTvConnected(true);
      setLastPongTime(Date.now());
      if (session) {
        syncBus.broadcastState(session);
      }
    });

    return () => {
      clearInterval(pingInterval);
      unsubPong();
      unsubReqSync();
    };
  }, [session]);

  const handleOpenTVDisplay = async () => {
    if (!session) return;
    setTvStatus('reconnecting');
    await openDisplayWindow(session.id);
    syncBus.sendPing(Date.now());
    syncBus.broadcastState(session);
  };

  const handleReconnectDisplay = () => {
    if (!session) return;
    setTvStatus('reconnecting');
    syncBus.requestSync();
    syncBus.broadcastState(session);
    syncBus.sendPing(Date.now());
  };

  const handleCheckDisplayStatus = () => {
    syncBus.sendPing(Date.now());
    if (isDisplayWindowOpen()) {
      setTvStatus('connected');
    } else if (Date.now() - lastPongTime > 4000) {
      setTvStatus('reconnecting');
    }
  };

  const handleFullscreenDisplay = () => {
    syncBus.requestFullscreen();
  };

  const handleCloseTVDisplay = () => {
    closeDisplayWindow();
    syncBus.closeDisplay();
    setTvStatus('disconnected');
  };

  // Fast Money Timer Interval
  useEffect(() => {
    if (!fastMoneyTimer.running) return;
    const interval = setInterval(() => {
      tickFastMoneyTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [fastMoneyTimer.running, tickFastMoneyTimer]);

  // Keyboard Shortcuts Handler (Disabled when typing in input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings.keyboardShortcutsEnabled) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        recordStrike();
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        clearStrike();
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        undo();
      } else if (e.key >= '1' && e.key <= '8') {
        const round = session?.rounds[session.currentRoundIndex];
        if (round) {
          const idx = parseInt(e.key, 10) - 1;
          const ans = round.question.answers[idx];
          if (ans) {
            e.preventDefault();
            revealAnswer(ans.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardShortcutsEnabled, session, recordStrike, clearStrike, undo, revealAnswer]);

  if (!session) {
    return (
      <div className="min-h-screen bg-feud-dark text-white flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-feud-gold border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-feud-gold">Loading Host Console...</h2>
      </div>
    );
  }

  const currentRound = session.rounds[session.currentRoundIndex];
  const guessMatch = currentRound ? matchAnswer(currentRound.question, guessInput) : null;

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || !currentRound) return;

    if (guessMatch && guessMatch.isMatch && guessMatch.matchedAnswer) {
      revealAnswer(guessMatch.matchedAnswer.id);
      setGuessInput('');
    } else {
      // No match -> host can trigger strike
      recordStrike();
      setGuessInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#040c20] text-gray-100 flex flex-col select-none">
      {/* TOP HOST NAV BAR */}
      <header className="bg-[#07173e] border-b border-blue-900/80 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-xs bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800 px-3 py-1.5 rounded-lg font-bold"
          >
            ← Menu
          </button>
          <div className="flex items-baseline gap-2">
            <h1 className="font-display font-black text-xl text-feud-gold tracking-wide">
              HOST CONSOLE
            </h1>
            <span className="text-xs text-gray-400">· {session.title}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo Action */}
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              undoStack.length > 0
                ? 'bg-amber-600/30 border-amber-500 text-amber-200 hover:bg-amber-600/50'
                : 'bg-gray-800/40 border-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            title="Undo last action"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Undo ({undoStack.length})
          </button>

          {/* Score Adjustment Modal */}
          <button
            onClick={() => setIsScoreModalOpen(true)}
            className="bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            Adjust Score
          </button>

          {/* Restart Round */}
          <button
            onClick={() => setShowRestartConfirm(true)}
            className="bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-200 px-3 py-1.5 rounded-lg text-xs font-bold"
            title="Restart current round"
          >
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
            Restart Round
          </button>

          {/* End Game */}
          <button
            onClick={() => setShowEndGameConfirm(true)}
            className="bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            title="Conclude game and show Champion Results"
          >
            <Trophy className="w-3.5 h-3.5" />
            End Game
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-1.5 rounded-lg border text-xs font-bold ${
              settings.soundEnabled
                ? 'bg-blue-900/60 border-blue-600 text-blue-300'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
            title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* BGM Music Toggle */}
          <button
            onClick={() => {
              const next = settings.bgmEnabled === false;
              updateSettings({ bgmEnabled: next });
              if (!next) {
                stopBgm();
              } else {
                playBgm('theme');
              }
            }}
            className={`p-1.5 rounded-lg border text-xs font-bold ${
              settings.bgmEnabled !== false
                ? 'bg-purple-900/60 border-purple-600 text-purple-300'
                : 'bg-gray-800 border-gray-700 text-gray-500'
            }`}
            title={settings.bgmEnabled !== false ? 'Mute Background Music' : 'Unmute Background Music'}
          >
            <Music className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* TV DISPLAY & QUESTION NAVIGATION TOOLBAR */}
      <div className="bg-[#05112e] border-b border-blue-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* TV Connection & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Indicator Pill */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-blue-900 rounded-lg px-2.5 py-1">
            <span className="font-bold text-gray-300">TV Display:</span>
            <span
              className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-full ${
                tvStatus === 'connected'
                  ? 'bg-green-950/80 text-green-300 border border-green-500'
                  : tvStatus === 'reconnecting'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500 animate-pulse'
                  : 'bg-red-950/80 text-red-300 border border-red-500'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  tvStatus === 'connected'
                    ? 'bg-green-400'
                    : tvStatus === 'reconnecting'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-red-400'
                }`}
              />
              {tvStatus === 'connected'
                ? 'Connected'
                : tvStatus === 'reconnecting'
                ? 'Reconnecting'
                : 'Disconnected'}
            </span>
          </div>

          {/* TV Screen Action Buttons */}
          <button
            onClick={handleOpenTVDisplay}
            className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
            title="Open TV Board in a secondary monitor or separate window"
          >
            <Tv className="w-3.5 h-3.5" />
            Open TV Display
          </button>

          <button
            onClick={handleReconnectDisplay}
            className="bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-700/70 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Re-broadcast session state and reconnect display"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reconnect Display
          </button>

          <button
            onClick={handleCheckDisplayStatus}
            className="bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-700/70 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Check TV display connection status"
          >
            <Radio className="w-3.5 h-3.5" />
            Check Status
          </button>

          <button
            onClick={handleFullscreenDisplay}
            className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/70 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Toggle fullscreen on TV display"
          >
            <Maximize className="w-3.5 h-3.5" />
            Fullscreen TV
          </button>

          <button
            onClick={handleCloseTVDisplay}
            className="bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Close the TV display window"
          >
            <X className="w-3.5 h-3.5" />
            Close TV Display
          </button>
        </div>

        {/* Question Navigation Controls */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold uppercase text-[11px]">Questions:</span>
          <button
            onClick={previousRound}
            disabled={session.currentRoundIndex === 0}
            className="bg-blue-950 hover:bg-blue-900 disabled:opacity-40 border border-blue-700 text-white px-2.5 py-1 rounded-md font-bold flex items-center gap-1"
            title="Go to previous round / question"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {session.rounds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateToRound(idx)}
                className={`w-6 h-6 rounded text-[11px] font-bold font-mono transition-all ${
                  idx === session.currentRoundIndex
                    ? 'bg-feud-gold text-feud-dark font-black shadow-gold-glow'
                    : 'bg-blue-950 hover:bg-blue-800 text-blue-200 border border-blue-800'
                }`}
                title={`Jump to Round ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (session.currentRoundIndex < session.rounds.length - 1) {
                navigateToRound(session.currentRoundIndex + 1);
              } else {
                advanceRound();
              }
            }}
            className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-white px-2.5 py-1 rounded-md font-bold flex items-center gap-1"
            title="Go to next round / question"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK STATUS BAR */}
      <div className="bg-[#091f52] border-b border-blue-900/80 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-300">{session.team1.name}:</span>
            <span className="font-mono font-bold text-white text-sm bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              {session.team1.score} pts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-red-300">{session.team2.name}:</span>
            <span className="font-mono font-bold text-white text-sm bg-red-950 px-2 py-0.5 rounded border border-red-800">
              {session.team2.score} pts
            </span>
          </div>

          {currentRound && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Round Bank:</span>
              <span className="font-mono font-bold text-feud-gold text-sm bg-black/60 px-2.5 py-0.5 rounded border border-feud-gold/40">
                {currentRound.roundBank} pts (x{currentRound.multiplier})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400 uppercase tracking-wider text-[11px]">Phase:</span>
          <span className="bg-feud-gold/20 text-feud-gold px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-feud-gold/50 text-[11px]">
            {session.phase.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* MAIN HOST WORKSPACE */}
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto flex flex-col gap-4">
        {/* PHASE 1: FACE-OFF CONTROLS */}
        {session.phase === GamePhase.FACEOFF && currentRound && (
          <div className="bg-[#071638] border-2 border-feud-gold/60 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-blue-900 pb-2">
              <span className="text-feud-gold font-bold text-xs uppercase tracking-widest">
                FACE-OFF ROUND {currentRound.roundIndex + 1} ({currentRound.multiplier}X POINTS)
              </span>
              <span className="text-gray-400 text-xs">
                Ask the 2 representatives to buzz in. Highest survey answer plays or passes.
              </span>
            </div>

            <div className="bg-black/40 border border-blue-900 rounded-xl p-4 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="text-blue-300 text-xs font-bold uppercase">
                  Question Prompt (Read Aloud to Contestants):
                </span>
                <div className="flex items-center gap-2 text-xs">
                  {currentRound.question.questionType && (
                    <span className="bg-purple-950 border border-purple-700/80 text-purple-300 px-2 py-0.5 rounded font-medium text-[11px]">
                      🏷️ {currentRound.question.questionType}
                    </span>
                  )}
                  {currentRound.question.difficulty && (
                    <span className="bg-blue-950 border border-blue-700 text-blue-300 px-2 py-0.5 rounded uppercase font-bold text-[10px]">
                      {currentRound.question.difficulty}
                    </span>
                  )}
                  {currentRound.question.scriptureReference && (
                    <span className="bg-amber-950/80 border border-amber-600 text-amber-300 px-2.5 py-0.5 rounded font-bold font-mono text-xs">
                      📖 {currentRound.question.scriptureReference}
                    </span>
                  )}
                </div>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white leading-snug">
                "{currentRound.question.prompt}"
              </h2>
              {currentRound.question.scriptureExplanation && (
                <div className="mt-2.5 pt-2 border-t border-blue-900/80 text-xs text-amber-200/90 leading-relaxed bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/50">
                  <span className="font-bold text-amber-400 mr-1.5">Scripture Context / Explanation:</span>
                  {currentRound.question.scriptureExplanation}
                </div>
              )}
            </div>

            {/* Answer Cheat Sheet for Host */}
            <div className="mb-6">
              <span className="text-xs font-bold text-gray-300 uppercase block mb-2">
                Survey Answers & Point Values:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {currentRound.question.answers.map((ans, idx) => (
                  <div
                    key={ans.id}
                    className="bg-[#0b2256] border border-blue-700/60 rounded-lg p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="truncate pr-1 text-white font-semibold">
                      <span className="font-bold text-feud-gold mr-1">{idx + 1}.</span>
                      {ans.text}
                    </span>
                    <span className="font-bold font-mono text-feud-gold text-sm shrink-0">{ans.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Winner Decision Picker */}
            <div className="border-t border-blue-900/80 pt-4">
              <span className="text-xs font-bold text-gray-300 uppercase block mb-3">
                Select Face-Off Winner & Decision:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Team 1 Options */}
                <div className="bg-blue-950/40 border border-blue-700/60 rounded-xl p-3 flex flex-col gap-2">
                  <span className="font-bold text-blue-300 text-sm">{session.team1.name} Wins Face-off</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveFaceOff(session.team1.id, 'play')}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-lg text-xs"
                    >
                      They PLAY the Board
                    </button>
                    <button
                      onClick={() => resolveFaceOff(session.team1.id, 'pass')}
                      className="flex-1 bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 font-bold py-2 px-3 rounded-lg text-xs"
                    >
                      They PASS to {session.team2.name}
                    </button>
                  </div>
                </div>

                {/* Team 2 Options */}
                <div className="bg-red-950/40 border border-red-700/60 rounded-xl p-3 flex flex-col gap-2">
                  <span className="font-bold text-red-300 text-sm">{session.team2.name} Wins Face-off</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveFaceOff(session.team2.id, 'play')}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded-lg text-xs"
                    >
                      They PLAY the Board
                    </button>
                    <button
                      onClick={() => resolveFaceOff(session.team2.id, 'pass')}
                      className="flex-1 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-bold py-2 px-3 rounded-lg text-xs"
                    >
                      They PASS to {session.team1.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 2 & 3: REGULAR PLAY OR STEAL CONTROLS */}
        {(session.phase === GamePhase.REGULAR || session.phase === GamePhase.STEAL) && currentRound && (
          <div className="flex flex-col gap-4">
            {/* Top Prompt Card */}
            <div className="bg-[#071638] border-2 border-blue-800 rounded-2xl p-4 shadow-md flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-feud-gold text-xs font-bold uppercase tracking-wider">
                      Question Prompt (Round {currentRound.roundIndex + 1}):
                    </span>
                    {currentRound.question.questionType && (
                      <span className="bg-purple-950 border border-purple-700/80 text-purple-300 px-2 py-0.5 rounded text-[11px] font-medium">
                        🏷️ {currentRound.question.questionType}
                      </span>
                    )}
                    {currentRound.question.difficulty && (
                      <span className="bg-blue-950 border border-blue-700 text-blue-300 px-2 py-0.5 rounded uppercase font-bold text-[10px]">
                        {currentRound.question.difficulty}
                      </span>
                    )}
                    {currentRound.question.scriptureReference && (
                      <span className="bg-amber-950/80 border border-amber-600 text-amber-300 px-2.5 py-0.5 rounded font-bold font-mono text-xs">
                        📖 {currentRound.question.scriptureReference}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white leading-snug">
                    "{currentRound.question.prompt}"
                  </h2>
                </div>

                {/* Active Control Team Badge */}
                <div className="bg-black/60 border border-blue-700 rounded-xl px-4 py-2 text-right shrink-0">
                  <span className="text-gray-300 text-[10px] uppercase font-bold block">Controlling Team:</span>
                  <span className="font-display font-extrabold text-lg text-blue-200">
                    {currentRound.controlTeamId === session.team1.id ? session.team1.name : session.team2.name}
                  </span>
                </div>
              </div>

              {currentRound.question.scriptureExplanation && (
                <div className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/50">
                  <span className="font-bold text-amber-400 mr-1.5">Scripture Context / Explanation:</span>
                  {currentRound.question.scriptureExplanation}
                </div>
              )}
            </div>

            {/* STEAL ALERT BANNER (If in Steal Phase) */}
            {session.phase === GamePhase.STEAL && (
              <div className="bg-gradient-to-r from-red-900 via-red-700 to-red-900 border-2 border-white rounded-2xl p-4 text-white shadow-red-strike flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-200 block">
                    3 STRIKES REACHED! STEAL ATTEMPT BY:
                  </span>
                  <h3 className="font-display font-black text-2xl">
                    {currentRound.stealTeamId === session.team1.id ? session.team1.name : session.team2.name}
                  </h3>
                  <p className="text-xs text-red-200 mt-0.5">
                    Opposing team can give 1 answer. If it's on the board, they steal the entire bank!
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => resolveSteal(true)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Steal SUCCESSFUL
                  </button>
                  <button
                    onClick={() => resolveSteal(false)}
                    className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-2.5 rounded-xl text-sm border border-red-500 flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Steal FAILED
                  </button>
                </div>
              </div>
            )}

            {/* LIVE ANSWER SEARCH / AUTO-MATCHER */}
            <div className="bg-[#0b1c44] border border-blue-800 rounded-xl p-3 shadow-md flex items-center gap-3">
              <form onSubmit={handleGuessSubmit} className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  placeholder="Type contestant's spoken guess (auto-matches variants like 'fridge', 'bbq')..."
                  className="flex-1 bg-black/60 border border-blue-500/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-feud-gold"
                />

                {guessMatch?.isMatch && guessMatch.matchedAnswer ? (
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Reveal "{guessMatch.matchedAnswer.text}" (+{guessMatch.points} pts)
                  </button>
                ) : guessInput.trim().length > 0 ? (
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Not on board → Strike!
                  </button>
                ) : null}
              </form>

              {/* Strike Controls Bar */}
              <div className="flex items-center gap-2 border-l border-blue-900 pl-3">
                <button
                  onClick={recordStrike}
                  className="bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2 rounded-lg text-sm shadow-md flex items-center gap-1"
                  title="Record Strike (Press 'X')"
                >
                  <XCircle className="w-4 h-4" />
                  STRIKE (X)
                </button>

                <button
                  onClick={clearStrike}
                  disabled={currentRound.strikes === 0}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 font-bold px-3 py-2 rounded-lg text-xs"
                  title="Clear Strike (Press 'Z')"
                >
                  Clear Strike
                </button>

                {/* Strikes Graphic Indicator */}
                <div className="flex gap-1 bg-black/40 px-2 py-1.5 rounded-lg border border-blue-900">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={`font-display font-black text-base ${
                        i < currentRound.strikes ? 'text-red-500' : 'text-gray-700'
                      }`}
                    >
                      X
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* BOARD ANSWER SLOTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentRound.question.answers.map((ans, idx) => {
                const isRevealed = currentRound.revealedAnswerIds.includes(ans.id);
                return (
                  <div
                    key={ans.id}
                    className={`rounded-xl p-3 border-2 transition-all flex items-center justify-between ${
                      isRevealed
                        ? 'bg-[#0f2c69] border-feud-gold/70 text-white'
                        : 'bg-[#061536] border-blue-900/80 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-600 flex items-center justify-center font-bold text-sm text-feud-gold font-mono shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white leading-tight">{ans.text}</div>
                        {ans.acceptedVariants && ans.acceptedVariants.length > 0 && (
                          <div className="text-[11px] text-blue-200/90 font-medium mt-0.5">
                            Variants: {ans.acceptedVariants.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm bg-black/50 px-2.5 py-1 rounded text-feud-gold">
                        {ans.points} pts
                      </span>

                      {isRevealed ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-green-400 font-bold text-xs px-2.5 py-1 bg-green-950/80 border border-green-700/60 rounded">
                            Revealed
                          </span>
                          <button
                            onClick={() => hideAnswer(ans.id)}
                            className="bg-amber-950 hover:bg-amber-900 border border-amber-600/70 text-amber-200 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow"
                            title="Hide / Undo reveal for this answer"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            Hide
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => revealAnswer(ans.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1 rounded shadow"
                        >
                          Reveal
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HOST ACTIONS FOOTER */}
            <div className="bg-[#071638] border border-blue-900 rounded-xl p-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={revealAllRemainingAnswers}
                  className="bg-blue-950 hover:bg-blue-900 border border-blue-700/80 text-blue-200 text-xs font-bold px-3 py-2 rounded-lg"
                >
                  Reveal All Remaining Answers
                </button>

                <button
                  onClick={() => awardRoundBank(session.team1.id)}
                  disabled={currentRound.isBankAwarded}
                  className="bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  Award Bank to {session.team1.name}
                </button>

                <button
                  onClick={() => awardRoundBank(session.team2.id)}
                  disabled={currentRound.isBankAwarded}
                  className="bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  Award Bank to {session.team2.name}
                </button>
              </div>

              <button
                onClick={advanceRound}
                className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-xs px-5 py-2 rounded-lg shadow-gold-glow flex items-center gap-1.5"
              >
                Proceed to Round Summary
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: ROUND SUMMARY */}
        {session.phase === GamePhase.ROUND_SUMMARY && currentRound && (
          <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-6 shadow-stage flex flex-col items-center text-center">
            <span className="text-feud-gold font-bold text-xs uppercase tracking-widest mb-1">
              ROUND {currentRound.roundIndex + 1} SUMMARY
            </span>
            <h2 className="font-display font-black text-3xl text-white mb-4">
              Round Complete!
            </h2>

            <div className="bg-feud-dark/80 border border-blue-900 rounded-xl p-4 my-2 max-w-md w-full">
              <span className="text-gray-400 text-xs uppercase block">Bank Awarded:</span>
              <span className="font-display font-black text-4xl text-feud-gold">
                +{currentRound.awardedPoints} pts
              </span>
              <span className="text-gray-400 text-xs block mt-1">
                to {currentRound.awardedToTeamId === session.team1.id ? session.team1.name : session.team2.name}
              </span>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={revealAllRemainingAnswers}
                className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-sm font-bold px-4 py-2.5 rounded-xl"
              >
                Reveal All Remaining Answers
              </button>
              <button
                onClick={advanceRound}
                className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-sm px-6 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
              >
                {session.currentRoundIndex + 1 < session.rounds.length
                  ? `Start Round ${session.currentRoundIndex + 2} →`
                  : 'Advance to Fast Money →'}
              </button>
            </div>
          </div>
        )}

        {/* PHASE 5: FAST MONEY ERROR BANNER */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoneyError && (
          <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-5 shadow-stage flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-display font-black text-xl text-red-100 uppercase tracking-wide">
                Fast Money Bank Unavailable
              </h2>
              <p className="text-sm text-red-200 mt-1">
                {session.fastMoneyError}
              </p>
              <p className="text-xs text-red-300/80 mt-2">
                Fast Money strictly prohibits using or falling back to regular-round questions.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => setShowFmSetModal(true)}
                  className="bg-red-900 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-red-400 transition-colors"
                >
                  Choose Another Set
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 5: FAST MONEY HOST CONTROLS */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoney && !session.fastMoneyError && (
          <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-4 sm:p-5 shadow-stage flex flex-col gap-4">
            {/* Top Bar: Set Info, Question Set Switcher, and Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-900 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-feud-gold font-bold text-xs uppercase tracking-widest">
                    FAST MONEY ROUND
                  </span>
                  <span className="bg-feud-gold text-[#071638] font-black text-[11px] px-2 py-0.5 rounded uppercase">
                    {session.fastMoney.setTitle || 'Set 01'}
                  </span>
                  {session.fastMoney.setId && (
                    <span className="text-gray-400 text-xs font-mono">
                      ({session.fastMoney.setId})
                    </span>
                  )}
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                  Target Score: {session.fastMoney.targetScore} pts · Current Total: {session.fastMoney.totalScore} pts
                </h2>
              </div>

              {/* Set Selection and Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFmSetModal(true)}
                  className="bg-blue-900/90 hover:bg-blue-800 text-blue-200 border border-blue-600/80 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-feud-gold" />
                  Choose Set (20 Available)
                </button>
                <button
                  onClick={() => {
                    const rnd = getRandomFastMoneySet(playedFmSetIds);
                    initFastMoneyWithSet(rnd);
                    if (!playedFmSetIds.includes(rnd.id)) {
                      setPlayedFmSetIds([...playedFmSetIds, rnd.id]);
                    }
                  }}
                  className="bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-500/80 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  title="Randomly choose an unplayed set"
                >
                  <Shuffle className="w-3.5 h-3.5 text-purple-300" />
                  Random Set
                </button>
                <button
                  onClick={restartFastMoneyRound}
                  className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/80 font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Reset answers & score for this round"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart Set
                </button>
              </div>
            </div>

            {/* Stepper Phase Progress Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              {[
                { key: 'setup', label: '1. Setup' },
                { key: 'player1_playing', label: '2. Player 1 (20s)' },
                { key: 'player1_review', label: '3. P1 Review' },
                { key: 'player2_playing', label: '4. Player 2 (25s)' },
                { key: 'player2_review', label: '5. P2 Review' },
                { key: 'reveal', label: '6. Dramatic Reveal' },
              ].map((stepItem) => {
                const isActive = (session.fastMoney?.step || 'setup') === stepItem.key;
                return (
                  <button
                    key={stepItem.key}
                    onClick={() => setFastMoneyStep(stepItem.key as FastMoneyStep)}
                    className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-feud-gold text-[#071638] font-black border-white shadow-md'
                        : 'bg-[#0b1e4a] text-gray-300 border-blue-900 hover:bg-blue-900/60'
                    }`}
                  >
                    {stepItem.label}
                  </button>
                );
              })}
            </div>

            {/* Timer Bar */}
            <div className="bg-[#0b2256] border border-blue-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-feud-gold" />
                <span className="text-xs uppercase font-bold text-blue-200">
                  {session.fastMoney.step === 'player2_playing' ? 'Player 2 Clock (25s)' : 'Player 1 Clock (20s)'}:
                </span>
                <span
                  className={`font-mono font-black text-3xl ${
                    fastMoneyTimer.remaining <= 5 && fastMoneyTimer.running
                      ? 'text-red-400 animate-pulse'
                      : 'text-feud-gold'
                  }`}
                >
                  {fastMoneyTimer.remaining}s
                </span>
              </div>

              <div className="flex items-center gap-2">
                {fastMoneyTimer.running ? (
                  <button
                    onClick={pauseFastMoneyTimer}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-bold text-xs"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      startFastMoneyTimer(
                        fastMoneyTimer.remaining ||
                          (session.fastMoney?.activePlayer === 2 ? 25 : 20)
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-xs shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Timer
                  </button>
                )}
                <button
                  onClick={() =>
                    resetFastMoneyTimer(session.fastMoney?.activePlayer === 2 ? 25 : 20)
                  }
                  className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={() => startFastMoneyTimer(fastMoneyTimer.remaining + 5)}
                  className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 rounded-lg text-blue-200 font-bold text-xs"
                  title="Add 5 seconds"
                >
                  +5s
                </button>
              </div>
            </div>

            {/* LIVE STEPPER VIEW (When Player 1 or Player 2 is Playing) */}
            {(session.fastMoney.step === 'player1_playing' ||
              session.fastMoney.step === 'player2_playing') && (
              <div className="bg-[#0b1e4a] border-2 border-blue-500/80 rounded-xl p-4 flex flex-col gap-4 shadow-lg">
                {/* Active Player & Stepper Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-feud-gold text-[#071638] font-black text-xs px-2.5 py-1 rounded uppercase">
                      Active: {session.fastMoney.step === 'player1_playing' ? 'Player 1' : 'Player 2'}
                    </span>
                    <span className="text-gray-300 text-xs font-semibold">
                      Question {(session.fastMoney.currentQuestionIndex ?? 0) + 1} of 5
                    </span>
                  </div>

                  {/* Question Navigator Pills 1..5 */}
                  <div className="flex items-center gap-1.5">
                    {session.fastMoney.questions.map((_, qIdx) => {
                      const curIdx = session.fastMoney?.currentQuestionIndex ?? 0;
                      const activePlKey =
                        session.fastMoney?.step === 'player2_playing' ? 'player2' : 'player1';
                      const record = session.fastMoney?.[activePlKey].answers[qIdx];
                      const isPassed = (session.fastMoney?.passedIndices ?? []).includes(qIdx);
                      const isAnswered = Boolean(record?.submittedText && !record.isPassed);
                      const isCurrent = curIdx === qIdx;

                      return (
                        <button
                          key={qIdx}
                          onClick={() => setFastMoneyQuestionIndex(qIdx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                            isCurrent
                              ? 'bg-feud-gold text-[#071638] border-white scale-110 shadow'
                              : isAnswered
                              ? 'bg-green-700 text-white border-green-500'
                              : isPassed
                              ? 'bg-amber-700 text-white border-amber-500'
                              : 'bg-blue-950 text-gray-400 border-blue-800'
                          }`}
                        >
                          {qIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duplicate Answer Warning Alert (for Player 2) */}
                {session.fastMoney.duplicateWarning && (
                  <div className="bg-red-950/90 border-2 border-red-500 text-red-100 p-3 rounded-xl flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      <div>
                        <span className="font-black text-sm block">DUPLICATE DETECTED! (BUZZER SOUNDS)</span>
                        <span className="text-xs">{session.fastMoney.duplicateWarning}</span>
                      </div>
                    </div>
                    {fmStepInput.trim() && (
                      <button
                        onClick={() => {
                          submitFastMoneyStepAnswer(2, fmStepInput, true);
                          setFmStepInput('');
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow"
                      >
                        Allow Override
                      </button>
                    )}
                  </div>
                )}

                {/* Active Question Prompt */}
                {session.fastMoney.questions[session.fastMoney.currentQuestionIndex ?? 0] && (
                  <div className="bg-[#071638] border border-blue-700 rounded-xl p-4">
                    <span className="text-blue-300 text-[11px] uppercase tracking-wider font-bold block mb-1">
                      Prompt #{((session.fastMoney.currentQuestionIndex ?? 0) + 1)} ·{' '}
                      {session.fastMoney.questions[session.fastMoney.currentQuestionIndex ?? 0].category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      &ldquo;{session.fastMoney.questions[session.fastMoney.currentQuestionIndex ?? 0].prompt}&rdquo;
                    </h3>

                    {/* Survey Answer Quick Pills (Click to instantly submit!) */}
                    <div className="mt-3 pt-3 border-t border-blue-900/80">
                      <span className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold block mb-2">
                        Quick Match Recognized Survey Answers:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {session.fastMoney.questions[session.fastMoney.currentQuestionIndex ?? 0].answers.map(
                          (ans) => (
                            <button
                              key={ans.id}
                              onClick={() => {
                                const activeNum = session.fastMoney?.step === 'player2_playing' ? 2 : 1;
                                const isDup = submitFastMoneyStepAnswer(activeNum, ans.text, false);
                                if (!isDup) setFmStepInput('');
                              }}
                              className="bg-blue-950 hover:bg-blue-800 border border-blue-700/80 hover:border-feud-gold text-blue-100 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              <span>{ans.text}</span>
                              <span className="bg-feud-gold text-[#071638] text-[10px] font-black px-1.5 py-0.2 rounded">
                                {ans.points}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contestant Answer Input Box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fmStepInput}
                    onChange={(e) => setFmStepInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && fmStepInput.trim()) {
                        const activeNum = session.fastMoney?.step === 'player2_playing' ? 2 : 1;
                        const isDup = submitFastMoneyStepAnswer(activeNum, fmStepInput, false);
                        if (!isDup) setFmStepInput('');
                      }
                    }}
                    placeholder="Type contestant answer and press Enter..."
                    className="flex-1 bg-black/70 border border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm font-semibold focus:outline-none focus:border-feud-gold focus:ring-1 focus:ring-feud-gold"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (fmStepInput.trim()) {
                        const activeNum = session.fastMoney?.step === 'player2_playing' ? 2 : 1;
                        const isDup = submitFastMoneyStepAnswer(activeNum, fmStepInput, false);
                        if (!isDup) setFmStepInput('');
                      }
                    }}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      const activeNum = session.fastMoney?.step === 'player2_playing' ? 2 : 1;
                      passFastMoneyQuestion(activeNum);
                      setFmStepInput('');
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
                  >
                    PASS
                  </button>
                </div>

                {/* Bottom Action: End Round Early */}
                <div className="flex justify-between items-center pt-2 border-t border-blue-900/80">
                  <span className="text-gray-400 text-xs">
                    Contestant can answer or pass. If passed, question returns automatically.
                  </span>
                  <button
                    onClick={() => {
                      const nextStep =
                        session.fastMoney?.step === 'player1_playing'
                          ? 'player1_review'
                          : 'player2_review';
                      setFastMoneyStep(nextStep);
                      pauseFastMoneyTimer();
                    }}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-3 py-1.5 rounded-lg"
                  >
                    Finish Answering & Review →
                  </button>
                </div>
              </div>
            )}

            {/* SETUP OR REVIEW OR REVEAL VIEW */}
            {session.fastMoney.step !== 'player1_playing' &&
              session.fastMoney.step !== 'player2_playing' && (
                <div className="flex flex-col gap-4">
                  {/* Step Action Prompts */}
                  {session.fastMoney.step === 'setup' && (
                    <div className="bg-gradient-to-r from-blue-950 to-indigo-950 border-2 border-blue-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold text-base mb-1">Ready for Player 1</h3>
                        <p className="text-gray-300 text-xs">
                          Player 1 has 20 seconds to answer all 5 questions.
                        </p>
                      </div>
                      <button
                        onClick={() => startFastMoneyPlayer(1)}
                        className="bg-green-600 hover:bg-green-500 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" /> Start Player 1 Round (20s)
                      </button>
                    </div>
                  )}

                  {session.fastMoney.step === 'player1_review' && (
                    <div className="bg-gradient-to-r from-amber-950 to-orange-950 border-2 border-feud-gold rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold text-base mb-1">
                          Player 1 Completed ({session.fastMoney.player1.totalScore} pts)
                        </h3>
                        <p className="text-gray-300 text-xs">
                          Review answers below. When ready, bring in Player 2 (answers are hidden from Player 2).
                        </p>
                      </div>
                      <button
                        onClick={() => startFastMoneyPlayer(2)}
                        className="bg-feud-gold hover:bg-feud-goldLight text-[#071638] font-black text-sm px-6 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" /> Start Player 2 Round (25s)
                      </button>
                    </div>
                  )}

                  {session.fastMoney.step === 'player2_review' && (
                    <div className="bg-gradient-to-r from-indigo-950 to-blue-950 border-2 border-indigo-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold text-base mb-1">
                          Both Players Finished Answering!
                        </h3>
                        <p className="text-gray-300 text-xs">
                          Combined Potential Score: {session.fastMoney.totalScore} / {session.fastMoney.targetScore} pts.
                          Switch to the dramatic sequential reveal on the TV screen!
                        </p>
                      </div>
                      <button
                        onClick={() => setFastMoneyStep('reveal')}
                        className="bg-feud-gold hover:bg-feud-goldLight text-[#071638] font-black text-sm px-6 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> Switch to Dramatic Reveal Mode
                      </button>
                    </div>
                  )}

                  {/* Active Player Tabs (Player 1 / Player 2) */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFastMoneyActivePlayer(1)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                        fastMoneyActivePlayer === 1
                          ? 'bg-blue-600 border-white text-white shadow-md'
                          : 'bg-blue-950/60 border-blue-900 text-blue-300'
                      }`}
                    >
                      <span>Player 1</span>
                      <span className="bg-black/40 px-2 py-0.5 rounded text-xs font-mono">
                        {session.fastMoney.player1.totalScore} pts
                      </span>
                    </button>
                    <button
                      onClick={() => setFastMoneyActivePlayer(2)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                        fastMoneyActivePlayer === 2
                          ? 'bg-blue-600 border-white text-white shadow-md'
                          : 'bg-blue-950/60 border-blue-900 text-blue-300'
                      }`}
                    >
                      <span>Player 2</span>
                      <span className="bg-black/40 px-2 py-0.5 rounded text-xs font-mono">
                        {session.fastMoney.player2.totalScore} pts
                      </span>
                    </button>
                  </div>

                  {/* Reveal All Shortcuts (For Dramatic TV presentation) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0b1e4a] border border-blue-800 rounded-xl p-3">
                    <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">
                      TV Board Reveal Controls:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => revealAllFastMoney(1)}
                        className="bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        Reveal All Player 1
                      </button>
                      <button
                        onClick={() => revealAllFastMoney(2)}
                        className="bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        Reveal All Player 2
                      </button>
                    </div>
                  </div>

                  {/* 5 Questions Table with Reveal & Edit Controls */}
                  <div className="flex flex-col gap-2.5">
                    {session.fastMoney.questions.map((q, qIdx) => {
                      const playerKey = fastMoneyActivePlayer === 1 ? 'player1' : 'player2';
                      const ansRecord = session.fastMoney![playerKey].answers[qIdx];
                      const isAnsRevealed =
                        session.fastMoney![playerKey].revealedAnswerIndices.includes(qIdx);
                      const isPtsRevealed =
                        session.fastMoney![playerKey].revealedPointsIndices.includes(qIdx);

                      return (
                        <div
                          key={q.id}
                          className="bg-[#0b1e4a] border border-blue-800/80 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                        >
                          {/* Prompt */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white mb-1 leading-snug">
                              <span className="text-feud-gold mr-1">{qIdx + 1}.</span>
                              {q.prompt}
                            </div>

                            {/* Dropdown / match suggestions from survey */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <input
                                type="text"
                                value={ansRecord?.submittedText || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const match = matchAnswer(q, val);
                                  submitFastMoneyAnswer(
                                    fastMoneyActivePlayer,
                                    qIdx,
                                    val,
                                    match.points,
                                    match.matchedAnswer?.id ?? null
                                  );
                                }}
                                placeholder="Type answer..."
                                className="bg-black/60 border border-blue-600/50 rounded-lg px-2.5 py-1 text-white text-xs w-44 focus:outline-none"
                              />

                              {/* Survey answers dropdown */}
                              <select
                                onChange={(e) => {
                                  const chosenId = e.target.value;
                                  const found = q.answers.find((a) => a.id === chosenId);
                                  if (found) {
                                    submitFastMoneyAnswer(
                                      fastMoneyActivePlayer,
                                      qIdx,
                                      found.text,
                                      found.points,
                                      found.id
                                    );
                                  }
                                }}
                                className="bg-black/60 border border-blue-700 rounded-lg px-2 py-1 text-[11px] text-gray-300 max-w-[200px]"
                                value={ansRecord?.matchedAnswerId || ''}
                              >
                                <option value="">-- Match Survey Answer --</option>
                                {q.answers.map((a) => (
                                  <option key={a.id} value={a.id}>
                                    {a.text} ({a.points} pts)
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Points & Reveal Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] text-gray-400">Pts:</span>
                              <input
                                type="number"
                                value={ansRecord?.points ?? 0}
                                onChange={(e) => {
                                  submitFastMoneyAnswer(
                                    fastMoneyActivePlayer,
                                    qIdx,
                                    ansRecord?.submittedText || '',
                                    Number(e.target.value),
                                    ansRecord?.matchedAnswerId ?? null
                                  );
                                }}
                                className="w-16 bg-black/60 border border-blue-600 rounded px-2 py-1 text-white font-mono text-xs font-bold text-center"
                              />
                            </div>

                            {/* Reveal Answer Toggle */}
                            <button
                              onClick={() => revealFastMoneyAnswer(fastMoneyActivePlayer, qIdx)}
                              className={`text-xs px-2.5 py-1 rounded font-bold border transition-colors ${
                                isAnsRevealed
                                  ? 'bg-blue-600 border-white text-white'
                                  : 'bg-blue-950 border-blue-800 text-blue-300 hover:bg-blue-900'
                              }`}
                            >
                              {isAnsRevealed ? 'Ans Revealed' : 'Reveal Ans'}
                            </button>

                            {/* Reveal Points Toggle */}
                            <button
                              onClick={() => revealFastMoneyPoints(fastMoneyActivePlayer, qIdx)}
                              className={`text-xs px-2.5 py-1 rounded font-bold border transition-colors ${
                                isPtsRevealed
                                  ? 'bg-feud-gold border-white text-feud-dark'
                                  : 'bg-yellow-950 border-yellow-700 text-feud-gold hover:bg-yellow-900'
                              }`}
                            >
                              {isPtsRevealed ? 'Pts Revealed' : 'Reveal Pts'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Fast Money Complete button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-blue-900">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span>Total: <strong className="text-white">{session.fastMoney.totalScore}</strong> / {session.fastMoney.targetScore} pts</span>
                      {session.fastMoney.totalScore >= session.fastMoney.targetScore ? (
                        <span className="text-green-400 font-bold">(Target Reached!)</span>
                      ) : (
                        <span className="text-amber-400">({session.fastMoney.targetScore - session.fastMoney.totalScore} pts needed)</span>
                      )}
                    </div>
                    <button
                      onClick={resolveFastMoney}
                      className="bg-green-600 hover:bg-green-500 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                    >
                      Conclude Fast Money & Declare Winner
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* FAST MONEY SET SELECTION MODAL */}
        {showFmSetModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-blue-900 bg-[#0b1e4a]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-feud-gold" />
                  <h3 className="font-display font-black text-xl text-white">
                    Fast Money Question Bank (20 Sets)
                  </h3>
                </div>
                <button
                  onClick={() => setShowFmSetModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Actions Bar */}
              <div className="p-4 border-b border-blue-900/80 bg-[#091a42] flex flex-wrap items-center justify-between gap-3">
                <input
                  type="text"
                  value={fmSearchQuery}
                  onChange={(e) => setFmSearchQuery(e.target.value)}
                  placeholder="Search 20 sets by title, category, or question..."
                  className="flex-1 min-w-[240px] bg-black/60 border border-blue-700 rounded-xl px-3.5 py-2 text-white text-xs placeholder:text-gray-400 focus:outline-none focus:border-feud-gold"
                />
                <button
                  onClick={() => {
                    const rnd = getRandomFastMoneySet(playedFmSetIds);
                    initFastMoneyWithSet(rnd);
                    if (!playedFmSetIds.includes(rnd.id)) {
                      setPlayedFmSetIds([...playedFmSetIds, rnd.id]);
                    }
                    setShowFmSetModal(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Pick Random Unplayed Set
                </button>
              </div>

              {/* Sets List */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {FAST_MONEY_SETS.filter((s) => {
                  if (!fmSearchQuery.trim()) return true;
                  const q = fmSearchQuery.toLowerCase();
                  return (
                    s.title.toLowerCase().includes(q) ||
                    (s.description?.toLowerCase().includes(q) ?? false) ||
                    s.questions.some(
                      (item) =>
                        item.prompt.toLowerCase().includes(q) ||
                        item.category?.toLowerCase().includes(q)
                    )
                  );
                }).map((set) => {
                  const isCurrent = session.fastMoney?.setId === set.id;
                  const isPlayed = playedFmSetIds.includes(set.id);
                  const isPreview = previewSetId === set.id;

                  return (
                    <div
                      key={set.id}
                      className={`border rounded-xl p-3.5 transition-all ${
                        isCurrent
                          ? 'bg-blue-950/90 border-feud-gold shadow-md'
                          : 'bg-[#0b1e4a]/70 border-blue-900 hover:border-blue-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-white text-base">
                            {set.title}
                          </span>
                          {isCurrent && (
                            <span className="bg-feud-gold text-[#071638] font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                              Active
                            </span>
                          )}
                          {isPlayed && !isCurrent && (
                            <span className="bg-gray-800 text-gray-400 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                              Played
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewSetId(isPreview ? null : set.id)}
                            className="text-xs text-blue-300 hover:text-white underline font-semibold"
                          >
                            {isPreview ? 'Hide Questions' : 'Preview Questions'}
                          </button>
                          <button
                            onClick={() => {
                              initFastMoneyWithSet(set);
                              if (!playedFmSetIds.includes(set.id)) {
                                setPlayedFmSetIds([...playedFmSetIds, set.id]);
                              }
                              setShowFmSetModal(false);
                            }}
                            className="bg-feud-gold hover:bg-feud-goldLight text-[#071638] font-black text-xs px-3 py-1.5 rounded-lg shadow transition-colors"
                          >
                            Load This Set
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 text-xs mb-2 leading-relaxed">
                        {set.description}
                      </p>

                      {/* Question Preview List */}
                      {isPreview && (
                        <div className="mt-2 pt-2 border-t border-blue-900/80 flex flex-col gap-1.5 bg-black/40 rounded-lg p-2.5">
                          {set.questions.map((q, idx) => (
                            <div key={q.id} className="text-xs text-gray-200">
                              <span className="text-feud-gold font-bold mr-1.5">{idx + 1}.</span>
                              <span className="font-medium">{q.prompt}</span>
                              <span className="text-[10px] text-gray-400 ml-2">({q.category})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 6: FINAL RESULTS */}
        {session.phase === GamePhase.FINAL_RESULTS && (
          <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-6 text-center shadow-stage">
            <h2 className="font-display font-black text-3xl text-feud-gold mb-2">
              GAME SHOW CONCLUDED!
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Final results are currently displayed on the TV screen.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate(`/results/${session.id}`)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl"
              >
                View Game Summary & Printable Results
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm px-6 py-2.5 rounded-xl"
              >
                Return to Main Menu
              </button>
            </div>
          </div>
        )}
      </main>

      {/* RESTART CONFIRMATION MODAL */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0b1c44] border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full text-white">
            <h3 className="font-display font-black text-xl text-red-400 mb-2">
              Restart Current Round?
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              This will reset the board, clear all revealed answers, clear strikes, and revert any points awarded in this round.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-4 py-2 bg-gray-800 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  restartRound();
                  setShowRestartConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold"
              >
                Yes, Restart Round
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END GAME CONFIRMATION MODAL */}
      {showEndGameConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0b1c44] border-2 border-purple-500 rounded-2xl p-6 max-w-sm w-full text-white shadow-xl">
            <h3 className="font-display font-black text-xl text-purple-300 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-feud-gold" />
              End Game Now?
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              This will conclude regular play and display the Champion Victory screen on the TV Display.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEndGameConfirm(false)}
                className="px-4 py-2 bg-gray-800 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  endGame();
                  setShowEndGameConfirm(false);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold"
              >
                Yes, End Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCORE ADJUSTMENT MODAL */}
      <ScoreAdjustModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        team1={session.team1}
        team2={session.team2}
        onAdjust={(teamId, delta, reason) => adjustScore(teamId, delta, reason)}
      />
    </div>
  );
}
