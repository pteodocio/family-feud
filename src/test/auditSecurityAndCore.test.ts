import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { escapeHtml, safeDecodeUriComponent } from '../utils/sanitize';
import { resolveMatchOutcome } from '../utils/winnerResolution';
import {
  db,
  initializeDatabase,
  importUserData,
  loadSettings,
  DEFAULT_SETTINGS,
} from '../db/database';
import { createGameSession, submitFastMoneyAnswer } from '../engine/gameEngine';
import { generateAiTrivia } from '../services/aiGenerator';
import type { GameConfig, Question } from '../types/game';

const sampleQuestions: Question[] = [
  {
    id: 'fm_q1',
    prompt: 'Name a popular Filipino fruit',
    category: 'Food',
    answers: [
      { id: 'a1', text: 'Mango', points: 45, acceptedVariants: [], displayOrder: 1 },
      { id: 'a2', text: 'Banana', points: 30, acceptedVariants: [], displayOrder: 2 },
    ],
  },
];

const sampleConfig: GameConfig = {
  roundsCount: 1,
  multipliers: [1],
  targetScore: 300,
  fastMoneyTimer1: 20,
  fastMoneyTimer2: 25,
  fastMoneyTarget: 200,
  faceOffTieRule: 'hostDecision',
};

describe('Security, Data Integrity & Core Shared Helpers', () => {
  beforeEach(async () => {
    await db.questionPacks.clear();
    await db.settings.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTML Escaping & Safe URI Decoding', () => {
    it('escapes HTML special characters to prevent XSS in printable sheets', () => {
      const malicious = `<script>alert("xss")</script> & 'quoted'`;
      const safe = escapeHtml(malicious);
      expect(safe).not.toContain('<script>');
      expect(safe).toContain('&lt;script&gt;');
      expect(safe).toContain('&quot;xss&quot;');
      expect(safe).toContain('&#39;quoted&#39;');
      expect(safe).toContain('&amp;');
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('decodes valid URI segments and avoids throwing on malformed % sequences', () => {
      expect(safeDecodeUriComponent('Custom%20Pack%201')).toBe('Custom Pack 1');
      expect(() => safeDecodeUriComponent('%E0%A4%A')).not.toThrow();
      expect(safeDecodeUriComponent('100%')).toBe('100%');
    });
  });

  describe('Shared Winner & Tie Resolution', () => {
    it('identifies single clear winner cleanly', () => {
      const outcome = resolveMatchOutcome([
        { id: 't1', name: 'Blue Team', score: 120 },
        { id: 't2', name: 'Red Team', score: 80 },
      ]);
      expect(outcome.isTie).toBe(false);
      expect(outcome.winners).toHaveLength(1);
      expect(outcome.winners[0].name).toBe('Blue Team');
      expect(outcome.winnerLabel).toBe('Blue Team');
    });

    it('detects 2-way and 3-way ties instead of defaulting to team 1', () => {
      const twoWay = resolveMatchOutcome([
        { id: 't1', name: 'Santos', score: 150 },
        { id: 't2', name: 'Reyes', score: 150 },
      ]);
      expect(twoWay.isTie).toBe(true);
      expect(twoWay.winners.map((w) => w.name)).toEqual(['Santos', 'Reyes']);
      expect(twoWay.winnerLabel).toBe('Tie Game!');

      const threeWay = resolveMatchOutcome([
        { id: 't1', name: 'A', score: 50 },
        { id: 't2', name: 'B', score: 50 },
        { id: 't3', name: 'C', score: 50 },
      ]);
      expect(threeWay.isTie).toBe(true);
      expect(threeWay.winners).toHaveLength(3);
    });

    it('handles negative leading scores properly', () => {
      const neg = resolveMatchOutcome([
        { id: 't1', name: 'Team A', score: -200 },
        { id: 't2', name: 'Team B', score: -100 },
      ]);
      expect(neg.isTie).toBe(false);
      expect(neg.winners[0].name).toBe('Team B');
    });
  });

  describe('Database Backup Validation & Starter Pack Reset', () => {
    it('rejects packs that fail QuestionPackSchema validation during importUserData', async () => {
      const corruptBackup = JSON.stringify({
        version: 1,
        packs: [
          {
            id: 'bad-pack',
            title: 'Corrupt',
            questions: [{ id: 'q1', prompt: 'Too short?', answers: [] }], // invalid: min 2 answers
          },
        ],
      });

      const result = await importUserData(corruptBackup);
      expect(result.success).toBe(false);
      expect(result.count).toBe(0);
      const saved = await db.questionPacks.get('bad-pack');
      expect(saved).toBeUndefined();
    });

    it('sanitizes imported settings fields and clamps invalid numbers', async () => {
      const backupWithBadSettings = JSON.stringify({
        version: 1,
        packs: [],
        settings: {
          masterVolume: 999,
          defaultTimer1: -50,
          injectedMaliciousField: '<script>evil()</script>',
        },
      });

      const result = await importUserData(backupWithBadSettings);
      expect(result.success).toBe(true);

      const loaded = await loadSettings();
      expect(loaded.masterVolume).toBeLessThanOrEqual(1);
      expect(loaded.masterVolume).toBeGreaterThanOrEqual(0);
      expect(loaded.defaultConfig.fastMoneyTimer1).toBe(DEFAULT_SETTINGS.defaultConfig.fastMoneyTimer1);
      expect((loaded as unknown as Record<string, unknown>).injectedMaliciousField).toBeUndefined();
    });

    it('restores modified or missing built-in starter packs when forceResetBuiltIns is true', async () => {
      await initializeDatabase();
      const targetPack = await db.questionPacks.toCollection().first();
      expect(targetPack).toBeDefined();
      const originalTitle = targetPack!.title;

      // Tamper with a built-in pack title
      await db.questionPacks.put({ ...targetPack!, title: 'TAMPERED_TITLE' });
      expect((await db.questionPacks.get(targetPack!.id))?.title).toBe('TAMPERED_TITLE');

      // Explicit force reseed repairs it
      await initializeDatabase(true);
      expect((await db.questionPacks.get(targetPack!.id))?.title).toBe(originalTitle);
    });
  });

  describe('Fast Money NaN & Infinity Guards', () => {
    it('coerces NaN or Infinity points to 0 instead of corrupting totalScore', () => {
      const session = createGameSession({
        id: 'fm-nan-test',
        packId: 'test-pack',
        title: 'FM Guard',
        team1Name: 'A',
        team2Name: 'B',
        config: sampleConfig,
        regularQuestions: sampleQuestions,
        fastMoneyQuestions: [
          sampleQuestions[0],
          sampleQuestions[0],
          sampleQuestions[0],
          sampleQuestions[0],
          sampleQuestions[0],
        ],
      });

      const withNan = submitFastMoneyAnswer(session, 1, 0, 'Mango', Number.NaN, null, true);
      expect(Number.isFinite(withNan.fastMoney?.player1.totalScore)).toBe(true);
      expect(withNan.fastMoney?.player1.answers[0].points).toBe(0);
      expect(withNan.fastMoney?.totalScore).toBe(0);

      const withInf = submitFastMoneyAnswer(session, 1, 0, 'Mango', Number.POSITIVE_INFINITY, null, true);
      expect(Number.isFinite(withInf.fastMoney?.player1.totalScore)).toBe(true);
      expect(withInf.fastMoney?.player1.answers[0].points).toBe(0);
    });
  });

  describe('AI Generator Response Sanitization', () => {
    it('filters malformed empty prompt items and clamps out-of-range correctOptionIndex', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: JSON.stringify({
                        questions: [
                          { prompt: '', options: ['A', 'B'], correctOptionIndex: 0 },
                          {
                            prompt: 'Valid Question?',
                            options: ['Opt 1', 'Opt 2', 'Opt 3', 'Opt 4'],
                            correctOptionIndex: 99,
                            explanation: 'Explained',
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      );

      const res = await generateAiTrivia({
        count: 2,
        apiKey: 'AIzaTestKey+With/Special=',
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('AIzaTestKey+With/Special=')),
        expect.any(Object)
      );
      expect(res).toHaveLength(1);
      expect(res![0].prompt).toBe('Valid Question?');
      expect(res![0].correctOptionIndex).toBeLessThan(res![0].options.length);
      expect(res![0].correctOptionIndex).toBeGreaterThanOrEqual(0);
    });
  });
});
