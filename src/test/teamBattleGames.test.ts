import { describe, it, expect } from 'vitest';
import { getGameById } from '../games/registry';
import {
  generatePasswordContent,
  generateCatchphraseContent,
  generateTabooContent,
  generateJeopardyContent,
  generateWheelContent,
  generateBluffContent,
  generateHeadsUpContent,
  generateWordHuntContent,
  generateScattergoriesContent,
  generateEliminationContent,
} from '../services/contentEngine';
import {
  createNewTournament,
  recordTournamentRoundResult,
  clearActiveTournament,
  getActiveTournament,
} from '../services/tournamentManager';
import { hubSyncBus } from '../sync/hubSync';

describe('Team Battle Games - Comprehensive Integration Suite', () => {
  const battleGameIds = [
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
  ] as const;

  describe('1. Catalog Registration & Metadata Integrity', () => {
    it('registers all 10 battle games in GAMES_CATALOG', () => {
      battleGameIds.forEach((id) => {
        const game = getGameById(id);
        expect(game).toBeDefined();
        expect(game?.id).toBe(id);
        expect(game?.name).toBeTruthy();
        expect(game?.tagline).toBeTruthy();
        expect(game?.description).toBeTruthy();
        expect(game?.rules.length).toBeGreaterThanOrEqual(3);
        expect(game?.isAvailable).toBe(true);
        expect(game?.minPlayers).toBeGreaterThanOrEqual(2);
      });
    });

    it('assigns all 10 battle games to Team Battle Games or TV Game Show category', () => {
      battleGameIds.forEach((id) => {
        const game = getGameById(id);
        expect(['Team Battle Games', 'TV Game Show']).toContain(game?.category);
      });
    });

    it('retains the original 6 games intact without corruption', () => {
      const originalIds = [
        'family-feud',
        'family-trivia',
        'charades',
        'pictionary',
        'family-bingo',
        'guess-the-word',
      ];
      originalIds.forEach((id) => {
        const game = getGameById(id);
        expect(game).toBeDefined();
        expect(game?.isAvailable).toBe(true);
      });
    });
  });

  describe('2. Procedural Content Generators for All 10 Battle Games', () => {
    it('generates English and Filipino Password clues', async () => {
      const en = await generatePasswordContent({ count: 5, language: 'en' });
      const fil = await generatePasswordContent({ count: 5, language: 'fil' });
      expect(en.words.length).toBeGreaterThanOrEqual(1);
      expect(fil.words.length).toBeGreaterThanOrEqual(1);
      expect(en.words[0].word).toBeTruthy();
      expect(fil.words[0].word).toBeTruthy();
    });

    it('generates English and Filipino Catchphrase decks', async () => {
      const en = await generateCatchphraseContent({ count: 8, language: 'en' });
      const fil = await generateCatchphraseContent({ count: 8, language: 'fil' });
      expect(en.phrases.length).toBeGreaterThanOrEqual(1);
      expect(fil.phrases.length).toBeGreaterThanOrEqual(1);
      expect(en.phrases[0].phrase).toBeTruthy();
      expect(fil.phrases[0].phrase).toBeTruthy();
    });

    it('generates Taboo cards with 5 forbidden words each', async () => {
      const res = await generateTabooContent({ count: 6, language: 'fil' });
      expect(res.cards.length).toBeGreaterThanOrEqual(1);
      res.cards.forEach((c) => {
        expect(c.target).toBeTruthy();
        expect(c.tabooWords).toHaveLength(5);
      });
    });

    it('generates complete Jeopardy boards (5 categories x 5 clues = 25 clues)', async () => {
      const board = await generateJeopardyContent();
      expect(board.categories).toHaveLength(5);
      board.categories.forEach((cat) => {
        expect(cat.questions).toHaveLength(5);
        expect(cat.questions[0].value).toBe(100);
        expect(cat.questions[4].value).toBe(500);
      });
    });

    it('generates Wheel of Fortune puzzles with valid categories', async () => {
      const res = await generateWheelContent({ count: 4 });
      expect(res.puzzles.length).toBeGreaterThanOrEqual(1);
      res.puzzles.forEach((p) => {
        expect(p.phrase.length).toBeGreaterThan(3);
        expect(p.category).toBeTruthy();
      });
    });

    it('generates Bluff the Answer questions with true answers', async () => {
      const res = await generateBluffContent({ count: 5 });
      expect(res.items.length).toBeGreaterThanOrEqual(1);
      res.items.forEach((q) => {
        expect(q.question).toBeTruthy();
        expect(q.trueAnswer).toBeTruthy();
      });
    });

    it('generates Heads Up clue decks with varied items', async () => {
      const res = await generateHeadsUpContent({ count: 10 });
      expect(res.cards.length).toBeGreaterThanOrEqual(1);
      res.cards.forEach((item) => {
        expect(item.item).toBeTruthy();
        expect(item.category).toBeTruthy();
      });
    });

    it('generates 4x4 Word Hunt letter grids with path validator', async () => {
      const gridData = await generateWordHuntContent();
      expect(gridData.grid).toHaveLength(4);
      gridData.grid.forEach((row) => {
        expect(row).toHaveLength(4);
      });
      expect(typeof gridData.isValidWordPath).toBe('function');
    });

    it('generates Scattergories letter roll and categories', async () => {
      const round = await generateScattergoriesContent();
      expect(round.letter).toMatch(/^[A-Z]$/);
      expect(round.categories.length).toBeGreaterThanOrEqual(6);
    });

    it('generates Trivia Elimination survival questions with explanations', async () => {
      const res = await generateEliminationContent({ count: 8 });
      expect(res.questions.length).toBeGreaterThanOrEqual(1);
      res.questions.forEach((q) => {
        expect(q.question).toBeTruthy();
        expect(q.options).toHaveLength(4);
        expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctOptionIndex).toBeLessThan(4);
        expect(q.explanation).toBeTruthy();
      });
    });
  });

  describe('3. Tournament Mode & Multi-Game Playlists', () => {
    it('creates a tournament including battle games and records round winners', () => {
      clearActiveTournament();
      const playlist = battleGameIds.slice(0, 3);
      const session = createNewTournament(
        'Family Championship 2026',
        playlist,
        ['Team Alpha', 'Team Bravo']
      );

      expect(session.id).toBeTruthy();
      expect(session.rounds).toHaveLength(3);
      expect(session.currentRoundIndex).toBe(0);
      expect(session.standings).toHaveLength(2);

      // Verify each round matches the game ID
      playlist.forEach((gameId, idx) => {
        expect(session.rounds[idx].gameId).toBe(gameId);
      });

      // Round 1: Team Alpha 1st (100 pts), Team Bravo 2nd (60 pts)
      const afterR1 = recordTournamentRoundResult([
        { teamName: 'Team Alpha', matchScore: 120 },
        { teamName: 'Team Bravo', matchScore: 80 },
      ]);

      expect(afterR1?.currentRoundIndex).toBe(1);
      expect(afterR1?.rounds[0].isCompleted).toBe(true);
      expect(afterR1?.rounds[0].winnerTeamName).toBe('Team Alpha');

      const alphaStanding = afterR1?.standings.find((s) => s.teamName === 'Team Alpha');
      expect(alphaStanding?.totalScore).toBe(100);

      // Round 2: Team Bravo wins 1st (100 pts), Team Alpha 2nd (60 pts)
      const afterR2 = recordTournamentRoundResult([
        { teamName: 'Team Bravo', matchScore: 95 },
        { teamName: 'Team Alpha', matchScore: 50 },
      ]);

      expect(afterR2?.currentRoundIndex).toBe(2);
      const alphaAfter = afterR2?.standings.find((s) => s.teamName === 'Team Alpha');
      const bravoAfter = afterR2?.standings.find((s) => s.teamName === 'Team Bravo');
      // Both should have 160 points now
      expect(alphaAfter?.totalScore).toBe(160);
      expect(bravoAfter?.totalScore).toBe(160);

      clearActiveTournament();
      expect(getActiveTournament()).toBeNull();
    });
  });

  describe('4. Dual-Screen Sync & Audience Concealment Protocol', () => {
    it('broadcasts state updates safely through hubSyncBus without unhandled exceptions', () => {
      expect(() => {
        hubSyncBus.broadcastStateUpdate({
          type: 'GAME_STATE_UPDATE',
          gameId: 'taboo',
          status: 'playing',
          roundNumber: 1,
          activeTeamId: 'team-1',
          data: {
            // In Taboo, secret targetWord and tabooWords are masked for TV audience
            audienceViewMode: 'concealed',
            category: 'Filipino Food',
          },
        });
      }).not.toThrow();
    });

    it('broadcasts sound cues safely', () => {
      expect(() => {
        hubSyncBus.broadcastSoundTrigger('buzzer');
        hubSyncBus.broadcastSoundTrigger('correct');
        hubSyncBus.broadcastSoundTrigger('round_win');
        hubSyncBus.broadcastSoundTrigger('game_win');
      }).not.toThrow();
    });
  });
});
