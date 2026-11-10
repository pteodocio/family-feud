import { Trophy, Plus, Minus } from 'lucide-react';

export interface ScoreboardParticipant {
  id: string;
  name: string;
  score: number;
  color?: 'blue' | 'red' | 'gold' | 'emerald' | 'purple' | 'amber';
}

interface SharedScoreboardProps {
  teams: ScoreboardParticipant[];
  activeTeamId?: string | null;
  onAdjustScore?: (id: string, delta: number) => void;
  showControls?: boolean;
  className?: string;
}

const COLOR_CLASSES: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue: {
    border: 'border-blue-500/60',
    bg: 'bg-blue-950/40',
    text: 'text-blue-400',
    badge: 'bg-blue-500 text-slate-950',
  },
  red: {
    border: 'border-rose-500/60',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    badge: 'bg-rose-500 text-slate-950',
  },
  gold: {
    border: 'border-amber-400/60',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    badge: 'bg-amber-400 text-slate-950',
  },
  emerald: {
    border: 'border-emerald-500/60',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500 text-slate-950',
  },
  purple: {
    border: 'border-purple-500/60',
    bg: 'bg-purple-950/40',
    text: 'text-purple-400',
    badge: 'bg-purple-500 text-slate-950',
  },
  amber: {
    border: 'border-orange-500/60',
    bg: 'bg-orange-950/40',
    text: 'text-orange-400',
    badge: 'bg-orange-500 text-slate-950',
  },
};

export function SharedScoreboard({
  teams,
  activeTeamId,
  onAdjustScore,
  showControls = false,
  className = '',
}: SharedScoreboardProps) {
  const maxScore = Math.max(...teams.map((t) => t.score), 0);

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 w-full ${className}`}>
      {teams.map((team) => {
        const c = COLOR_CLASSES[team.color || 'blue'] || COLOR_CLASSES.blue;
        const isActive = activeTeamId === team.id;
        const isLeader = team.score > 0 && team.score === maxScore;

        return (
          <div
            key={team.id}
            className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
              isActive
                ? `${c.border} ${c.bg} ring-2 ring-blue-400/80 shadow-lg shadow-blue-950/50 scale-[1.02]`
                : 'border-slate-800 bg-[#091224]/80 text-slate-200'
            }`}
          >
            {/* Top row: name & leader trophy */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-xs sm:text-sm truncate" title={team.name}>
                {team.name}
              </span>
              {isLeader && (
                <Trophy className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" title="Current Leader" />
              )}
            </div>

            {/* Score display */}
            <div className={`font-mono font-black text-2xl sm:text-4xl my-1 ${c.text}`}>
              {team.score}
            </div>

            {/* Score adjust controls (Host Console only) */}
            {showControls && onAdjustScore && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onAdjustScore(team.id, -10)}
                  className="flex-1 flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  title="Minus 10 points"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onAdjustScore(team.id, 10)}
                  className="flex-1 flex items-center justify-center p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  title="Add 10 points"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
