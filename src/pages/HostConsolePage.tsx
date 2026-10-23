import { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Tv,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  Play,
  Pause,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useRouter } from '../router/Router';
import { GamePhase } from '../types/game';
import { matchAnswer } from '../engine/answerMatcher';
import { ScoreAdjustModal } from '../components/host/ScoreAdjustModal';

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
    revealAllRemainingAnswers,
    recordStrike,
    clearStrike,
    resolveFaceOff,
    resolveSteal,
    awardRoundBank,
    advanceRound,
    restartRound,
    adjustScore,
    undo,
    submitFastMoneyAnswer,
    revealFastMoneyAnswer,
    revealFastMoneyPoints,
    resolveFastMoney,
    fastMoneyTimer,
    startFastMoneyTimer,
    pauseFastMoneyTimer,
    resetFastMoneyTimer,
    tickFastMoneyTimer,
  } = useGameStore();

  const { openDisplayWindow, navigate } = useRouter();

  const [guessInput, setGuessInput] = useState('');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [fastMoneyActivePlayer, setFastMoneyActivePlayer] = useState<1 | 2>(1);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // Load session on mount
  useEffect(() => {
    loadSession(gameId);
  }, [gameId, loadSession]);

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
          {/* Pop out TV Display */}
          <button
            onClick={() => openDisplayWindow(session.id)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
            title="Open TV Board in a separate window for television / projector"
          >
            <Tv className="w-4 h-4" />
            Open TV Display
          </button>

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
        </div>
      </header>

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
              <span className="text-blue-300 text-xs font-bold uppercase block mb-1">
                Question Prompt (Read Aloud to Contestants):
              </span>
              <h2 className="font-display font-black text-2xl text-white">
                "{currentRound.question.prompt}"
              </h2>
            </div>

            {/* Answer Cheat Sheet for Host */}
            <div className="mb-6">
              <span className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Survey Answers & Point Values:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {currentRound.question.answers.map((ans, idx) => (
                  <div
                    key={ans.id}
                    className="bg-[#0b2256] border border-blue-800 rounded-lg p-2 flex items-center justify-between text-xs"
                  >
                    <span className="truncate pr-1">
                      <span className="font-bold text-feud-gold mr-1">{idx + 1}.</span>
                      {ans.text}
                    </span>
                    <span className="font-bold font-mono text-feud-gold">{ans.points}</span>
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
            <div className="bg-[#071638] border-2 border-blue-800 rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-feud-gold text-xs font-bold uppercase tracking-wider block">
                  Question Prompt (Round {currentRound.roundIndex + 1}):
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white truncate">
                  "{currentRound.question.prompt}"
                </h2>
              </div>

              {/* Active Control Team Badge */}
              <div className="bg-black/60 border border-blue-700 rounded-xl px-4 py-2 text-right shrink-0">
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Controlling Team:</span>
                <span className="font-display font-black text-lg text-blue-300">
                  {currentRound.controlTeamId === session.team1.id ? session.team1.name : session.team2.name}
                </span>
              </div>
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
                      <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center font-bold text-xs text-feud-gold font-mono shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white truncate">{ans.text}</div>
                        {ans.acceptedVariants && ans.acceptedVariants.length > 0 && (
                          <div className="text-[10px] text-gray-400 truncate">
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
                        <span className="text-green-400 font-bold text-xs px-2.5 py-1 bg-green-950/80 border border-green-700/60 rounded">
                          Revealed
                        </span>
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

        {/* PHASE 5: FAST MONEY HOST CONTROLS */}
        {session.phase === GamePhase.FAST_MONEY && session.fastMoney && (
          <div className="bg-[#071638] border-2 border-feud-gold rounded-2xl p-5 shadow-stage flex flex-col gap-4">
            {/* Fast Money Header */}
            <div className="flex items-center justify-between border-b border-blue-900 pb-3">
              <div>
                <span className="text-feud-gold font-bold text-xs uppercase tracking-widest block">
                  FAST MONEY CONTROL CONSOLE
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  Target Score: {session.fastMoney.targetScore} points · Current Total: {session.fastMoney.totalScore}
                </h2>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 bg-black/50 border border-blue-800 rounded-xl px-4 py-2">
                <Clock className="w-4 h-4 text-feud-gold" />
                <span className="font-mono font-black text-2xl text-white">
                  {fastMoneyTimer.remaining}s
                </span>
                {fastMoneyTimer.running ? (
                  <button
                    onClick={pauseFastMoneyTimer}
                    className="p-1.5 bg-amber-600 hover:bg-amber-500 rounded text-white"
                    title="Pause Timer"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startFastMoneyTimer(fastMoneyTimer.remaining || 20)}
                    className="p-1.5 bg-green-600 hover:bg-green-500 rounded text-white"
                    title="Start Timer"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => resetFastMoneyTimer(fastMoneyActivePlayer === 1 ? 20 : 25)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300 font-bold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Active Player Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFastMoneyActivePlayer(1)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                  fastMoneyActivePlayer === 1
                    ? 'bg-blue-600 border-white text-white shadow-md'
                    : 'bg-blue-950/60 border-blue-900 text-blue-300'
                }`}
              >
                Player 1 ({session.fastMoney.player1.totalScore} pts)
              </button>
              <button
                onClick={() => setFastMoneyActivePlayer(2)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                  fastMoneyActivePlayer === 2
                    ? 'bg-blue-600 border-white text-white shadow-md'
                    : 'bg-blue-950/60 border-blue-900 text-blue-300'
                }`}
              >
                Player 2 ({session.fastMoney.player2.totalScore} pts)
              </button>
            </div>

            {/* 5 Questions Entry Table */}
            <div className="flex flex-col gap-3">
              {session.fastMoney.questions.map((q, qIdx) => {
                const playerKey = fastMoneyActivePlayer === 1 ? 'player1' : 'player2';
                const ansRecord = session.fastMoney![playerKey].answers[qIdx];
                const isAnsRevealed = session.fastMoney![playerKey].revealedAnswerIndices.includes(qIdx);
                const isPtsRevealed = session.fastMoney![playerKey].revealedPointsIndices.includes(qIdx);

                return (
                  <div
                    key={q.id}
                    className="bg-[#0b1e4a] border border-blue-800/80 rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                  >
                    {/* Prompt */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-300 mb-1">
                        <span className="text-feud-gold mr-1">{qIdx + 1}.</span>
                        {q.prompt}
                      </div>

                      {/* Dropdown / match suggestions from survey */}
                      <div className="flex items-center gap-2">
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
                          placeholder="Type contestant answer..."
                          className="bg-black/60 border border-blue-600/50 rounded-lg px-2.5 py-1 text-white text-xs w-48 focus:outline-none"
                        />

                        {/* Survey answers quick dropdown */}
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
                    <div className="flex items-center gap-3">
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
                        className={`text-xs px-2.5 py-1 rounded font-bold border ${
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
                        className={`text-xs px-2.5 py-1 rounded font-bold border ${
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
            <div className="flex justify-end pt-2 border-t border-blue-900">
              <button
                onClick={resolveFastMoney}
                className="bg-green-600 hover:bg-green-500 text-white font-black text-sm px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                Conclude Fast Money & Declare Winner
                <ArrowRight className="w-4 h-4" />
              </button>
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
