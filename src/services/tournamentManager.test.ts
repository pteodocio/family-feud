import { describe, it, expect, beforeEach } from 'vitest';
import {
  createNewTournament,
  getActiveTournament,
  recordTournamentRoundResult,
  clearActiveTournament,
} from './tournamentManager';

describe('Tournament Manager Service', () => {
  beforeEach(() => {
    clearActiveTournament();
  });

  it('creates and saves a new tournament session', () => {
    const session = createNewTournament(
      'Family Feud & Friends Cup',
      ['family-trivia', 'charades', 'family-feud'],
      ['Team Alpha', 'Team Bravo']
    );

    expect(session.title).toBe('Family Feud & Friends Cup');
    expect(session.rounds).toHaveLength(3);
    expect(session.currentRoundIndex).toBe(0);
    expect(session.standings).toHaveLength(2);
    expect(session.isFinished).toBe(false);

    const active = getActiveTournament();
    expect(active?.id).toBe(session.id);
  });

  it('records round results and accumulates leaderboard points', () => {
    createNewTournament(
      'Game Night Cup',
      ['family-trivia', 'charades'],
      ['Team Alpha', 'Team Bravo']
    );

    // Round 1: Team Alpha 1st (100 pts), Team Bravo 2nd (60 pts)
    const updated = recordTournamentRoundResult([
      { teamName: 'Team Alpha', matchScore: 80 },
      { teamName: 'Team Bravo', matchScore: 40 },
    ]);

    expect(updated).not.toBeNull();
    expect(updated?.currentRoundIndex).toBe(1);
    expect(updated?.rounds[0].isCompleted).toBe(true);
    expect(updated?.rounds[0].winnerTeamName).toBe('Team Alpha');

    const alphaStanding = updated?.standings.find((s) => s.teamName === 'Team Alpha');
    expect(alphaStanding?.totalScore).toBe(100);
    expect(alphaStanding?.gamesWon).toBe(1);

    const bravoStanding = updated?.standings.find((s) => s.teamName === 'Team Bravo');
    expect(bravoStanding?.totalScore).toBe(60);
    expect(bravoStanding?.gamesWon).toBe(0);
  });

  it('marks tournament finished when all rounds conclude', () => {
    createNewTournament(
      'One Round Blitz',
      ['charades'],
      ['Team Red', 'Team Blue']
    );

    const finished = recordTournamentRoundResult([
      { teamName: 'Team Red', matchScore: 3 },
      { teamName: 'Team Blue', matchScore: 1 },
    ]);

    expect(finished?.isFinished).toBe(true);
    expect(finished?.currentRoundIndex).toBe(1);
  });

  it('supports all 10 new team battle games in tournament playlists', () => {
    const battleGames = [
      'password',
      'catchphrase',
      'taboo',
      'jeopardy',
      'wheel-of-fortune',
      'bluff-the-answer',
      'heads-up',
      'word-hunt',
      'scattergories',
      'trivia-elimination',
    ] as any[];

    const session = createNewTournament('Super Championship', battleGames, ['Dragons', 'Tigers']);
    expect(session.rounds).toHaveLength(10);
    expect(session.rounds[0].gameName).toBe('Password');
    expect(session.rounds[3].gameName).toBe('Jeopardy!');
    expect(session.rounds[4].gameName).toBe('Wheel of Fortune');
  });
});
