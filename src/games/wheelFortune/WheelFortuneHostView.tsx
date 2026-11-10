import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
import { generateProceduralWheel, type WheelPuzzle } from '../../services/localGenerators/wheelGenerator';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';
import { WinnerPodiumModal } from '../../components/shared/WinnerPodiumModal';
import { hubSyncBus } from '../../sync/hubSync';
import { soundManager } from '../../audio/soundManager';

interface WheelFortuneHostViewProps {
  teams: ScoreboardParticipant[];
  onEndGame: (finalScores: ScoreboardParticipant[]) => void;
  onReturnToHub: () => void;
}

const WHEEL_WEDGES = [
  { label: '$100', value: 100, color: '#38bdf8' },
  { label: '$200', value: 200, color: '#fbbf24' },
  { label: '$300', value: 300, color: '#34d399' },
  { label: '$400', value: 400, color: '#a78bfa' },
  { label: '$500', value: 500, color: '#f43f5e' },
  { label: '$600', value: 600, color: '#fb923c' },
  { label: '$750', value: 750, color: '#2dd4bf' },
  { label: '$1000', value: 1000, color: '#ffd15c' },
  { label: 'BANKRUPT', value: 0, isBankrupt: true, color: '#000000' },
  { label: 'LOSE TURN', value: 0, isLoseTurn: true, color: '#ffffff' },
  { label: '$250', value: 250, color: '#60a5fa' },
  { label: '$350', value: 350, color: '#f472b6' },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

export function WheelFortuneHostView({ teams: initialTeams, onEndGame, onReturnToHub }: WheelFortuneHostViewProps) {
  const [teams, setTeams] = useState<ScoreboardParticipant[]>(
    initialTeams.length > 0
      ? initialTeams
      : [
          { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' },
          { id: 't2', name: 'Team Bravo', score: 0, color: 'red' },
        ]
  );

  const [puzzles, setPuzzles] = useState<WheelPuzzle[]>([]);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [roundBank, setRoundBank] = useState(0);
  const [currentWedge, setCurrentWedge] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  useEffect(() => {
    generateProceduralWheel({ count: 5 }).then((res) => {
      setPuzzles(res);
    });
  }, []);

  const currentPuzzle = puzzles[puzzleIdx] || {
    id: 'wof_default',
    phrase: 'PICTURE MUNA BAGO KUMAIN',
    category: 'Pinoy Habit',
  };

  // Broadcast to TV
  useEffect(() => {
    hubSyncBus.broadcastStateUpdate({
      gameId: 'wheel-of-fortune',
      phrase: currentPuzzle.phrase,
      category: currentPuzzle.category,
      guessedLetters,
      activeTeamName: teams[activeTeamIdx]?.name || 'Team 1',
      activeTeamColor: teams[activeTeamIdx]?.color || 'blue',
      roundBank,
      currentWedge,
      isSpinning,
      teams,
      isGameFinished,
    });
  }, [currentPuzzle, guessedLetters, activeTeamIdx, roundBank, currentWedge, isSpinning, teams, isGameFinished]);

  const handleSpinWheel = () => {
    setIsSpinning(true);
    soundManager.playPartyCue('tick');
    hubSyncBus.broadcastSoundTrigger('tick');

    setTimeout(() => {
      const wedge = WHEEL_WEDGES[Math.floor(Math.random() * WHEEL_WEDGES.length)];
      setCurrentWedge(wedge.label);
      setIsSpinning(false);

      if (wedge.isBankrupt) {
        soundManager.playPartyCue('strike');
        hubSyncBus.broadcastSoundTrigger('strike');
        setRoundBank(0);
        setActiveTeamIdx((prev) => (prev + 1) % teams.length);
      } else if (wedge.isLoseTurn) {
        soundManager.playPartyCue('wrong');
        hubSyncBus.broadcastSoundTrigger('wrong');
        setActiveTeamIdx((prev) => (prev + 1) % teams.length);
      } else {
        soundManager.playPartyCue('fanfare');
        hubSyncBus.broadcastSoundTrigger('fanfare');
      }
    }, 1800);
  };

  const handleGuessLetter = (letter: string) => {
    if (guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);

    const isVowel = VOWELS.includes(letter);
    if (isVowel) {
      // Vowel buying costs 250 points
      setRoundBank((prev) => Math.max(0, prev - 250));
    }

    const count = (currentPuzzle.phrase.toUpperCase().match(new RegExp(letter, 'g')) || []).length;

    if (count > 0) {
      soundManager.playPartyCue('correct');
      hubSyncBus.broadcastSoundTrigger('correct');

      if (!isVowel && currentWedge && currentWedge.startsWith('$')) {
        const value = parseInt(currentWedge.replace('$', ''), 10) || 200;
        setRoundBank((prev) => prev + value * count);
      }
    } else {
      soundManager.playPartyCue('wrong');
      hubSyncBus.broadcastSoundTrigger('wrong');
      setActiveTeamIdx((prev) => (prev + 1) % teams.length);
    }
  };

  const handleSolvePuzzle = () => {
    soundManager.playPartyCue('round_win');
    hubSyncBus.broadcastSoundTrigger('round_win');

    // Reveal all letters
    setGuessedLetters(ALPHABET);

    // Lock round bank into active team's score
    setTeams((prev) =>
      prev.map((t, idx) => (idx === activeTeamIdx ? { ...t, score: t.score + roundBank } : t))
    );
  };

  const handleNextPuzzle = () => {
    if (puzzleIdx >= puzzles.length - 1) {
      setIsGameFinished(true);
      onEndGame(teams);
      return;
    }
    setPuzzleIdx((prev) => prev + 1);
    setGuessedLetters([]);
    setRoundBank(0);
    setCurrentWedge(null);
    setActiveTeamIdx((prev) => (prev + 1) % teams.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <RotateCw className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white">Wheel of Fortune Console</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Puzzle {puzzleIdx + 1} of {puzzles.length || 5}</span>
              <span>•</span>
              <span className="text-emerald-400">{currentPuzzle.category}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-display font-black text-base flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Round Pot: ${roundBank}</span>
          </div>

          <button
            onClick={() => {
              setIsGameFinished(true);
              onEndGame(teams);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            End Game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Active Turn & Wheel Segment */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-400">Active Spinning Team:</span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {teams[activeTeamIdx]?.name}
                </span>
              </div>

              {currentWedge && (
                <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                  <span>Landed On:</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black">
                    {currentWedge}
                  </span>
                </div>
              )}
            </div>

            {/* Mystery Phrase Reveal for Host Eyes */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                Puzzle Solution (Host Eye)
              </span>
              <span className="font-display font-black text-xl sm:text-2xl text-white tracking-widest">
                {currentPuzzle.phrase}
              </span>
            </div>

            {/* Spin Wheel and Solve Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Spinning Wheel...' : 'Spin The Wheel!'}
              </button>

              <button
                onClick={handleSolvePuzzle}
                className="py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-black text-sm flex items-center gap-2 shadow transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Solve Verified!
              </button>
            </div>

            {/* Alphabet Keyboard for Calling Letters */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                Call a Letter (Vowels cost $250):
              </span>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {ALPHABET.map((letter) => {
                  const isUsed = guessedLetters.includes(letter);
                  const isVowel = VOWELS.includes(letter);
                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuessLetter(letter)}
                      disabled={isUsed}
                      className={`h-10 rounded-xl font-display font-black text-sm transition-all flex items-center justify-center border ${
                        isUsed
                          ? 'bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed'
                          : isVowel
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 hover:scale-105 active:scale-95'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNextPuzzle}
              className="py-2.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow transition-transform active:scale-95"
            >
              Next Puzzle →
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <SharedScoreboard
            participants={teams}
            onUpdateScore={(id, newScore) => {
              setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, score: newScore } : t)));
            }}
          />
        </div>
      </div>

      {isGameFinished && (
        <WinnerPodiumModal
          isOpen={isGameFinished}
          onClose={() => setIsGameFinished(false)}
          participants={teams}
          gameTitle="Wheel of Fortune Champions"
          onPlayAgain={() => {
            setIsGameFinished(false);
            setPuzzleIdx(0);
            setGuessedLetters([]);
            setRoundBank(0);
            setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
          }}
          onReturnToHub={onReturnToHub}
        />
      )}
    </div>
  );
}
