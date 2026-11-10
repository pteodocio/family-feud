import { useState, useEffect } from 'react';
import { ArrowLeft, Tv, Bell, Send, X } from 'lucide-react';
import { useRouter } from '../router/Router';
import { TriviaHostView } from '../games/trivia/TriviaHostView';
import { CharadesHostView } from '../games/charades/CharadesHostView';
import { PictionaryHostView } from '../games/pictionary/PictionaryHostView';
import { BingoHostView } from '../games/bingo/BingoHostView';
import { GuessWordHostView } from '../games/guessWord/GuessWordHostView';
import { recordGameHistory } from '../db/hubDatabase';
import { getGameById } from '../games/registry';
import { hubSyncBus } from '../sync/hubSync';
import type { ScoreboardParticipant } from '../components/shared/SharedScoreboard';

interface HubHostPageProps {
  gameId: string;
}

export function HubHostPage({ gameId }: HubHostPageProps) {
  const { navigate } = useRouter();
  const game = getGameById(gameId);
  const [participants, setParticipants] = useState<ScoreboardParticipant[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [isTvConnected, setIsTvConnected] = useState(false);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`hub_participants_${gameId}`);
    if (raw) {
      try {
        setParticipants(JSON.parse(raw));
      } catch {}
    }

    // TV Pulse listener to update connection status
    let timeout: any = null;
    const unsubPulse = hubSyncBus.onTvPulse((pulse) => {
      if (pulse.connected) {
        setIsTvConnected(true);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          setIsTvConnected(false);
        }, 10000);
      }
    });

    return () => {
      if (timeout) clearTimeout(timeout);
      unsubPulse();
    };
  }, [gameId]);

  const handleEndGame = async (finalScores: ScoreboardParticipant[]) => {
    const sorted = [...finalScores].sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    const duration = Math.round((Date.now() - startTime) / 1000);

    await recordGameHistory({
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      gameId,
      gameTitle: game?.name || gameId,
      datePlayed: new Date().toISOString(),
      durationSeconds: duration,
      gameMode: 'team',
      participants: sorted.map((p, idx) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        isWinner: idx === 0,
      })),
      winnerName: winner ? winner.name : 'Everyone',
      winnerScore: winner ? winner.score : 0,
    });
  };

  const handleOpenTv = () => {
    const url = `${window.location.origin}${window.location.pathname}#/display/hub/${gameId}`;
    window.open(url, `hub_tv_${gameId}`, 'width=1280,height=720');
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = announceText.trim();
    if (!trimmed) return;

    hubSyncBus.broadcastAnnouncement(trimmed, 7);
    setAnnounceText('');
    setIsAnnounceModalOpen(false);
    setNotificationMsg('Announcement broadcasted to TV display!');
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const PRESET_ANNOUNCEMENTS = [
    '🍕 Snack & Refreshment Break!',
    '🔥 Final Round — Winner Takes All!',
    '⏰ 2 Minutes Remaining!',
    '🎉 Double Points Round!',
  ];

  return (
    <div className="min-h-screen bg-[#060b18] text-white flex flex-col justify-between select-none">
      {/* Top Runner Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Game Hub
          </button>
          <span className="font-display font-black text-sm sm:text-base text-white">
            {game?.name || 'Party Game'} Host Console
          </span>

          {/* TV Connection Status Pill */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isTvConnected
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isTvConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            {isTvConnected ? 'TV Display Connected' : 'TV Offline'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Broadcast alert to TV */}
          <button
            onClick={() => setIsAnnounceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-colors"
            title="Broadcast announcement to TV screen"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Broadcast to TV</span>
          </button>

          <button
            onClick={handleOpenTv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-600/80 text-xs font-bold text-blue-200 transition-colors shadow"
            title="Open TV Audience Display"
          >
            <Tv className="w-4 h-4 text-blue-400" />
            <span>Mirror to TV</span>
          </button>
        </div>
      </header>

      {notificationMsg && (
        <div className="bg-emerald-900/80 border-b border-emerald-700 px-4 py-2 text-center text-xs font-bold text-emerald-200">
          {notificationMsg}
        </div>
      )}

      {/* Main Game Host Runner */}
      <main className="flex-1 py-4">
        {gameId === 'family-trivia' && (
          <TriviaHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'charades' && (
          <CharadesHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'pictionary' && (
          <PictionaryHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'family-bingo' && (
          <BingoHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
        {gameId === 'guess-the-word' && (
          <GuessWordHostView
            teams={participants}
            onEndGame={handleEndGame}
            onReturnToHub={() => navigate('/')}
          />
        )}
      </main>

      {/* Broadcast Live Announcement Modal */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1428] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-black text-lg text-white">Broadcast Announcement</h3>
              </div>
              <button
                onClick={() => setIsAnnounceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Display a live animated alert banner across the TV audience screen.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ANNOUNCEMENTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAnnounceText(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300"
                >
                  {preset}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendAnnouncement} className="space-y-4 pt-1">
              <input
                type="text"
                placeholder="Type your message here..."
                value={announceText}
                onChange={(e) => setAnnounceText(e.target.value)}
                maxLength={80}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnounceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!announceText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="w-full border-t border-slate-800/80 bg-[#040813] py-3 px-4 text-center text-xs text-slate-500">
        <span>Family Game Hub · Host Controls Active</span>
      </footer>
    </div>
  );
}
