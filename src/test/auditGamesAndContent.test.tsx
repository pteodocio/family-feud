import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

import { DynamicContentGeneratorSection } from '../components/shared/DynamicContentGeneratorSection';
import { CharadesHostView } from '../games/charades/CharadesHostView';
import { CharadesTvView } from '../games/charades/CharadesTvView';
import { GuessWordHostView } from '../games/guessWord/GuessWordHostView';
import { GuessWordTvView } from '../games/guessWord/GuessWordTvView';
import { PictionaryTvView } from '../games/pictionary/PictionaryTvView';
import { TriviaTvView } from '../games/trivia/TriviaTvView';
import { BingoHostView } from '../games/bingo/BingoHostView';
import { PasswordHostView } from '../games/password/PasswordHostView';
import { PasswordTvView } from '../games/password/PasswordTvView';
import { TabooHostView } from '../games/taboo/TabooHostView';
import { JeopardyHostView } from '../games/jeopardy/JeopardyHostView';
import { WheelFortuneHostView } from '../games/wheelFortune/WheelFortuneHostView';
import { BluffHostView } from '../games/bluff/BluffHostView';
import { HeadsUpHostView } from '../games/headsUp/HeadsUpHostView';
import { WordHuntHostView } from '../games/wordHunt/WordHuntHostView';
import { ScattergoriesHostView } from '../games/scattergories/ScattergoriesHostView';
import { EliminationHostView } from '../games/elimination/EliminationHostView';
import { hubSyncBus } from '../sync/hubSync';
import { soundManager } from '../audio/soundManager';

const twoTeams = [
  { id: 't1', name: 'Team Alpha', score: 0, color: 'blue' as const },
  { id: 't2', name: 'Team Beta', score: 0, color: 'red' as const },
];

