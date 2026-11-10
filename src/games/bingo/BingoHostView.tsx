import { useState, useEffect } from 'react';
import { Play, RotateCcw, Award, CheckCircle2, Trophy, Eye } from 'lucide-react';
import {
  BINGO_PATTERNS,
  getBingoLetter,
  generateBingoCard,
  checkBingoWin,
  type BingoCard,
} from '../../data/hubData/bingoPatterns';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';
import type { ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface BingoHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

export function BingoHostView({ teams, onEndGame, onReturnToHub }: BingoHostViewProps) {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('line');
  const [playerCards, setPlayerCards] = useState<BingoCard[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Initialize cards for participants
  useEffect(() => {
    const names = teams.length > 0 ? teams.map((t) => t.name) : ['Player 1', 'Player 2', 'Player 3'];
    const cards = names.map((name, i) => generateBingoCard(`card_${i}`, name));
    setPlayerCards(cards);
  }, [teams]);

  // Broadcast state to TV
  useEffect(() => {
    hubSyncBus.broadcastState({
      gameId: 'family-bingo',
      calledNumbers,
      currentNumber,
      selectedPattern: BINGO_PATTERNS.find((p) => p.id === selectedPatternId),
      winnerName,
      isGameFinished,
    });
  }, [calledNumbers, currentNumber, selectedPatternId, winnerName, isGameFinished]);

  const handleCallNextNumber = () => {
    if (calledNumbers.length >= 75) return;

    // Pick uncalled number between 1 and 75
    const uncalled = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !calledNumbers.includes(n)
    );
    if (uncalled.length === 0) return;

    const next = uncalled[Math.floor(Math.random() * uncalled.length)];
    soundManager.playPartyCue('bingoRoll');

    setCurrentNumber(next);
    setCalledNumbers((prev) => [...prev, next]);

    // Automatically check all player cards for matching number
    setPlayerCards((prev) =>
      prev.map((card) => {
        const newMarked = card.marked.map((row, r) =>
          row.map((val, c) => (card.grid[r][c] === next ? true : val))
        );
        return { ...card, marked: newMarked };
      })
    );
  };

  const handleVerifyCard = (card: BingoCard) => {
    const isWin = checkBingoWin(card, selectedPatternId);
    if (isWin) {
      soundManager.playPartyCue('bingoWin');
      setWinnerName(card.playerName);
      setIsGameFinished(true);
    } else {
      soundManager.playPartyCue('wrong');
      alert(`${card.playerName}'s card does not have the winning pattern yet!`);
    }
  };

  const handleToggleCell = (cardIndex: number, r: number, c: number) => {
    if (r === 2 && c === 2) return; // FREE square
    setPlayerCards((prev) =>
      prev.map((card, idx) => {
        if (idx !== cardIndex) return card;
        const newMarked = card.marked.map((row, rIdx) =>
          row.map((val, cIdx) => (rIdx === r && cIdx === c ? !val : val))
        );
        return { ...card, marked: newMarked };
      })
    );
  };

  const handleResetGame = () => {
    setCalledNumbers([]);
    setCurrentNumber(null);
    setWinnerName(null);
    setIsGameFinished(false);
    const names = teams.length > 0 ? teams.map((t) => t.name) : ['Player 1', 'Player 2'];
    setPlayerCards(names.map((name, i) => generateBingoCard(`card_${i}`, name)));
  };

  const currentCard = playerCards[activeCardIndex] || playerCards[0];

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-6xl mx-auto text-slate-100">
      {/* Top Header & Pattern Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Family Bingo Caller Console
          </span>
          <h2 className="text-lg font-bold text-white">
            {calledNumbers.length} / 75 Numbers Called
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-slate-400">Pattern:</label>
          <select
            value={selectedPatternId}
            onChange={(e) => setSelectedPatternId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            {BINGO_PATTERNS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCallNextNumber}
            disabled={calledNumbers.length >= 75}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            Call Next Ball
          </button>

          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Caller Spotlight & Master Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Col: Current Ball Caller Spotlight */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#140f04] border-2 border-amber-500/80 shadow-2xl text-center">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">
            Last Called Ball
          </span>

          {currentNumber ? (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-amber-200 flex flex-col items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/40 my-2 animate-in zoom-in duration-200">
              <span className="text-xl sm:text-2xl font-black leading-none">
                {getBingoLetter(currentNumber)}
              </span>
              <span className="text-4xl sm:text-6xl font-black font-mono leading-none">
                {currentNumber}
              </span>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center text-xs text-amber-400/60 font-bold my-2">
              Ready to Roll
            </div>
          )}

          <div className="text-xs text-slate-400 mt-3 font-medium">
            Winning Rule: {BINGO_PATTERNS.find((p) => p.id === selectedPatternId)?.description}
          </div>
        </div>

        {/* Right 2 Cols: 75 Master Board Grid */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-[#090e1f] border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            75-Number Master Tracking Grid
          </h3>

          <div className="grid grid-cols-15 gap-1 text-[11px] font-mono font-bold flex-1">
            {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => {
              const isCalled = calledNumbers.includes(n);
              const isLatest = currentNumber === n;

              return (
                <div
                  key={n}
                  className={`h-7 flex items-center justify-center rounded-md border transition-all ${
                    isLatest
                      ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-300 scale-110 font-black'
                      : isCalled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                      : 'bg-slate-950/60 text-slate-600 border-slate-800'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Player Cards Checker */}
      {currentCard && (
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Player Cards & Verification:
              </span>
              <div className="flex items-center gap-1">
                {playerCards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                      activeCardIndex === idx
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {card.playerName}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleVerifyCard(currentCard)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify "{currentCard.playerName}" for BINGO!
            </button>
          </div>

          {/* 5x5 Card Grid */}
          <div className="max-w-md mx-auto bg-slate-950 border-2 border-slate-800 rounded-2xl p-3 shadow-xl">
            {/* Column Letters */}
            <div className="grid grid-cols-5 text-center font-display font-black text-amber-400 text-lg mb-2">
              <span>B</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>O</span>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-5 gap-1.5">
              {currentCard.grid.map((row, r) =>
                row.map((val, c) => {
                  const isMarked = currentCard.marked[r][c];
                  const isFree = r === 2 && c === 2;

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleToggleCell(activeCardIndex, r, c)}
                      className={`h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base border transition-all ${
                        isFree
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/80 font-black text-xs'
                          : isMarked
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                          : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {isFree ? 'FREE' : val}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Winner Podium Modal */}
      <WinnerPodiumModal
        isOpen={isGameFinished}
        gameTitle="Family Bingo"
        participants={[{ id: 'bingo_winner', name: winnerName || 'Winner', score: 100 }]}
        onPlayAgain={handleResetGame}
        onReturnToHub={() => {
          onEndGame([{ id: 'bingo_winner', name: winnerName || 'Winner', score: 100 }]);
          onReturnToHub();
        }}
      />
    </div>
  );
}
