import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
import {
  createNewTournament,
  recordTournamentRoundResult,
  recordActiveTournamentIfMatching,
  clearActiveTournament,
  getActiveTournament,
} from '../services/tournamentManager';
import { WinnerPodiumModal } from '../components/shared/WinnerPodiumModal';
import { TournamentModeModal } from '../components/shared/TournamentModeModal';
import { HubDisplayPage } from '../pages/HubDisplayPage';
import { hubSyncBus } from '../sync/hubSync';

describe('Shared Platform Systems & Modals Regression Tests', () => {
  beforeEach(() => {
    clearActiveTournament();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Tournament Manager: Ties, Idempotency & Auto-Progression', () => {
    it('awards co-winners properly on ties and prevents double-recording the same round', () => {
      createNewTournament('Tie & Idempotency Cup', ['family-trivia', 'charades'], ['Alpha', 'Beta']);

      // Round 1 is a 100-100 tie
      const afterTie = recordTournamentRoundResult([
        { teamName: 'Alpha', matchScore: 100 },
        { teamName: 'Beta', matchScore: 100 },
      ]);

      expect(afterTie?.rounds[0].isCompleted).toBe(true);
      expect(afterTie?.rounds[0].winnerTeamName).toBe('Tie Game!');
      expect(afterTie?.standings.find((s) => s.teamName === 'Alpha')?.totalScore).toBe(100);
      expect(afterTie?.standings.find((s) => s.teamName === 'Beta')?.totalScore).toBe(100);
      expect(afterTie?.standings.find((s) => s.teamName === 'Alpha')?.gamesWon).toBe(1);
      expect(afterTie?.standings.find((s) => s.teamName === 'Beta')?.gamesWon).toBe(1);

      // Re-recording Round 0 must be idempotent (no double points!)
      const reRecorded = recordTournamentRoundResult(
        [
          { teamName: 'Alpha', matchScore: 200 },
          { teamName: 'Beta', matchScore: 10 },
        ],
        0
      );
      expect(reRecorded?.standings.find((s) => s.teamName === 'Alpha')?.totalScore).toBe(100);
      expect(reRecorded?.currentRoundIndex).toBe(1);
    });

    it('recordActiveTournamentIfMatching progresses only matching current round gameId', () => {
      createNewTournament('Auto Cup', ['password', 'taboo'], ['Alpha', 'Beta']);

      // Non-matching game does nothing
      const skipped = recordActiveTournamentIfMatching('charades', [
        { name: 'Alpha', score: 90 },
        { name: 'Beta', score: 20 },
      ]);
      expect(skipped).toBeNull();
      expect(getActiveTournament()?.currentRoundIndex).toBe(0);

      // Matching game advances tournament
      const advanced = recordActiveTournamentIfMatching('password', [
        { name: 'Beta', score: 80 },
        { name: 'Alpha', score: 40 },
      ]);
      expect(advanced?.currentRoundIndex).toBe(1);
      expect(advanced?.rounds[0].winnerTeamName).toBe('Beta');
    });
  });

  describe('TournamentModeModal Finished State UI', () => {
    it('shows Championship Complete state instead of Play Round when tournament is finished', () => {
      createNewTournament('Final Cup', ['password'], ['Team Gold', 'Team Silver']);
      recordTournamentRoundResult([
        { teamName: 'Team Gold', matchScore: 50 },
        { teamName: 'Team Silver', matchScore: 10 },
      ]);

      render(
        <TournamentModeModal
          isOpen={true}
          onClose={() => {}}
          onLaunchGame={() => {}}
        />
      );

      expect(screen.getByText(/Championship Complete/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Play Round/i })).not.toBeInTheDocument();
    });
  });

  describe('WinnerPodiumModal Tie Handling', () => {
    it('renders Tie Game instead of falsely picking participant 1 when scores are tied', () => {
      render(
        <WinnerPodiumModal
          isOpen={true}
          gameTitle="Password"
          participants={[
            { id: 't1', name: 'Blue Squad', score: 40, color: 'blue' },
            { id: 't2', name: 'Red Squad', score: 40, color: 'red' },
          ]}
          onPlayAgain={() => {}}
          onReturnToHub={() => {}}
        />
      );

      expect(screen.getByText('Tie Game!')).toBeInTheDocument();
    });
  });

  describe('HubSyncBus Timer Clear', () => {
    it('clears cached timer state in memory and sessionStorage via clearTimerState()', () => {
      hubSyncBus.broadcastTimer(42, true);
      expect(hubSyncBus.getLastTimer()).toEqual({ remaining: 42, running: true });
      expect(sessionStorage.getItem('hub_last_timer')).not.toBeNull();

      hubSyncBus.clearTimerState();
      expect(hubSyncBus.getLastTimer()).toBeNull();
      expect(sessionStorage.getItem('hub_last_timer')).toBeNull();
    });
  });

  describe('HubDisplayPage Unknown Game Guard', () => {
    it('shows readable fallback message when navigated to an unknown gameId', () => {
      act(() => {
        render(<HubDisplayPage gameId="non-existent-game" />);
      });
      expect(screen.getByText(/TV Game Not Found/i)).toBeInTheDocument();
    });
  });
});
