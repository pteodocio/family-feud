import { useEffect, useState } from 'react';
import { ArrowLeft, Printer, Trophy, RotateCcw } from 'lucide-react';
import { useRouter } from '../router/Router';
import { loadGameSession } from '../db/database';
import type { GameSession } from '../types/game';

interface GameResultsPageProps {
  gameId: string;
}

export function GameResultsPage({ gameId }: GameResultsPageProps) {
  const { navigate } = useRouter();
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    loadGameSession(gameId).then((loaded) => {
      if (loaded) setSession(loaded);
    });
  }, [gameId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-feud-dark text-white flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-feud-gold border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold text-feud-gold">Loading Game Summary...</h2>
      </div>
    );
  }

  const championTeam =
    session.team1.score >= session.team2.score ? session.team1 : session.team2;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background p-4 sm:p-8 select-none">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-4 print:hidden">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Main Menu
          </button>

          <button
            onClick={handlePrint}
            className="bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Game Summary
          </button>
        </div>

        {/* HERO VICTORY BANNER */}
        <div className="bg-[#071638] border-3 border-feud-gold rounded-3xl p-6 sm:p-10 shadow-gold-glow text-center flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-feud-gold/20 border-2 border-feud-gold flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-feud-gold animate-bounce" />
          </div>

          <span className="text-feud-gold font-bold text-xs uppercase tracking-widest mb-1">
            OFFICIAL GAME RESULTS
          </span>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white mb-2 text-glow-gold">
            {championTeam.name} WINS!
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm">
            {session.title} · Played on {new Date(session.createdAt).toLocaleDateString()}
          </p>

          {/* SCORES COMPARISON */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg mt-6 bg-black/40 border border-blue-900 rounded-2xl p-4">
            <div className="text-center border-r border-blue-900 pr-3">
              <span className="text-blue-300 text-xs font-bold block">{session.team1.name}</span>
              <span className="font-display font-black text-4xl sm:text-5xl text-white">
                {session.team1.score}
              </span>
              {championTeam.id === session.team1.id && (
                <span className="text-xs text-feud-gold font-bold block mt-1">★ Champion</span>
              )}
            </div>

            <div className="text-center pl-3">
              <span className="text-red-300 text-xs font-bold block">{session.team2.name}</span>
              <span className="font-display font-black text-4xl sm:text-5xl text-white">
                {session.team2.score}
              </span>
              {championTeam.id === session.team2.id && (
                <span className="text-xs text-feud-gold font-bold block mt-1">★ Champion</span>
              )}
            </div>
          </div>
        </div>

        {/* ROUND BY ROUND BREAKDOWN */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <h2 className="font-display font-black text-lg text-feud-gold">
            Round-by-Round Breakdown
          </h2>

          <div className="flex flex-col gap-2.5">
            {session.rounds.map((round, idx) => (
              <div
                key={round.roundIndex}
                className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">
                    Round {idx + 1} ({round.multiplier}x Multiplier)
                  </div>
                  <div className="text-gray-300 text-xs italic">"{round.question.prompt}"</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-feud-gold block text-sm">
                    {round.awardedToTeamId === session.team1.id
                      ? session.team1.name
                      : round.awardedToTeamId === session.team2.id
                      ? session.team2.name
                      : 'Unawarded'}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    +{round.awardedPoints} pts ({round.revealedAnswerIds.length}/{round.question.answers.length} revealed)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAST MONEY SUMMARY */}
        {session.fastMoney && (
          <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-lg text-feud-gold">
                Fast Money Summary
              </h2>
              <span className="text-xs font-bold text-feud-goldLight">
                Total Score: {session.fastMoney.totalScore} / {session.fastMoney.targetScore} pts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Player 1 */}
              <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-3">
                <span className="font-bold text-blue-300 block mb-2">
                  Player 1 Answers ({session.fastMoney.player1.totalScore} pts)
                </span>
                <ul className="space-y-1">
                  {session.fastMoney.player1.answers.map((a, i) => (
                    <li key={i} className="flex justify-between border-b border-blue-950 pb-1">
                      <span className="truncate pr-2">{a.submittedText || '—'}</span>
                      <span className="font-mono font-bold text-feud-gold">{a.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Player 2 */}
              <div className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-3">
                <span className="font-bold text-blue-300 block mb-2">
                  Player 2 Answers ({session.fastMoney.player2.totalScore} pts)
                </span>
                <ul className="space-y-1">
                  {session.fastMoney.player2.answers.map((a, i) => (
                    <li key={i} className="flex justify-between border-b border-blue-950 pb-1">
                      <span className="truncate pr-2">{a.submittedText || '—'}</span>
                      <span className="font-mono font-bold text-feud-gold">{a.points} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ACTION LOG & AUDIT TRAIL */}
        {session.actionLog && session.actionLog.length > 0 && (
          <div className="bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-2">
            <h2 className="font-display font-black text-sm text-gray-300 uppercase">
              Game Event Log
            </h2>
            <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] text-gray-400 bg-black/40 p-3 rounded-xl border border-blue-950">
              {session.actionLog.map((log, i) => (
                <div key={i}>• {log}</div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="flex justify-center gap-4 py-4 print:hidden">
          <button
            onClick={() => navigate('/setup')}
            className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-sm px-6 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Another Game
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm px-6 py-2.5 rounded-xl"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
