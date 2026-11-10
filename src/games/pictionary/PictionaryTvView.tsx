import { useState, useEffect, useRef } from 'react';
import { Trophy, Sparkles, Clock } from 'lucide-react';
import { hubSyncBus } from '../../sync/hubSync';
import { DrawingCanvas, type DrawingCanvasHandle } from '../../components/shared/DrawingCanvas';
import { SharedScoreboard, type ScoreboardParticipant } from '../../components/shared/SharedScoreboard';

interface PictionaryTvState {
  gameId: string;
  category: string;
  activeTeamName: string;
  revealedWord: string | null;
  teams: ScoreboardParticipant[];
  isGameFinished: boolean;
}

export function PictionaryTvView() {
  const [state, setState] = useState<PictionaryTvState | null>(() => {
    return hubSyncBus.getLastState('pictionary');
  });
  const [timerState, setTimerState] = useState<{ remaining: number; running: boolean }>(() => {
    return hubSyncBus.getLastTimer() || { remaining: 60, running: false };
  });
  const canvasRef = useRef<DrawingCanvasHandle | null>(null);

  useEffect(() => {
    const unsubState = hubSyncBus.onStateUpdate((incoming) => {
      if (incoming && incoming.gameId === 'pictionary') {
        setState(incoming);
      }
    });

    const unsubStroke = hubSyncBus.onCanvasStroke((stroke) => {
      canvasRef.current?.drawStroke(stroke);
    });

    const unsubHistory = hubSyncBus.onCanvasHistory((strokes) => {
      canvasRef.current?.drawStrokes(strokes);
    });

    const unsubClear = hubSyncBus.onCanvasClear(() => {
      canvasRef.current?.clear();
    });

    const unsubTimer = hubSyncBus.onTimerUpdate((timer) => {
      setTimerState(timer);
    });

    hubSyncBus.requestSync();

    return () => {
      unsubState();
      unsubStroke();
      unsubHistory();
      unsubClear();
      unsubTimer();
    };
  }, []);

  if (!state) {
    return (
      <div className="min-h-screen bg-[#051111] text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-4xl text-white">Pictionary</h1>
        <p className="text-sm text-slate-400 mt-2">Waiting for artist to start sketching...</p>
      </div>
    );
  }

  const { category, activeTeamName, revealedWord, teams, isGameFinished } = state;
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-[#050f16] text-white flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-3.5 py-1 rounded-full shadow-lg">
            Category: {category}
          </span>
        </div>

        {timerState.running && timerState.remaining > 0 ? (
          <div
            className={`flex items-center gap-2 px-5 py-1.5 rounded-full font-mono font-black text-base sm:text-xl border transition-all ${
              timerState.remaining <= 10
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-lg shadow-red-900/50'
                : 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
            }`}
          >
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{timerState.remaining}s</span>
          </div>
        ) : (
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest block">Drawing Now</span>
            <span className="text-base sm:text-lg font-black text-emerald-300">{activeTeamName}</span>
          </div>
        )}
      </div>

      {/* Main Mirrored Sketch Canvas Area OR Winner Podium */}
      {isGameFinished && winner ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full mx-auto my-6 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl shadow-amber-500/30 animate-pulse">
            <Trophy className="w-12 h-12" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400 block mb-2">
            Pictionary Champion
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-white tracking-tight drop-shadow-2xl">
            {winner.name} WINS!
          </h1>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-3">{winner.score} POINTS</p>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            Official Match Concluded
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto my-3 min-h-[420px]">
          {revealedWord ? (
            <div className="bg-gradient-to-b from-emerald-950/90 to-teal-950/90 border-4 border-emerald-400 rounded-3xl p-8 sm:p-14 shadow-2xl shadow-emerald-500/30 text-center animate-in zoom-in duration-300">
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-emerald-300 block mb-3">
                The Drawing Was:
              </span>
              <h1 className="font-display font-black text-4xl sm:text-7xl text-white tracking-tight drop-shadow-2xl">
                {revealedWord}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                Correct Guess!
              </div>
            </div>
          ) : (
            <div className="w-full h-full min-h-[420px]">
              <DrawingCanvas ref={canvasRef} isReadOnly={true} />
            </div>
          )}
        </div>
      )}

      {/* Scoreboard at bottom */}
      <div className="max-w-6xl w-full mx-auto pt-3 border-t border-slate-800">
        <SharedScoreboard teams={teams} />
      </div>
    </div>
  );
}
