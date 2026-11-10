import { useState, useEffect } from 'react';
import { Trophy, Play, CheckCircle2, X, Award } from 'lucide-react';
import {
  getActiveTournament,
  clearActiveTournament,
  createNewTournament,
  type TournamentSession,
} from '../../services/tournamentManager';
import { GAMES_CATALOG } from '../../games/registry';
import { triggerConfetti } from '../../utils/confetti';
import { soundManager } from '../../audio/soundManager';
import type { GameCatalogId } from '../../types/hub';

interface TournamentModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (gameId: string) => void;
}

export function TournamentModeModal({
  isOpen,
  onClose,
  onLaunchGame,
}: TournamentModeModalProps) {
  const [activeSession, setActiveSession] = useState<TournamentSession | null>(null);

  // New Tournament creation form states
  const [title, setTitle] = useState('Family Game Night Championship');
  const [selectedGames, setSelectedGames] = useState<GameCatalogId[]>([
    'family-trivia',
    'charades',
    'guess-the-word',
    'family-feud',
  ]);
  const [team1Name, setTeam1Name] = useState('Santos Family');
  const [team2Name, setTeam2Name] = useState('Reyes Family');

  useEffect(() => {
    if (isOpen) {
      const existing = getActiveTournament();
      setActiveSession(existing);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGames.length === 0) return;

    const session = createNewTournament(title, selectedGames, [
      team1Name || 'Team Blue',
      team2Name || 'Team Red',
    ]);
    setActiveSession(session);
    soundManager.playPartyCue('fanfare');
    triggerConfetti(2000);
  };

  const handleEndTournament = () => {
    if (confirm('Are you sure you want to conclude and clear this tournament session?')) {
      clearActiveTournament();
      setActiveSession(null);
    }
  };

  const handleLaunchCurrentRound = () => {
    if (!activeSession) return;
    const currentRound = activeSession.rounds[activeSession.currentRoundIndex];
    if (currentRound) {
      onClose();
      onLaunchGame(currentRound.gameId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1428] border-2 border-amber-400/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-display font-black text-xl text-white">
                Party Night Tournament Mode
              </h3>
              <p className="text-xs text-slate-400">
                Multi-game championship with cumulative running standings.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW 1: ACTIVE TOURNAMENT IN PROGRESS */}
        {activeSession ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Championship In Progress
                </span>
                <h4 className="font-display font-bold text-lg text-white">
                  {activeSession.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Next Up: <strong>{activeSession.rounds[activeSession.currentRoundIndex]?.gameName}</strong> (Round {activeSession.currentRoundIndex + 1} of {activeSession.rounds.length})
                </p>
              </div>

              <button
                onClick={handleLaunchCurrentRound}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-black text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Play Round →
              </button>
            </div>

            {/* Standings Leaderboard */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Cumulative Tournament Standings
              </h5>
              <div className="space-y-2">
                {activeSession.standings.map((team, idx) => (
                  <div
                    key={team.teamName}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-sm text-white">{team.teamName}</span>
                        <span className="text-[11px] text-slate-400 block">
                          {team.gamesWon} game{team.gamesWon === 1 ? '' : 's'} won
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-amber-400 text-base">
                      {team.totalScore} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rounds Playlist Timeline */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tournament Game Playlist
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSession.rounds.map((round, idx) => {
                  const isCurrent = idx === activeSession.currentRoundIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        isCurrent
                          ? 'bg-blue-950/70 border-blue-500 text-white font-bold'
                          : round.isCompleted
                          ? 'bg-slate-900/60 border-emerald-800/80 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-75">#{idx + 1}</span>
                        <span>{round.gameName}</span>
                      </div>
                      {round.isCompleted ? (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {round.winnerTeamName}
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] text-amber-400 uppercase font-black">
                          Active Round
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Upcoming</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between">
              <button
                onClick={handleEndTournament}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                End & Reset Tournament
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: CREATE NEW TOURNAMENT */
          <form onSubmit={handleStartTournament} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tournament Championship Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            {/* Competing Teams */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Team 1 Name
                </label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Team 2 Name
                </label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            {/* Games Playlist */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Select Games in Tournament Order ({selectedGames.length} selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {GAMES_CATALOG.map((g) => {
                  const isSelected = selectedGames.includes(g.id);
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => {
                        setSelectedGames((prev) =>
                          prev.includes(g.id)
                            ? prev.filter((id) => id !== g.id)
                            : [...prev, g.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/70 border-blue-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{g.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedGames.length === 0}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-display font-black text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all disabled:opacity-40"
              >
                <Trophy className="w-4 h-4" />
                Start Championship Tournament
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
