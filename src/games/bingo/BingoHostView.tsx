import { useState, useEffect, useMemo, useCallback } from 'react';
import { Play, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import {
  BINGO_PATTERNS,
  getBingoLetter,
  generateBingoCard,
  checkBingoWin,
  type BingoCard,
} from '../../data/hubData/bingoPatterns';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { SharedTimer } from '../../components/shared/SharedTimer';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';
import { recordContentUsage } from '../../services/contentHistory';
import type { ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface BingoHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

interface RichBingoCard extends BingoCard {
  labels?: string[][];
}

export function BingoHostView({ teams, onEndGame, onReturnToHub }: BingoHostViewProps) {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [calledLabels, setCalledLabels] = useState<string[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('line');
  const [playerCards, setPlayerCards] = useState<RichBingoCard[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [finalParticipants, setFinalParticipants] = useState<ScoreboardParticipant[]>(teams);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [autoCallRunning, setAutoCallRunning] = useState(false);

  const themedPool = useMemo(() => {
    const items = new Set<string>();
    for (const card of playerCards) {
      if (!card.labels) continue;
      for (let r = 0; r < card.labels.length; r++) {
        for (let c = 0; c < card.labels[r].length; c++) {
          if (r === 2 && c === 2) continue;
          const label = card.labels[r][c]?.trim();
          if (label && label !== 'FREE') items.add(label);
        }
      }
    }
    return Array.from(items);
  }, [playerCards]);
  const isThemedMode = themedPool.length > 0;

  // Initialize cards for participants (support dynamically generated classic OR themed cards)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('hub_custom_content_family-bingo');
      if (raw) {
        const customCards = JSON.parse(raw);
        if (Array.isArray(customCards) && customCards.length > 0) {
          const hasThemedCells = customCards.some((c: any) =>
            c.grid?.some((row: any[], r: number) =>
              row?.some(
                (cell: any, col: number) =>
                  !cell.isFree &&
                  !(r === 2 && col === 2) &&
                  !/^\d+$/.test(String(cell.text || '').trim())
              )
            )
          );

          const mappedCards: RichBingoCard[] = customCards.map((c: any, i: number) => {
            const labels = hasThemedCells
              ? c.grid.map((row: any[], r: number) =>
                  row.map((cell: any, col: number) =>
                    cell.isFree || (r === 2 && col === 2) ? 'FREE' : String(cell.text || '')
                  )
                )
              : undefined;
            const grid = c.grid.map((row: any[], r: number) =>
              row.map((cell: any, col: number) => {
                if (cell.isFree || (r === 2 && col === 2)) return 0;
                const parsed = parseInt(cell.text, 10);
                return Number.isNaN(parsed) ? col * 15 + (r + 1) : parsed;
              })
            );
            const marked = c.grid.map((row: any[], r: number) =>
              row.map((cell: any, col: number) => (cell.isFree || (r === 2 && col === 2) ? true : false))
            );
            return {
              id: c.id || `card_${i}`,
              playerName: c.playerName || (teams[i]?.name ? teams[i].name : `Player ${i + 1}`),
              grid,
              marked,
              labels,
            };
          });
          setPlayerCards(mappedCards);
          return;
        }
      }
    } catch {}

    const names = teams.length > 0 ? teams.map((t) => t.name) : ['Player 1', 'Player 2', 'Player 3'];
    const cards = names.map((name, i) => generateBingoCard(`card_${i}`, name));
    setPlayerCards(cards);
  }, [teams]);

  // Broadcast state to TV whenever state changes or sync is requested
  const broadcastCurrentState = useCallback(() => {
    hubSyncBus.broadcastState({
      gameId: 'family-bingo',
      calledNumbers,
      calledLabels,
      currentNumber,
      currentLabel,
      isThemedMode,
      themedTotal: themedPool.length,
      selectedPattern: BINGO_PATTERNS.find((p) => p.id === selectedPatternId),
      winnerName,
      isGameFinished,
    });
  }, [calledNumbers, calledLabels, currentNumber, currentLabel, isThemedMode, themedPool.length, selectedPatternId, winnerName, isGameFinished]);

  useEffect(() => {
    broadcastCurrentState();
  }, [broadcastCurrentState]);

  useEffect(() => {
    const unsub = hubSyncBus.onRequestSync(() => {
      broadcastCurrentState();
    });
    return () => unsub();
  }, [broadcastCurrentState]);

  const totalCallableCount = isThemedMode ? themedPool.length : 75;
  const currentCalledCount = isThemedMode ? calledLabels.length : calledNumbers.length;

  const handleCallNextNumber = () => {
    if (isGameFinished) return;

    if (isThemedMode) {
      const uncalled = themedPool.filter((label) => !calledLabels.includes(label));
      if (uncalled.length === 0) return;

      const nextLabel = uncalled[Math.floor(Math.random() * uncalled.length)];
      soundManager.playPartyCue('bingoRoll');
      hubSyncBus.broadcastSound('bingoRoll');

      setCurrentLabel(nextLabel);
      setCalledLabels((prev) => [...prev, nextLabel]);

      setPlayerCards((prev) =>
        prev.map((card) => {
          const newMarked = card.marked.map((row, r) =>
            row.map((val, c) =>
              card.labels?.[r]?.[c]?.toLowerCase() === nextLabel.toLowerCase() ? true : val
            )
          );
          return { ...card, marked: newMarked };
        })
      );
      return;
    }

    if (calledNumbers.length >= 75) return;

    // Pick uncalled number between 1 and 75
    const uncalled = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !calledNumbers.includes(n)
    );
    if (uncalled.length === 0) return;

    const next = uncalled[Math.floor(Math.random() * uncalled.length)];
    soundManager.playPartyCue('bingoRoll');
    hubSyncBus.broadcastSound('bingoRoll');

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

  const buildFinalParticipants = (winningPlayerName: string | null): ScoreboardParticipant[] => {
    if (teams.length > 0) {
      const matchedAny = teams.some(
        (t) => winningPlayerName && t.name.trim().toLowerCase() === winningPlayerName.trim().toLowerCase()
      );
      return teams.map((t, idx) => {
        const isCardWinner =
          Boolean(winningPlayerName) &&
          (matchedAny
            ? t.name.trim().toLowerCase() === winningPlayerName!.trim().toLowerCase()
            : playerCards[idx]?.playerName === winningPlayerName);
        return {
          ...t,
          score: isCardWinner ? t.score + 100 : t.score,
        };
      });
    }
    return [{ id: 'bingo_winner', name: winningPlayerName || 'Winner', score: 100, color: 'gold' }];
  };

  const handleVerifyCard = (card: RichBingoCard) => {
    const isWin = checkBingoWin(card, selectedPatternId);
    if (isWin) {
      soundManager.playPartyCue('bingoWin');
      hubSyncBus.broadcastSound('bingoWin');
      setAutoCallRunning(false);
      setWinnerName(card.playerName);
      const nextFinal = buildFinalParticipants(card.playerName);
      setFinalParticipants(nextFinal);
      setIsGameFinished(true);
      onEndGame(nextFinal);
      recordContentUsage({
        gameId: 'family-bingo',
        itemTitle: `Bingo Win - ${card.playerName}`,
        category: selectedPatternId,
      });
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
    setAutoCallRunning(false);
    setCalledNumbers([]);
    setCalledLabels([]);
    setCurrentNumber(null);
    setCurrentLabel(null);
    setWinnerName(null);
    setFinalParticipants(teams);
    setIsGameFinished(false);
    setPlayerCards((prev) =>
      prev.length > 0 && isThemedMode
        ? prev.map((card) => ({
            ...card,
            marked: card.marked.map((row, r) => row.map((_, c) => r === 2 && c === 2)),
          }))
        : (teams.length > 0 ? teams.map((t) => t.name) : ['Player 1', 'Player 2']).map((name, i) =>
            generateBingoCard(`card_${i}`, name)
          )
    );
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
            {isThemedMode
              ? `${calledLabels.length} / ${totalCallableCount} Items Called`
              : `${calledNumbers.length} / 75 Numbers Called`}
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

          <SharedTimer
            initialSeconds={10}
            resetKey={currentCalledCount}
            isRunning={autoCallRunning}
            onToggle={() => setAutoCallRunning((prev) => !prev)}
            onReset={() => setAutoCallRunning(false)}
            onExpire={() => {
              if (currentCalledCount < totalCallableCount && !isGameFinished) {
                handleCallNextNumber();
              } else {
                setAutoCallRunning(false);
              }
            }}
          />

          <button
            onClick={handleCallNextNumber}
            disabled={currentCalledCount >= totalCallableCount || isGameFinished}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {isThemedMode ? 'Call Next Item' : 'Call Next Ball'}
          </button>

          <button
            onClick={handleResetGame}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setAutoCallRunning(false);
              setIsGameFinished(true);
              onEndGame(finalParticipants);
            }}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
          >
            Finish Game
          </button>
        </div>
      </div>

      {/* Main Caller Spotlight & Master Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Col: Current Ball Caller Spotlight */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#140f04] border-2 border-amber-500/80 shadow-2xl text-center">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">
            {isThemedMode ? 'Last Called Item' : 'Last Called Ball'}
          </span>

          {isThemedMode ? (
            currentLabel ? (
              <div className="px-6 py-8 rounded-3xl bg-gradient-to-b from-amber-300 to-amber-500 border-4 border-amber-200 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/40 my-2 min-w-[200px]">
                <span className="text-xl sm:text-2xl font-display font-black uppercase leading-snug">
                  {currentLabel}
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center text-xs text-amber-400/60 font-bold my-2">
                Ready to Roll
              </div>
            )
          ) : currentNumber ? (
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

          <div className="text-xs text-slate-400 mt-2 font-medium">
            Winning Rule: {BINGO_PATTERNS.find((p) => p.id === selectedPatternId)?.description}
          </div>

          {/* Recent Reel */}
          {(!isThemedMode && calledNumbers.length > 1) || (isThemedMode && calledLabels.length > 1) ? (
            <div className="mt-3 pt-3 border-t border-amber-900/60 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block mb-1.5">
                {isThemedMode ? 'Recent Items:' : 'Recent Balls:'}
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {isThemedMode
                  ? calledLabels.slice(-5).reverse().map((lbl, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {lbl}
                      </span>
                    ))
                  : calledNumbers.slice(-5).reverse().map((n, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {getBingoLetter(n)}{n}
                      </span>
                    ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right 2 Cols: Master Board Grid */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-[#090e1f] border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {isThemedMode ? 'Themed Calling Board' : '75-Number Master Tracking Grid'}
          </h3>

          {isThemedMode ? (
            <div className="flex flex-wrap gap-1.5 flex-1 content-start">
              {themedPool.map((item) => {
                const isCalled = calledLabels.includes(item);
                const isLatest = currentLabel === item;
                return (
                  <div
                    key={item}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isLatest
                        ? 'bg-amber-400 text-slate-950 border-white font-black'
                        : isCalled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto pb-1 flex-1">
              <div className="grid grid-cols-15 gap-1 text-[11px] font-mono font-bold min-w-[520px]">
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
          )}
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
                      className={`min-h-12 p-1 rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-center border transition-all ${
                        isFree
                          ? 'bg-amber-500/30 text-amber-300 border-amber-500/80 font-black text-xs'
                          : isMarked
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md'
                          : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {isFree ? 'FREE' : currentCard.labels?.[r]?.[c] ?? val}
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
        participants={finalParticipants}
        onPlayAgain={handleResetGame}
        onReturnToHub={() => {
          onEndGame(finalParticipants);
          onReturnToHub();
        }}
      />
    </div>
  );
}
