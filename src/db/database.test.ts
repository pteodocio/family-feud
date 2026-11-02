import { describe, it, expect, beforeEach } from 'vitest';
import {
  db,
  initializeDatabase,
  saveGameSession,
  loadGameSession,
  listGameSessions,
  deleteGameSession,
  listQuestionPacks,
  saveQuestionPack,
  exportUserData,
  importUserData,
} from './database';
import { GamePhase } from '../types/game';
import type { GameSession, QuestionPack } from '../types/game';

describe('Dexie Database Persistence Tests', () => {
  beforeEach(async () => {
    await db.questionPacks.clear();
    await db.gameSessions.clear();
    await db.settings.clear();
  });

  it('initializes and seeds the Filipino question packs', async () => {
    await initializeDatabase();
    const packs = await listQuestionPacks();
    expect(packs.length).toBe(31);
    expect(packs.some((p) => p.title === 'Mga Linyahan ni Mama')).toBe(true);
    expect(packs.some((p) => p.title === 'Sino Nagubos Nito?')).toBe(true);
  });

  it('saves, loads, and deletes game sessions', async () => {
    const mockSession: GameSession = {
      id: 'session-persist-1',
      title: 'Persistence Test',
      config: {
        roundsCount: 4,
        multipliers: [1, 1, 2, 3],
        targetScore: 300,
        fastMoneyTimer1: 20,
        fastMoneyTimer2: 25,
        fastMoneyTarget: 200,
        faceOffTieRule: 'hostDecision',
      },
      team1: { id: 'team1', name: 'Santos', score: 100, color: 'blue' },
      team2: { id: 'team2', name: 'Reyes', score: 80, color: 'red' },
      phase: GamePhase.REGULAR,
      packId: 'pack-1',
      rounds: [],
      currentRoundIndex: 1,
      fastMoney: null,
      winnerTeamId: null,
      scoreAdjustments: [],
      actionLog: ['Game started'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveGameSession(mockSession);
    const loaded = await loadGameSession('session-persist-1');
    expect(loaded).toBeDefined();
    expect(loaded?.title).toBe('Persistence Test');
    expect(loaded?.team1.score).toBe(100);

    const all = await listGameSessions();
    expect(all.length).toBe(1);

    await deleteGameSession('session-persist-1');
    const afterDelete = await loadGameSession('session-persist-1');
    expect(afterDelete).toBeUndefined();
  });

  it('exports user data backup and imports it back safely', async () => {
    const customPack: QuestionPack = {
      id: 'custom-pack-99',
      title: 'Trivia Night 2026',
      description: 'Custom questions',
      category: 'Trivia',
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: [
        {
          id: 'q99_1',
          prompt: 'Name a planet in the solar system',
          category: 'Space',
          answers: [
            { id: 'a1', text: 'Mars', points: 40, acceptedVariants: [], displayOrder: 1 },
            { id: 'a2', text: 'Jupiter', points: 30, acceptedVariants: [], displayOrder: 2 },
          ],
        },
      ],
    };

    await saveQuestionPack(customPack);
    const backupJson = await exportUserData();
    expect(backupJson).toContain('Trivia Night 2026');

    // Clear db
    await db.questionPacks.clear();

    // Restore from backup JSON
    const restoreResult = await importUserData(backupJson);
    expect(restoreResult.success).toBe(true);
    expect(restoreResult.count).toBe(1);

    const restored = await db.questionPacks.get('custom-pack-99');
    expect(restored).toBeDefined();
    expect(restored?.title).toBe('Trivia Night 2026');
  });

  it('rejects corrupt or invalid JSON during import', async () => {
    const invalidJson = '{"not": "a valid backup payload"}';
    const res = await importUserData(invalidJson);
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});
