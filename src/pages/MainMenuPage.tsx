import { useEffect, useState } from 'react';
import { Play, FolderKanban, Settings, RotateCcw, Volume2, Tv, Trash2 } from 'lucide-react';
import { useRouter } from '../router/Router';
import { listGameSessions, deleteGameSession } from '../db/database';
import type { GameSession } from '../types/game';
import { soundManager } from '../audio/soundManager';

export function MainMenuPage() {
  const { navigate, openDisplayWindow } = useRouter();
  const [recentGames, setRecentGames] = useState<GameSession[]>([]);
  const [isAudioActive, setIsAudioActive] = useState(false);

  useEffect(() => {
    listGameSessions().then((games) => {
      setRecentGames(games.slice(0, 5));
    });
  }, []);

  const handleTestAudio = () => {
    soundManager.init();
    soundManager.play('intro');
    setIsAudioActive(true);
  };

  const handleDeleteGame = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this saved game session?')) {
      await deleteGameSession(id);
      setRecentGames((prev) => prev.filter((g) => g.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* TOP STATUS BAR */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local Offline Ready</span>
        </div>

        <button
          onClick={handleTestAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            isAudioActive
              ? 'bg-blue-900/60 border-blue-500 text-blue-300'
              : 'bg-feud-gold/20 border-feud-gold/60 text-feud-gold hover:bg-feud-gold/30'
          }`}
          title="Initialize Web Audio"
        >
          <Volume2 className="w-3.5 h-3.5" />
          {isAudioActive ? 'Sound Initialized' : 'Test Game Sound'}
        </button>
      </div>

      {/* HERO SECTION / TITLE BANNER */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-8">
        <div className="relative mb-6">
          {/* Studio spotlight glow */}
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-600/30 via-feud-gold/30 to-blue-600/30 blur-3xl opacity-70 -z-10" />

          {/* Golden Game Show Marquee Frame */}
          <div className="bg-gradient-to-b from-[#0a1f4d] via-[#05112e] to-[#020714] border-4 border-feud-gold rounded-3xl p-6 sm:p-10 shadow-gold-glow max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,209,92,0.15),transparent)] pointer-events-none" />

            <span className="text-feud-gold text-xs sm:text-sm font-black uppercase tracking-[0.3em] block mb-2 drop-shadow">
              LIVE TV GAME SHOW AT HOME
            </span>

            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none drop-shadow-xl text-glow-gold">
              FAMILY FEUD
            </h1>

            <p className="text-blue-200 text-xs sm:text-sm font-semibold mt-3 max-w-md mx-auto opacity-90">
              Realistic dual-screen gameplay for family gatherings. Play the TV board on a projector or TV while controlling everything from your laptop!
            </p>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={() => navigate('/setup')}
            className="w-full sm:w-auto flex-1 bg-gradient-to-b from-[#ffd15c] via-[#f5b000] to-[#b88200] hover:brightness-110 text-feud-dark font-display font-black text-xl sm:text-2xl py-4 px-8 rounded-2xl shadow-gold-glow flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            START NEW GAME
          </button>

          <button
            onClick={() => navigate('/packs')}
            className="w-full sm:w-auto bg-[#071942] hover:bg-[#0c286b] text-white border-2 border-blue-500/60 font-bold text-sm sm:text-base py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <FolderKanban className="w-5 h-5 text-feud-gold" />
            Question Packs
          </button>
        </div>

        {/* SECONDARY ACTION ROW */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <button
            onClick={() => navigate('/settings')}
            className="text-gray-300 hover:text-white flex items-center gap-1.5 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-xl border border-blue-900/60"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            Game Rules & Settings
          </button>
        </div>
      </div>

      {/* RECENT SAVED SESSIONS */}
      {recentGames.length > 0 && (
        <div className="max-w-3xl w-full mx-auto bg-[#071638]/90 border border-blue-900/80 rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-3 border-b border-blue-900/60 pb-2">
            <span className="text-xs font-bold uppercase text-feud-gold flex items-center gap-1.5 tracking-wider">
              <RotateCcw className="w-3.5 h-3.5" />
              Resume Saved Game Session
            </span>
            <span className="text-[11px] text-gray-400">
              Autosaved in your browser
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {recentGames.map((game) => (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                className="bg-[#0b2052] hover:bg-[#102d75] border border-blue-800 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-feud-gold transition-colors">
                    {game.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {game.team1.name} ({game.team1.score} pts) vs {game.team2.name} ({game.team2.score} pts) · Round {game.currentRoundIndex + 1}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDisplayWindow(game.id);
                    }}
                    className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700"
                    title="Open TV Board"
                  >
                    <Tv className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteGame(e, game.id)}
                    className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900"
                    title="Delete saved session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="text-xs bg-feud-gold text-feud-dark font-black px-3 py-1 rounded-lg">
                    Resume →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-xs py-2 border-t border-blue-950/80 max-w-6xl w-full mx-auto flex items-center justify-between">
        <span>Family Feud Game Show Edition</span>
        <span>Original Design · Royalty-Free Sound Synthesis</span>
      </footer>
    </div>
  );
}