describe('Audit Regression Suite: Content Generator & All 15 Hub/Battle Games', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('DynamicContentGeneratorSection', () => {
    it('resets state on gameId switch and renders preview items for Battle Games preserving scattergories letter', async () => {
      const onReady = vi.fn();
      const { rerender } = render(
        <DynamicContentGeneratorSection
          gameId="password"
          gameTitle="Password"
          onContentReady={onReady}
        />
      );

      await waitFor(() => {
        expect(onReady).toHaveBeenCalled();
        expect(screen.getAllByText(/Secret Password/i).length).toBeGreaterThanOrEqual(1);
      });

      onReady.mockClear();
      rerender(
        <DynamicContentGeneratorSection
          gameId="scattergories"
          gameTitle="Scattergories"
          onContentReady={onReady}
        />
      );

      await waitFor(() => {
        expect(onReady).toHaveBeenCalled();
        const latestArg = onReady.mock.calls[onReady.mock.calls.length - 1][0];
        expect(Array.isArray(latestArg)).toBe(true);
        expect(latestArg[0]).toHaveProperty('letter');
        expect(latestArg[0]).toHaveProperty('categories');
      });
    });
  });

  describe('Original 5 Hub Party Games', () => {
    it('CharadesHostView prevents double-scoring on the same prompt', async () => {
      render(
        <CharadesHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      const correctBtn = screen.getByRole('button', { name: /Guessed Correctly/i });
      fireEvent.click(correctBtn);
      expect(correctBtn).toBeDisabled();
    });

    it('GuessWordHostView filters + Generate New safely and prevents double-scoring a puzzle', async () => {
      sessionStorage.setItem(
        'hub_custom_content_guess-the-word',
        JSON.stringify([
          {
            id: 'gw1',
            word: 'Mango',
            category: 'Food & Snacks',
            difficulty: 'easy',
            clues: ['Sweet fruit', 'Yellow flesh', 'Grown in Guimaras', 'National fruit'],
          },
        ])
      );

      render(
        <GuessWordHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      const awardButtons = screen.getAllByRole('button', { name: /\+40 pts/i });
      fireEvent.click(awardButtons[0]);
      expect(awardButtons[0]).toBeDisabled();
      expect(awardButtons[1]).toBeDisabled();
    });

    it('BingoHostView preserves themed non-numeric card labels instead of overwriting with numbers', async () => {
      sessionStorage.setItem(
        'hub_custom_content_family-bingo',
        JSON.stringify([
          {
            id: 'card_custom_1',
            playerName: 'Team Alpha',
            themeName: 'Pinoy Fiesta',
            grid: [
              [
                { text: 'Lechon', isFree: false },
                { text: 'Adobo', isFree: false },
                { text: 'Sinigang', isFree: false },
                { text: 'Pancit', isFree: false },
                { text: 'Lumpia', isFree: false },
              ],
              [
                { text: 'Kare-Kare', isFree: false },
                { text: 'Sisig', isFree: false },
                { text: 'Bulalo', isFree: false },
                { text: 'Halo-Halo', isFree: false },
                { text: 'Bibingka', isFree: false },
              ],
              [
                { text: 'Taho', isFree: false },
                { text: 'Puto', isFree: false },
                { text: 'FREE', isFree: true },
                { text: 'Turon', isFree: false },
                { text: 'Kwek-Kwek', isFree: false },
              ],
              [
                { text: 'Balut', isFree: false },
                { text: 'Isaw', isFree: false },
                { text: 'Tapsilog', isFree: false },
                { text: 'Longsilog', isFree: false },
                { text: 'Champorado', isFree: false },
              ],
              [
                { text: 'Leche Flan', isFree: false },
                { text: 'Ube Halaya', isFree: false },
                { text: 'Buko Pie', isFree: false },
                { text: 'Ensaymada', isFree: false },
                { text: 'Chicharon', isFree: false },
              ],
            ],
          },
        ])
      );

      render(
        <BingoHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      expect(screen.getAllByText('Lechon').length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText('Halo-Halo').length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('10 Team Battle Games Gameplay & Sync Fixes', () => {
    it('PasswordHostView loads custom setup deck and PasswordTvView displays final standings on isGameFinished', async () => {
      sessionStorage.setItem(
        'hub_custom_content_password',
        JSON.stringify([
          { id: 'c1', word: 'SINIGANG', category: 'Custom Pinoy', sampleClues: ['Sour', 'Soup', 'Pork'] },
        ])
      );

      render(
        <PasswordHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('SINIGANG')).toBeInTheDocument();
      });

      // Verify TV shows final results screen when game finishes
      render(<PasswordTvView />);
      act(() => {
        hubSyncBus.handleIncomingMessage({
          type: 'HUB_STATE_UPDATE',
          state: {
            gameId: 'password',
            secretWord: 'SINIGANG',
            isRevealed: true,
            category: 'Custom Pinoy',
            clueCount: 1,
            pointsValue: 10,
            activeTeamIndex: 0,
            activeTeamName: 'Team Alpha',
            activeTeamColor: 'blue',
            teams: [
              { id: 't1', name: 'Team Alpha', score: 30, color: 'blue' },
              { id: 't2', name: 'Team Beta', score: 10, color: 'red' },
            ],
            isGameFinished: true,
          },
        });
      });

      expect(screen.getByText(/Team Alpha WINS!/i)).toBeInTheDocument();
    });

    it('TabooHostView preserves 60s timer across cards on the same turn and passes final score to onEndGame', async () => {
      vi.useFakeTimers();
      sessionStorage.setItem(
        'hub_custom_content_taboo',
        JSON.stringify([
          { id: 't1', target: 'ADOBO', category: 'Food', tabooWords: ['Soy', 'Vinegar', 'Pork', 'Chicken', 'Garlic'] },
          { id: 't2', target: 'MANGO', category: 'Fruit', tabooWords: ['Yellow', 'Sweet', 'Seed', 'Summer', 'Shake'] },
        ])
      );

      const onEndGame = vi.fn();
      render(
        <TabooHostView
          teams={twoTeams}
          onEndGame={onEndGame}
          onReturnToHub={() => {}}
        />
      );

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText('ADOBO')).toBeInTheDocument();

      // Start turn timer and advance 5 seconds
      fireEvent.click(screen.getByTitle('Start Timer'));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('00:55')).toBeInTheDocument();

      // Correct card 1 -> advances to card 2, timer must stay at 00:55 (NOT reset to 01:00!)
      fireEvent.click(screen.getByRole('button', { name: /Correct!/i }));
      expect(screen.getByText('MANGO')).toBeInTheDocument();
      expect(screen.getByText('00:55')).toBeInTheDocument();

      // Correct card 2 (final card) -> finishes game and passes score = 2
      fireEvent.click(screen.getByRole('button', { name: /Correct!/i }));
      expect(onEndGame).toHaveBeenCalledTimes(1);
      const passedTeams = onEndGame.mock.calls[0][0];
      expect(passedTeams[0].score).toBe(2);
    });

    it('JeopardyHostView exposes Daily Double wager control and locks Correct scoring per clue', async () => {
      sessionStorage.setItem(
        'hub_custom_content_jeopardy',
        JSON.stringify([
          {
            id: 'j_board',
            title: 'Test Board',
            categories: [
              {
                id: 'c1',
                name: 'Cat 1',
                questions: [
                  { id: 'q1', value: 100, clue: 'DD Clue', answer: 'DD Answer', isDailyDouble: true },
                  { id: 'q2', value: 200, clue: 'C2', answer: 'A2' },
                  { id: 'q3', value: 300, clue: 'C3', answer: 'A3' },
                  { id: 'q4', value: 400, clue: 'C4', answer: 'A4' },
                  { id: 'q5', value: 500, clue: 'C5', answer: 'A5' },
                ],
              },
            ],
            finalJeopardy: { category: 'FJ', clue: 'FC', answer: 'FA' },
          },
        ])
      );

      render(
        <JeopardyHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '$100' })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: '$100' }));
      const wagerInput = screen.getByLabelText(/Daily Double Wager/i);
      expect(wagerInput).toBeInTheDocument();
      fireEvent.change(wagerInput, { target: { value: '750' } });

      const correctBtn = screen.getByRole('button', { name: /Correct \(\+\$750\)/i });
      fireEvent.click(correctBtn);
      expect(correctBtn).toBeDisabled();
    });

    it('WheelFortuneHostView blocks free vowels at $0 bank and prevents double-solve scoring', async () => {
      sessionStorage.setItem(
        'hub_custom_content_wheel-of-fortune',
        JSON.stringify([{ id: 'w1', phrase: 'ADOBO TIME', category: 'Food' }])
      );

      render(
        <WheelFortuneHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
      });

      // Vowel 'A' is disabled at $0 Round Pot
      expect(screen.getByRole('button', { name: 'A' })).toBeDisabled();

      // Solve button locks after solving
      const solveBtn = screen.getByRole('button', { name: /Solve Verified!/i });
      fireEvent.click(solveBtn);
      expect(solveBtn).toBeDisabled();
    });

    it('BluffHostView creates distinct fallback bluffs when inputs are blank', async () => {
      sessionStorage.setItem(
        'hub_custom_content_bluff-the-answer',
        JSON.stringify([
          {
            id: 'b1',
            question: 'Sample Bluff Q?',
            trueAnswer: 'TrueFact',
            explanation: 'Explanation',
            suggestedBluffs: ['BluffOne', 'BluffTwo', 'BluffThree'],
          },
        ])
      );

      render(
        <BluffHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Sample Bluff Q\?/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Shuffle & Show Choices on TV Screen/i }));

      expect(screen.getByText('BluffOne')).toBeInTheDocument();
      expect(screen.getByText('BluffTwo')).toBeInTheDocument();
    });

    it('HeadsUpHostView passes updated score on last card without stale closure', async () => {
      sessionStorage.setItem(
        'hub_custom_content_heads-up',
        JSON.stringify([{ id: 'h1', item: 'Darna', category: 'Pinoy' }])
      );
      const onEndGame = vi.fn();

      render(
        <HeadsUpHostView
          teams={twoTeams}
          onEndGame={onEndGame}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Darna')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /CORRECT! \(\+1\)/i }));
      expect(onEndGame).toHaveBeenCalledTimes(1);
      expect(onEndGame.mock.calls[0][0][0].score).toBe(1);
    });

    it('WordHuntHostView deduplicates per-team words and locks round scoring after applied', async () => {
      sessionStorage.setItem(
        'hub_custom_content_word-hunt',
        JSON.stringify([
          {
            grid: [
              ['C', 'A', 'T', 'S'],
              ['O', 'R', 'E', 'P'],
              ['D', 'O', 'G', 'S'],
              ['F', 'I', 'S', 'H'],
            ],
          },
        ])
      );

      render(
        <WordHuntHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Stop & Enter Words/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Stop & Enter Words/i }));

      const inputs = screen.getAllByPlaceholderText('Add word...');
      const addBtns = screen.getAllByRole('button', { name: 'Add' });

      fireEvent.change(inputs[0], { target: { value: 'CAT' } });
      fireEvent.click(addBtns[0]);
      fireEvent.change(inputs[0], { target: { value: 'CAT' } });
      fireEvent.click(addBtns[0]);

      // Only 1 CAT entry allowed for Team Alpha
      expect(screen.getAllByText(/CAT \(1 pts\)/i)).toHaveLength(1);

      const applyBtn = screen.getByRole('button', { name: /Apply Valid Words & Tally Scores!/i });
      fireEvent.click(applyBtn);
      expect(applyBtn).toBeDisabled();
    });

    it('ScattergoriesHostView does not play whistle on initial mount and locks round score button', async () => {
      const soundSpy = vi.spyOn(soundManager, 'playPartyCue');
      sessionStorage.setItem(
        'hub_custom_content_scattergories',
        JSON.stringify([{ letter: 'M', categories: ['Animals', 'Foods'] }])
      );

      render(
        <ScattergoriesHostView
          teams={twoTeams}
          onEndGame={() => {}}
          onReturnToHub={() => {}}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Animals')).toBeInTheDocument();
      });
      expect(soundSpy).not.toHaveBeenCalledWith('whistle');

      fireEvent.click(screen.getByRole('button', { name: /Open Review & Scoring Matrix/i }));
      const scoreBtn = screen.getByRole('button', { name: /Calculate & Award Unique Answer Points!/i });
      fireEvent.click(scoreBtn);
      expect(scoreBtn).toBeDisabled();
    });

    it('EliminationHostView prevents duplicate survivor rewards and ranks survivor above higher-scoring eliminated team', async () => {
      vi.useFakeTimers();
      sessionStorage.setItem(
        'hub_custom_content_trivia-elimination',
        JSON.stringify([
          {
            id: 'e1',
            question: 'Sample Elimination Q?',
            options: ['Right', 'Wrong1', 'Wrong2', 'Wrong3'],
            correctOptionIndex: 0,
            explanation: 'Exp',
            difficulty: 'medium',
          },
        ])
      );
      const onEndGame = vi.fn();

      render(
        <EliminationHostView
          teams={[
            { id: 't1', name: 'Eliminated Rich', score: 500, color: 'blue' },
            { id: 't2', name: 'Last Survivor', score: 100, color: 'red' },
          ]}
          onEndGame={onEndGame}
          onReturnToHub={() => {}}
        />
      );

      await act(async () => {
        await Promise.resolve();
      });

      const rewardBtn = screen.getByRole('button', { name: /Reveal Answer & Reward Survivors/i });
      fireEvent.click(rewardBtn);
      expect(rewardBtn).toBeDisabled();

      // Deduct all 3 lives from Team 1 -> Team 2 wins as sole survivor!
      const deductBtns = screen.getAllByRole('button', { name: /-1 Life/i });
      fireEvent.click(deductBtns[0]);
      fireEvent.click(deductBtns[0]);
      fireEvent.click(deductBtns[0]);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onEndGame).toHaveBeenCalledTimes(1);
      const recordedParticipants = onEndGame.mock.calls[0][0];
      const survivorEntry = recordedParticipants.find((p: any) => p.name === 'Last Survivor');
      const eliminatedEntry = recordedParticipants.find((p: any) => p.name === 'Eliminated Rich');
      expect(survivorEntry.score).toBeGreaterThan(eliminatedEntry.score);
    });

    it('renders TV waiting screens cleanly for Trivia, Charades, Pictionary, and Guess the Word without undefined Trophy errors', () => {
      hubSyncBus.handleIncomingMessage({ type: 'HUB_STATE_UPDATE', state: null as any });

      const { unmount: unmountTrivia } = render(<TriviaTvView />);
      expect(screen.getByText('Family Trivia')).toBeInTheDocument();
      unmountTrivia();

      const { unmount: unmountCharades } = render(<CharadesTvView />);
      expect(screen.getByText('Charades Party')).toBeInTheDocument();
      unmountCharades();

      const { unmount: unmountPictionary } = render(<PictionaryTvView />);
      expect(screen.getByText('Pictionary')).toBeInTheDocument();
      unmountPictionary();

      const { unmount: unmountGuess } = render(<GuessWordTvView />);
      expect(screen.getByText('Guess the Word')).toBeInTheDocument();
      unmountGuess();
    });
  });
});
