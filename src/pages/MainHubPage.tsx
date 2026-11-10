import { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Tv, Users, ArrowDown, HelpCircle, X, RotateCcw, Trash2, Dices, Trophy } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HubNavbar } from '../components/common/HubNavbar';
import { GameCard } from '../components/shared/GameCard';
import { PlayerManagerModal } from '../components/shared/PlayerManagerModal';
import { RandomGameSpinnerModal } from '../components/shared/RandomGameSpinnerModal';
import { TournamentModeModal } from '../components/shared/TournamentModeModal';
import { GAMES_CATALOG } from '../games/registry';
import type { GameCatalogItem } from '../types/hub';
import { listGameSessions, deleteGameSession } from '../db/database';
import type { GameSession } from '../types/game';

export function MainHubPage() {
  const { navigate, openDisplayWindow } = useRouter();
  const [selectedRulesGame, setSelectedRulesGame] = useState<GameCatalogItem | null>(null);
  const [isPlayerManagerOpen, setIsPlayerManagerOpen] = useState(false);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [isTournamentOpen, setIsTournamentOpen] = useState(false);
  const [recentFeudGames, setRecentFeudGames] = useState<GameSession[]>([]);
  const libraryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listGameSessions().then((games) => {
      setRecentFeudGames(games.slice(0, 3));
    });
  }, []);

  const handlePlayGame = (gameId: string) => {
    if (gameId === 'family-feud') {
      navigate('/setup');
    } else {
      navigate(`/games/${gameId}/setup`);
    }
  };

  const handleScrollToGames = () => {
    libraryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteSavedFeud = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this saved game session?')) {
      await deleteGameSession(id);
      setRecentFeudGames((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col justify-between select-none">
      <HubNavbar
        onOpenPlayerManager={() => setIsPlayerManagerOpen(true)}
        onOpenHowToPlay={() => setSelectedRulesGame(GAMES_CATALOG[0])}
        onOpenSpinner={() => setIsSpinnerOpen(true)}
        onOpenTournament={() => setIsTournamentOpen(true)}
      />

      {/* HERO SECTION */}
      <header className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-amber-500/15 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/40 text-blue-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Living Room Entertainment System</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none drop-shadow-xl">
            Family Game Hub
          </h1>

          <p className="font-display text-lg sm:text-xl text-amber-300 font-bold mt-3">
            One Place. Endless Family Fun.
          </p>

          <p className="text-sm sm:text-base text-slate-300/90 mt-4 leading-relaxed max-w-xl mx-auto">
            Play party games with your family and friends. Control the game from your laptop while
            mirroring an interactive scoreboard on your TV or projector screen!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 mt-8 max-w-xl mx-auto">
            <button
              onClick={handleScrollToGames}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-display font-black text-sm sm:text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
            >
              Explore All Games
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => handlePlayGame('family-feud')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition-colors"
            >
              <Play className="w-4 h-4 text-amber-400 fill-current" />
              Quick Play Feud
            </button>

            <button
              onClick={() => setIsSpinnerOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-500/40 transition-all active:scale-95"
              title="Can't decide? Let the wheel pick!"
            >
              <Dices className="w-4 h-4 text-purple-300" />
              Surprise Wheel
            </button>

            <button
              onClick={() => setIsTournamentOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 transition-all active:scale-95"
              title="Start a multi-game tournament series"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Tournament Mode
            </button>
          </div>
        </div>

        {/* FEATURED GAME SPOTLIGHT BANNER */}
        <div className="mt-14 max-w-4xl mx-auto text-left">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e1f47] via-[#091533] to-[#040917] border-2 border-amber-400/60 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full inline-block mb-3">
                Featured Game Show
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Family Feud: Live TV Edition
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Experience the authentic television game show with 39 Filipino-themed question packs,
                buzzer strikes, steal rounds, and the full Fast Money round!
              </p>

              <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Tv className="w-4 h-4" /> Dual-Screen TV Mirror
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 4–16 Players
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => handlePlayGame('family-feud')}
                className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Family Feud
              </button>

              <button
                onClick={() => navigate('/packs')}
                className="w-full md:w-auto text-xs text-slate-400 hover:text-white py-2 text-center"
              >
                Browse 39 Question Packs →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* RESUME SAVED SESSIONS (IF ANY) */}
      {recentFeudGames.length > 0 && (
        <section className="max-w-4xl w-full mx-auto px-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Resume Saved Game
              </span>
              <span className="text-[11px] text-slate-500">Autosaved locally</span>
            </div>

            <div className="space-y-2">
              {recentFeudGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => navigate(`/game/${game.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors group"
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
                      {game.title}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      {game.team1.name} ({game.team1.score} pts) vs {game.team2.name} ({game.team2.score} pts) · Round {game.currentRoundIndex + 1}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDisplayWindow(game.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300"
                      title="Open TV Board"
                    >
                      <Tv className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleDeleteSavedFeud(e, game.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-lg">
                      Resume →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GAME LIBRARY SECTION */}
      <main ref={libraryRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Game Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select any game below to start playing with your family.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            6 Games Available
          </span>
        </div>

        {/* 6 Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES_CATALOG.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={handlePlayGame}
              onViewRules={setSelectedRulesGame}
            />
          ))}
        </div>
      </main>

      {/* HOW TO PLAY RULES MODAL */}
      {selectedRulesGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1428] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-black text-xl text-white">
                  {selectedRulesGame.name}: How to Play
                </h3>
              </div>
              <button
                onClick={() => setSelectedRulesGame(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3">
              {selectedRulesGame.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-bold text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  const id = selectedRulesGame.id;
                  setSelectedRulesGame(null);
                  handlePlayGame(id);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors"
              >
                Play This Game Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SURPRISE GAME SPINNER MODAL */}
      <RandomGameSpinnerModal
        isOpen={isSpinnerOpen}
        onClose={() => setIsSpinnerOpen(false)}
        onSelectGame={(gameId) => {
          setIsSpinnerOpen(false);
          handlePlayGame(gameId);
        }}
      />

      {/* TOURNAMENT MODE MODAL */}
      <TournamentModeModal
        isOpen={isTournamentOpen}
        onClose={() => setIsTournamentOpen(false)}
        onLaunchGame={(gameId) => {
          setIsTournamentOpen(false);
          handlePlayGame(gameId);
        }}
      />

      {/* PLAYER MANAGER MODAL */}
      <PlayerManagerModal
        isOpen={isPlayerManagerOpen}
        onClose={() => setIsPlayerManagerOpen(false)}
      />

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-[#040813] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Family Game Hub © {new Date().getFullYear()}</span>
          <span>Zero Accounts Required · Offline Browser Ready · Multi-Screen Synchronized</span>
        </div>
      </footer>
    </div>
  );
}
