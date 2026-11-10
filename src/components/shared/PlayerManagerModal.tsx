import { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Users, Shield, Shuffle, Sparkles, Dices, RotateCcw } from 'lucide-react';
import type { HubPlayer, HubTeam } from '../../types/hub';
import {
  listHubPlayers,
  saveHubPlayer,
  deleteHubPlayer,
  listHubTeams,
  saveHubTeam,
  deleteHubTeam,
} from '../../db/hubDatabase';
import { soundManager } from '../../audio/soundManager';
import { fireConfetti } from '../../utils/confetti';

interface PlayerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const AVATAR_COLORS = [
  '#38bdf8', // Sky
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

export function PlayerManagerModal({ isOpen, onClose, onUpdated }: PlayerManagerModalProps) {
  const [players, setPlayers] = useState<HubPlayer[]>([]);
  const [teams, setTeams] = useState<HubTeam[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState(AVATAR_COLORS[0]);
  const [newPlayerTeamId, setNewPlayerTeamId] = useState<string>('');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamColor, setNewTeamColor] = useState<'blue' | 'red' | 'gold' | 'emerald' | 'purple' | 'amber'>('blue');

  // Random Player Picker State
  const [isPickingPlayer, setIsPickingPlayer] = useState(false);
  const [highlightedPlayer, setHighlightedPlayer] = useState<HubPlayer | null>(null);
  const [pickedWinner, setPickedWinner] = useState<HubPlayer | null>(null);
  const [balanceFeedback, setBalanceFeedback] = useState<string | null>(null);

  const loadData = async () => {
    const [pList, tList] = await Promise.all([listHubPlayers(), listHubTeams()]);
    setPlayers(pList);
    setTeams(tList);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setPickedWinner(null);
      setBalanceFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    const newP: HubPlayer = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: trimmed,
      avatarColor: newPlayerColor,
      teamId: newPlayerTeamId || null,
      createdAt: new Date().toISOString(),
    };

    await saveHubPlayer(newP);
    setNewPlayerName('');
    await loadData();
    onUpdated?.();
  };

  const handleDeletePlayer = async (id: string) => {
    await deleteHubPlayer(id);
    await loadData();
    onUpdated?.();
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTeamName.trim();
    if (!trimmed) return;

    const newT: HubTeam = {
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: trimmed,
      color: newTeamColor,
      score: 0,
      playerIds: [],
    };

    await saveHubTeam(newT);
    setNewTeamName('');
    await loadData();
    onUpdated?.();
  };

  const handleDeleteTeam = async (id: string) => {
    await deleteHubTeam(id);
    await loadData();
    onUpdated?.();
  };

  // Auto-Balance Teams: Evenly balances all players between teams
  const handleAutoBalance = async () => {
    if (players.length < 2) {
      setBalanceFeedback('Need at least 2 players to balance teams.');
      return;
    }

    let currentTeams = [...teams];
    // If fewer than 2 teams exist, create standard Team Blue and Team Red
    if (currentTeams.length < 2) {
      const defaultBlue: HubTeam = {
        id: `t_${Date.now()}_blue`,
        name: 'Team Blue',
        color: 'blue',
        score: 0,
        playerIds: [],
      };
      const defaultRed: HubTeam = {
        id: `t_${Date.now() + 1}_red`,
        name: 'Team Red',
        color: 'red',
        score: 0,
        playerIds: [],
      };
      await Promise.all([saveHubTeam(defaultBlue), saveHubTeam(defaultRed)]);
      currentTeams = [defaultBlue, defaultRed];
    }

    // Shuffle players randomly using Fisher-Yates
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    // Distribute round-robin among currentTeams
    for (let i = 0; i < shuffled.length; i++) {
      const assignedTeam = currentTeams[i % currentTeams.length];
      const updatedPlayer: HubPlayer = {
        ...shuffled[i],
        teamId: assignedTeam.id,
      };
      await saveHubPlayer(updatedPlayer);
    }

    soundManager.playPartyCue('correct');
    setBalanceFeedback(`Balanced ${players.length} players evenly across ${currentTeams.length} teams!`);
    await loadData();
    onUpdated?.();
    setTimeout(() => setBalanceFeedback(null), 4000);
  };

  // Who Goes First / Random Player Selector
  const handlePickRandomPlayer = () => {
    if (players.length === 0 || isPickingPlayer) return;

    setIsPickingPlayer(true);
    setPickedWinner(null);

    let count = 0;
    const maxSteps = 20;
    const intervalTime = 80;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * players.length);
      setHighlightedPlayer(players[randomIdx]);
      soundManager.playPartyCue('tick');
      count++;

      if (count >= maxSteps) {
        clearInterval(interval);
        const finalWinner = players[Math.floor(Math.random() * players.length)];
        setHighlightedPlayer(finalWinner);
        setPickedWinner(finalWinner);
        setIsPickingPlayer(false);
        soundManager.playPartyCue('fanfare');
        fireConfetti();
      }
    }, intervalTime);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b152d] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="font-display font-black text-xl text-white">
              Manage Players & Teams
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Party Utilities Bar: Auto Balance & Who Goes First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAutoBalance}
              disabled={players.length < 2}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              title="Evenly distribute all roster players across teams"
            >
              <Shuffle className="w-4 h-4 text-blue-400" />
              <span>Auto-Balance Teams ({players.length})</span>
            </button>

            <button
              onClick={handlePickRandomPlayer}
              disabled={players.length === 0 || isPickingPlayer}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              title="Randomly pick a player to go first"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span>{isPickingPlayer ? 'Selecting Player...' : 'Who Goes First? (Picker)'}</span>
            </button>
          </div>

          {/* Balance Feedback Notice */}
          {balanceFeedback && (
            <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/40 text-blue-300 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>{balanceFeedback}</span>
            </div>
          )}

          {/* Random Player Picker Result Box */}
          {(isPickingPlayer || pickedWinner) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/40 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="text-xs uppercase font-extrabold tracking-wider text-amber-400 mb-2 flex items-center justify-between">
                <span>{pickedWinner ? '🎉 Chosen Player to Go First:' : 'Selecting Player...'}</span>
                {pickedWinner && (
                  <button
                    onClick={handlePickRandomPlayer}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-roll
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-slate-950 text-sm shadow-md"
                  style={{
                    backgroundColor: (pickedWinner || highlightedPlayer)?.avatarColor || '#f59e0b',
                  }}
                >
                  {(pickedWinner || highlightedPlayer)?.name.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div className="text-base font-black text-white">
                    {(pickedWinner || highlightedPlayer)?.name || 'Selecting...'}
                  </div>
                  <div className="text-xs text-amber-200/80">
                    {teams.find((t) => t.id === (pickedWinner || highlightedPlayer)?.teamId)?.name || 'Individual Player'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Create Team Section */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              Configure Teams
            </h3>

            <form onSubmit={handleAddTeam} className="flex flex-wrap items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Team name (e.g. Team Blue)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="flex-1 min-w-[200px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />

              <select
                value={newTeamColor}
                onChange={(e) => setNewTeamColor(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="gold">Gold</option>
                <option value="emerald">Emerald</option>
                <option value="purple">Purple</option>
                <option value="amber">Amber</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add Team
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-200"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.color === 'gold' ? '#f59e0b' : t.color }}
                  />
                  <span className="font-bold">{t.name}</span>
                  <button
                    onClick={() => handleDeleteTeam(t.id)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                    title="Remove Team"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {teams.length === 0 && (
                <span className="text-xs text-slate-500 italic">No teams created yet. Auto-Balance will create default teams if needed.</span>
              )}
            </div>
          </div>

          {/* Quick Create Player Section */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-blue-400" />
              Add Players to Roster
            </h3>

            <form onSubmit={handleAddPlayer} className="flex flex-wrap items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Player name (e.g. Papa, Lola, Kuya)"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 min-w-[180px] bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />

              {/* Color pick */}
              <div className="flex items-center gap-1">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewPlayerColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newPlayerColor === c ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Team Assign */}
              <select
                value={newPlayerTeamId}
                onChange={(e) => setNewPlayerTeamId(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
              >
                <option value="">No Team (Individual)</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add Player
              </button>
            </form>

            {/* Players list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((p) => {
                const assignedTeam = teams.find((t) => t.id === p.teamId);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-slate-950"
                        style={{ backgroundColor: p.avatarColor }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {assignedTeam ? assignedTeam.name : 'Individual'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePlayer(p.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Player"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {players.length === 0 && (
                <div className="col-span-2 text-center py-4 text-xs text-slate-500 italic">
                  No players added yet. Add family members to get started!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
