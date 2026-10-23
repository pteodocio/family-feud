import type { Team, RoundState } from '../../types/game';

interface ScoreHeaderProps {
  team1: Team;
  team2: Team;
  currentRound: RoundState;
  activeTeamId?: string | null;
  phase: string;
}

export function ScoreHeader({
  team1,
  team2,
  currentRound,
  activeTeamId,
  phase,
}: ScoreHeaderProps) {
  const isTeam1Active = activeTeamId === team1.id;
  const isTeam2Active = activeTeamId === team2.id;

  const multiplierLabel =
    currentRound.multiplier === 1
      ? 'SINGLE POINTS'
      : currentRound.multiplier === 2
      ? 'DOUBLE POINTS (2X)'
      : currentRound.multiplier === 3
      ? 'TRIPLE POINTS (3X)'
      : `${currentRound.multiplier}X POINTS`;

  return (
    <div className="w-full flex items-center justify-between gap-4 px-4 sm:px-8 py-3 select-none">
      {/* TEAM 1 SCORE POD */}
      <div
        className={`flex-1 max-w-[280px] sm:max-w-[340px] rounded-2xl p-3 sm:p-4 transition-all duration-300 border-3 ${
          isTeam1Active
            ? 'bg-gradient-to-b from-[#1e40af] to-[#0f172a] border-[#60a5fa] shadow-[0_0_30px_rgba(59,130,246,0.6)]'
            : 'bg-gradient-to-b from-[#0f1f42] to-[#050b1a] border-blue-900/60 opacity-90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-blue-300 text-xs sm:text-sm font-bold tracking-widest uppercase block">
              TEAM 1
            </span>
            <h2 className="text-white font-display font-black text-xl sm:text-2xl md:text-3xl truncate">
              {team1.name}
            </h2>
          </div>
          <div className="bg-black/60 border border-blue-500/40 rounded-xl px-3 sm:px-4 py-1 sm:py-2 text-right">
            <span className="text-white font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-glow-blue">
              {team1.score}
            </span>
          </div>
        </div>

        {/* Team 1 Strikes indicator if active */}
        {isTeam1Active && currentRound.strikes > 0 && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-blue-500/30">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`font-display font-black text-lg ${
                  i < currentRound.strikes
                    ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'text-gray-700'
                }`}
              >
                X
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CENTER BANK & ROUND INFO */}
      <div className="flex flex-col items-center justify-center">
        {/* Round & Multiplier Badge */}
        <div className="bg-feud-dark/80 border border-feud-gold/60 rounded-full px-4 py-1 mb-2 shadow-md">
          <span className="text-feud-gold font-bold text-xs sm:text-sm tracking-wider uppercase">
            ROUND {currentRound.roundIndex + 1} · {multiplierLabel}
          </span>
        </div>

        {/* Bank Total Marquee */}
        <div className="bg-gradient-to-b from-[#231b03] via-[#3a2d04] to-[#120e01] border-3 border-feud-gold rounded-2xl px-6 sm:px-10 py-2 sm:py-3 shadow-gold-glow flex flex-col items-center min-w-[160px] sm:min-w-[210px]">
          <span className="text-feud-goldLight text-[11px] sm:text-xs font-black uppercase tracking-widest">
            {phase === 'steal' ? 'STEAL BANK' : 'ROUND BANK'}
          </span>
          <span className="font-display font-black text-feud-gold text-4xl sm:text-5xl md:text-6xl leading-none text-glow-gold tracking-tight">
            {currentRound.roundBank}
          </span>
        </div>
      </div>

      {/* TEAM 2 SCORE POD */}
      <div
        className={`flex-1 max-w-[280px] sm:max-w-[340px] rounded-2xl p-3 sm:p-4 transition-all duration-300 border-3 ${
          isTeam2Active
            ? 'bg-gradient-to-b from-[#991b1b] to-[#1f0909] border-[#f87171] shadow-[0_0_30px_rgba(239,68,68,0.6)]'
            : 'bg-gradient-to-b from-[#3b1212] to-[#0f0404] border-red-900/60 opacity-90'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <span className="text-red-300 text-xs sm:text-sm font-bold tracking-widest uppercase block">
              TEAM 2
            </span>
            <h2 className="text-white font-display font-black text-xl sm:text-2xl md:text-3xl truncate">
              {team2.name}
            </h2>
          </div>
          <div className="bg-black/60 border border-red-500/40 rounded-xl px-3 sm:px-4 py-1 sm:py-2 text-right">
            <span className="text-white font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-glow-red">
              {team2.score}
            </span>
          </div>
        </div>

        {/* Team 2 Strikes indicator if active */}
        {isTeam2Active && currentRound.strikes > 0 && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-red-500/30">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`font-display font-black text-lg ${
                  i < currentRound.strikes
                    ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                    : 'text-gray-700'
                }`}
              >
                X
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
