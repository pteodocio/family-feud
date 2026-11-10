import { Users, Clock, Play } from 'lucide-react';
import type { GameCatalogItem } from '../../types/hub';

interface GameCardProps {
  game: GameCatalogItem;
  onPlay: (gameId: string) => void;
  onViewRules?: (game: GameCatalogItem) => void;
}

export function GameCard({ game, onPlay, onViewRules }: GameCardProps) {
  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c1529]/90 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-950/40"
      style={{
        borderTopColor: game.accentColor,
        borderTopWidth: '3px',
      }}
    >
      <div>
        {/* Header Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${game.accentColor}20`,
              color: game.accentColor,
            }}
          >
            {game.category}
          </span>

          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Playable
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="font-display font-black text-xl sm:text-2xl text-slate-100 group-hover:text-white transition-colors">
          {game.name}
        </h3>
        <p className="text-xs text-blue-300/80 font-medium mt-1">
          {game.tagline}
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/80 flex flex-col gap-3">
        {/* Meta Stats Row */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {game.minPlayers}–{game.maxPlayers} players
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{game.estimatedMinutes}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onViewRules && (
            <button
              onClick={() => onViewRules(game)}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 transition-colors focus-visible:outline-2 focus-visible:outline-blue-400"
            >
              How to Play
            </button>
          )}

          <button
            onClick={() => onPlay(game.id)}
            className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-950 py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: game.accentColor,
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
