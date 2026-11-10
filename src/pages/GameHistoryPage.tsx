import { useState, useEffect, useMemo } from 'react';
import { History, Trophy, Trash2, ArrowLeft, Calendar, Medal, Award, Flame, Star, Download } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HubNavbar } from '../components/common/HubNavbar';
import { listGameHistory, clearGameHistory } from '../db/hubDatabase';
import type { HubGameHistoryEntry } from '../types/hub';
import { GAMES_CATALOG } from '../games/registry';

interface AchievementBadge {
  id: string;
  gameId: string;
  title: string;
  desc: string;
  icon: string;
}

const BADGES: AchievementBadge[] = [
  { id: 'b_feud', gameId: 'family-feud', title: 'Feud Legend', desc: 'Won an official Family Feud match', icon: '⭐' },
  { id: 'b_trivia', gameId: 'family-trivia', title: 'Trivia Wizard', desc: 'Answered your way to Trivia victory', icon: '🧠' },
  { id: 'b_charades', gameId: 'charades', title: 'Acting Star', desc: 'Acted out champion charades clues', icon: '🎭' },
  { id: 'b_pictionary', gameId: 'pictionary', title: 'Master Painter', desc: 'Sketched the winning Pictionary masterpiece', icon: '🎨' },
  { id: 'b_bingo', gameId: 'family-bingo', title: 'Bingo Champion', desc: 'Achieved the winning BINGO pattern', icon: '🎯' },
  { id: 'b_word', gameId: 'guess-the-word', title: 'Word Sleuth', desc: 'Cracked the mystery word clues', icon: '🔍' },
];

export function GameHistoryPage() {
  const { navigate } = useRouter();
  const [history, setHistory] = useState<HubGameHistoryEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    listGameHistory().then(setHistory);
  }, []);

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all game match records?')) {
      await clearGameHistory();
      setHistory([]);
    }
  };

  const handleExportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `family_game_hub_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Hall of Fame & Statistics Computations
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalMatches: 0,
        topWinner: null as { name: string; wins: number } | null,
        favoriteGame: null as { title: string; count: number } | null,
        highestScore: 0,
        unlockedBadgeIds: new Set<string>(),
      };
    }

    const winnerCounts: Record<string, number> = {};
    const gameCounts: Record<string, { title: string; count: number }> = {};
    let highestScore = 0;
    const wonGames = new Set<string>();

    for (const entry of history) {
      if (entry.winnerName) {
        winnerCounts[entry.winnerName] = (winnerCounts[entry.winnerName] || 0) + 1;
        wonGames.add(entry.gameId);
      }
      if (entry.winnerScore > highestScore) {
        highestScore = entry.winnerScore;
      }
      if (!gameCounts[entry.gameId]) {
        gameCounts[entry.gameId] = { title: entry.gameTitle, count: 0 };
      }
      gameCounts[entry.gameId].count += 1;
    }

    let topWinnerName = '';
    let maxWins = 0;
    for (const [name, count] of Object.entries(winnerCounts)) {
      if (count > maxWins) {
        maxWins = count;
        topWinnerName = name;
      }
    }

    let favTitle = '';
    let maxPlays = 0;
    for (const item of Object.values(gameCounts)) {
      if (item.count > maxPlays) {
        maxPlays = item.count;
        favTitle = item.title;
      }
    }

    const unlockedBadgeIds = new Set<string>();
    for (const b of BADGES) {
      if (wonGames.has(b.gameId)) {
        unlockedBadgeIds.add(b.id);
      }
    }

    return {
      totalMatches: history.length,
      topWinner: topWinnerName ? { name: topWinnerName, wins: maxWins } : null,
      favoriteGame: favTitle ? { title: favTitle, count: maxPlays } : null,
      highestScore,
      unlockedBadgeIds,
    };
  }, [history]);

  const filteredHistory =
    selectedFilter === 'all'
      ? history
      : history.filter((h) => h.gameId === selectedFilter);

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col justify-between select-none">
      <HubNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
                <History className="w-6 h-6 text-blue-400" />
                Game History Ledger
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved match results, statistics, and party achievements from your living room.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">All Games ({history.length})</option>
              {GAMES_CATALOG.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportHistory}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  title="Export history as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>

                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-900/80 text-rose-300 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Ledger
                </button>
              </>
            )}
          </div>
        </div>

        {/* HALL OF FAME & STATISTICS DASHBOARD */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="p-4 rounded-2xl bg-[#091329] border border-blue-500/30 shadow-lg">
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Matches</span>
              <Medal className="w-4 h-4" />
            </div>
            <div className="text-2xl font-display font-black text-white">{stats.totalMatches}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total recorded rounds</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#170e28] border border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Top Champion</span>
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-lg font-display font-black text-white truncate">
              {stats.topWinner ? stats.topWinner.name : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.topWinner ? `${stats.topWinner.wins} match wins` : 'No wins yet'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#191105] border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Favorite Game</span>
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-lg font-display font-black text-white truncate">
              {stats.favoriteGame ? stats.favoriteGame.title : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {stats.favoriteGame ? `${stats.favoriteGame.count} plays` : 'Play to unlock'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#081a17] border border-emerald-500/30 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">High Score</span>
              <Star className="w-4 h-4" />
            </div>
            <div className="text-2xl font-display font-black text-white">
              {stats.highestScore > 0 ? `${stats.highestScore} pts` : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">All-time record</div>
          </div>
        </section>

        {/* PARTY ACHIEVEMENT BADGES */}
        <section className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-black text-base sm:text-lg text-white">
              Living Room Hall of Fame Badges
            </h2>
            <span className="text-[11px] font-bold text-amber-300/80 ml-auto">
              {stats.unlockedBadgeIds.size} / {BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BADGES.map((b) => {
              const isUnlocked = stats.unlockedBadgeIds.has(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isUnlocked
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
                  }`}
                  title={b.desc}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold truncate text-white">{b.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{b.desc}</div>
                  <div className="mt-2 text-[9px] font-bold uppercase tracking-wider">
                    {isUnlocked ? (
                      <span className="text-emerald-400">✓ Unlocked</span>
                    ) : (
                      <span className="text-slate-600">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recent Matches ({filteredHistory.length})
            </h3>
            {filteredHistory.map((item) => {
              const gameMeta = GAMES_CATALOG.find((g) => g.id === item.gameId);
              const dateStr = new Date(item.datePlayed).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${gameMeta?.accentColor || '#38bdf8'}20`,
                          color: gameMeta?.accentColor || '#38bdf8',
                        }}
                      >
                        {item.gameTitle}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm text-white">
                        Winner: {item.winnerName}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        ({item.winnerScore} pts)
                      </span>
                    </div>
                  </div>

                  {/* Participants table pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.participants.map((p) => (
                      <span
                        key={p.id}
                        className={`text-xs px-2.5 py-1 rounded-xl border ${
                          p.isWinner
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                            : 'bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        {p.name}: {p.score} pts
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 my-8">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-slate-300">No match records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Completed games will automatically appear here in your local history ledger.
            </p>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-slate-800/80 bg-[#040813] py-4 px-4 text-center text-xs text-slate-500">
        <span>Family Game Hub · Local Offline Storage</span>
      </footer>
    </div>
  );
}
