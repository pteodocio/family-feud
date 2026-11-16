import { Trophy } from 'lucide-react';
import type { ScoreboardParticipant } from './SharedScoreboard';
import { resolveMatchOutcome } from '../../utils/winnerResolution';

interface TvFinalResultsBannerProps {
  gameTitle: string;
  teams: ScoreboardParticipant[];
}

export function TvFinalResultsBanner({ gameTitle, teams }: TvFinalResultsBannerProps) {
  const outcome = resolveMatchOutcome(teams);
  const { sorted, topScore, winners, isTie } = outcome;

  return (
    <div className="min-h-[82vh] max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-6 shadow-2xl shadow-amber-500/25">
        <Trophy className="w-12 h-12" />
      </div>

      <span className="text-sm font-black uppercase tracking-[0.25em] text-amber-300 mb-2">
        {gameTitle} · Final Results
      </span>

      <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
        {sorted.length === 0
          ? 'Game Complete!'
          : isTie
          ? 'Tie Game!'
          : `${winners[0].name} WINS!`}
      </h1>

      {isTie && (
        <p className="text-lg font-bold text-amber-200 mt-2">
          Co-Champions: {winners.map((w) => w.name).join(' & ')}
        </p>
      )}

      {sorted.length > 0 && (
        <p className="text-2xl font-mono font-black text-amber-400 mt-3">{topScore} POINTS</p>
      )}

      <div className="w-full max-w-xl mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2 text-left">
        {sorted.map((team, idx) => {
          const isLeader = team.score === topScore;
          return (
            <div
              key={team.id}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${
                isLeader
                  ? 'bg-amber-950/40 border-amber-500/60 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 font-bold">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    isLeader ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isLeader ? 1 : idx + 1}
                </span>
                <span className="text-base">{team.name}</span>
              </div>
              <span className="font-mono font-black text-lg text-amber-400">{team.score} pts</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
