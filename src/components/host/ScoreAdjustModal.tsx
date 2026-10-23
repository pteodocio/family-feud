import { useState } from 'react';
import type { Team } from '../../types/game';

interface ScoreAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  team1: Team;
  team2: Team;
  onAdjust: (teamId: string, delta: number, reason: string) => void;
}

export function ScoreAdjustModal({
  isOpen,
  onClose,
  team1,
  team2,
  onAdjust,
}: ScoreAdjustModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState(team1.id);
  const [pointsDelta, setPointsDelta] = useState(10);
  const [reason, setReason] = useState('Host correction');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdjust(selectedTeamId, Number(pointsDelta), reason.trim() || 'Manual adjustment');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0b1c44] border-2 border-feud-gold rounded-2xl w-full max-w-md p-6 shadow-stage text-white">
        <h3 className="font-display font-black text-2xl text-feud-gold mb-4">
          Manual Score Adjustment
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Team */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
              Select Team
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTeamId(team1.id)}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-left ${
                  selectedTeamId === team1.id
                    ? 'bg-blue-600 border-white text-white'
                    : 'bg-blue-950/60 border-blue-900 text-blue-200'
                }`}
              >
                <div>{team1.name}</div>
                <div className="text-xs opacity-80">{team1.score} pts</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTeamId(team2.id)}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-left ${
                  selectedTeamId === team2.id
                    ? 'bg-red-600 border-white text-white'
                    : 'bg-red-950/60 border-red-900 text-red-200'
                }`}
              >
                <div>{team2.name}</div>
                <div className="text-xs opacity-80">{team2.score} pts</div>
              </button>
            </div>
          </div>

          {/* Points Delta */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
              Points Adjustment (+ or -)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={pointsDelta}
                onChange={(e) => setPointsDelta(Number(e.target.value))}
                className="flex-1 bg-black/60 border border-blue-500/50 rounded-xl px-4 py-2 text-white font-mono text-lg font-bold"
                placeholder="e.g. 25 or -10"
                required
              />
              <button
                type="button"
                onClick={() => setPointsDelta((prev) => -prev)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold"
              >
                +/- Toggle
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {[+5, +10, +25, +50, -10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPointsDelta(val)}
                  className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-700/50 rounded-lg text-xs font-mono font-bold text-blue-200"
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
              Reason / Note
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-black/60 border border-blue-500/50 rounded-xl px-4 py-2 text-white text-sm"
              placeholder="e.g. Bonus points, host correction, trivia challenge"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-blue-900/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-feud-gold hover:bg-feud-goldLight text-feud-dark rounded-xl font-bold text-sm shadow-gold-glow"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
