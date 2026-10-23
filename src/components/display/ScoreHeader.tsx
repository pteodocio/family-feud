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
      ? 'SINGLE VALUE'
      : currentRound.multiplier === 2
      ? 'DOUBLE VALUE (2X)'
      : currentRound.multiplier === 3
      ? 'TRIPLE VALUE (3X)'
      : `${currentRound.multiplier}X VALUE`;

  return (
    <div className="w-full flex items-center justify-between gap-3 sm:gap-6 px-2 sm:px-6 py-2 select-none">
      {/* TEAM 1 SCORE POD */}
      <div
        className={`flex-1 max-w-[280px] sm:max-w-[340px] rounded-2xl p-3 sm:p-4 transition-all duration-300 border-3 ${
          isTeam1Active
            ? 'bg-gradient-to-b from-[#193d8e] to-[#0a1840] border-[#60a5fa] shadow-blue-glow'
            : 'bg-gradient-to-b from-[#0b1c44] to-[#040b1e] border-blue-900/80 opacity-95'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <span className="text-blue-300 text-[11px] sm:text-xs font-bold tracking-widest uppercase block mb-0.5">
              TEAM 1
            </span>
            <h2 className="text-white font-display font-extrabold text-lg sm:text-2xl md:text-3xl truncate leading-tight">
              {team1.name}
            </h2>
          </div>
          <div className="bg-[#03091a] border-2 border-blue-500/60 rounded-xl px-3 sm:px-4 py-1 sm:py-2 text-right min-w-[68px] sm:min-w-[84px] shadow-inner">
            <span className="text-white led-score text-3xl sm:text-4xl md:text-5xl leading-none text-glow-blue block text-center">
              {team1.score}
            </span>
          </div>
        </div>

        {/* Team 1 Strikes indicator if active */}
        {isTeam1Active && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-blue-500/30 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`font-display font-black text-xl leading-none ${
                  i < currentRound.strikes
                    ? 'text-red-500 text-glow-red animate-pulse'
                    : 'text-gray-700'
                }`}
              >
                X
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CENTER BANK MARQUEE (Classic Oval/Arched Family Feud Bank) */}
      <div className="flex flex-col items-center justify-center shrink-0">
        {/* Round Multiplier Badge */}
        <div className="bg-[#040e28] border border-feud-gold/70 rounded-full px-3.5 py-0.5 mb-1.5 shadow-md">
          <span className="text-feud-gold font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase">
            ROUND {currentRound.roundIndex + 1} · {multiplierLabel}
          </span>
        </div>

        {/* Bank Total Box */}
        <div className="bg-gradient-to-b from-[#1f1702] via-[#332603] to-[#120d01] border-3 border-feud-gold rounded-2xl px-6 sm:px-10 py-1.5 sm:py-2.5 shadow-gold-glow flex flex-col items-center min-w-[150px] sm:min-w-[190px]">
          <span className="text-feud-goldLight text-[10px] sm:text-[11px] font-black uppercase tracking-widest block mb-0.5">
            {phase === 'steal' ? 'STEAL BANK' : 'CURRENT BANK'}
          </span>
          <span className="led-score text-feud-gold text-4xl sm:text-5xl md:text-6xl leading-none text-glow-gold tracking-tight">
            {currentRound.roundBank}
          </span>
        </div>
      </div>

      {/* TEAM 2 SCORE POD */}
      <div
        className={`flex-1 max-w-[280px] sm:max-w-[340px] rounded-2xl p-3 sm:p-4 transition-all duration-300 border-3 ${
          isTeam2Active
            ? 'bg-gradient-to-b from-[#8f1d1d] to-[#3a0808] border-[#f87171] shadow-[0_0_30px_rgba(239,68,68,0.7)]'
            : 'bg-gradient-to-b from-[#330c0c] to-[#0f0303] border-red-900/80 opacity-95'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <span className="text-red-300 text-[11px] sm:text-xs font-bold tracking-widest uppercase block mb-0.5">
              TEAM 2
            </span>
            <h2 className="text-white font-display font-extrabold text-lg sm:text-2xl md:text-3xl truncate leading-tight">
              {team2.name}
            </h2>
          </div>
          <div className="bg-[#140303] border-2 border-red-500/60 rounded-xl px-3 sm:px-4 py-1 sm:py-2 text-right min-w-[68px] sm:min-w-[84px] shadow-inner">
            <span className="text-white led-score text-3xl sm:text-4xl md:text-5xl leading-none text-glow-red block text-center">
              {team2.score}
            </span>
          </div>
        </div>

        {/* Team 2 Strikes indicator if active */}
        {isTeam2Active && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-red-500/30 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`font-display font-black text-xl leading-none ${
                  i < currentRound.strikes
                    ? 'text-red-500 text-glow-red animate-pulse'
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
