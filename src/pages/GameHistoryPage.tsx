import { useState, useEffect } from 'react';
import { History, Trophy, Trash2, ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from '../router/Router';
import { HubNavbar } from '../components/common/HubNavbar';
import { listGameHistory, clearGameHistory } from '../db/hubDatabase';
import type { HubGameHistoryEntry } from '../types/hub';
import { GAMES_CATALOG } from '../games/registry';

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
                Saved match results from your family party game sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-900/80 text-rose-300 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Ledger
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
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
