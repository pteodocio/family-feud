import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  saveHubPlayer,
  listHubPlayers,
  deleteHubPlayer,
  saveHubTeam,
  listHubTeams,
  deleteHubTeam,
  recordGameHistory,
  listGameHistory,
  clearGameHistory,
} from './hubDatabase';
import { db } from './database';

describe('Hub Database (Dexie v2 Schema & Hub Operations)', () => {
  beforeEach(async () => {
    await db.players.clear();
    await db.teams.clear();
    await db.gameHistory.clear();
  });

  it('can create, list, and delete players', async () => {
    const player1 = {
      id: 'p_1',
      name: 'Maria Clara',
      avatarColor: '#38bdf8',
      createdAt: new Date().toISOString(),
    };

    await saveHubPlayer(player1);
    const players = await listHubPlayers();
    expect(players).toHaveLength(1);
    expect(players[0].name).toBe('Maria Clara');

    await deleteHubPlayer('p_1');
    const emptyPlayers = await listHubPlayers();
    expect(emptyPlayers).toHaveLength(0);
  });

  it('can create, list, and delete teams', async () => {
    const team1 = {
      id: 't_blue',
      name: 'Team Azul',
      color: 'blue' as const,
      score: 0,
      playerIds: ['p_1'],
    };

    await saveHubTeam(team1);
    const teams = await listHubTeams();
    expect(teams).toHaveLength(1);
    expect(teams[0].name).toBe('Team Azul');

    await deleteHubTeam('t_blue');
    const emptyTeams = await listHubTeams();
    expect(emptyTeams).toHaveLength(0);
  });

  it('can record, list, and clear game history entries', async () => {
    const historyEntry = {
      id: 'hist_1',
      gameId: 'family-trivia',
      gameTitle: 'Family Trivia',
      datePlayed: new Date().toISOString(),
      durationSeconds: 320,
      gameMode: 'team' as const,
      participants: [
        { id: 't_1', name: 'Team Azul', score: 120, isWinner: true },
        { id: 't_2', name: 'Team Pula', score: 90, isWinner: false },
      ],
      winnerName: 'Team Azul',
      winnerScore: 120,
    };

    await recordGameHistory(historyEntry);
    const history = await listGameHistory();
    expect(history).toHaveLength(1);
    expect(history[0].winnerName).toBe('Team Azul');

    await clearGameHistory();
    const emptyHistory = await listGameHistory();
    expect(emptyHistory).toHaveLength(0);
  });
});
