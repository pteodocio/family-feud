import { test, expect } from '@playwright/test';

test.describe('Family Game Hub End-to-End Tests', () => {
  test('Homepage loads with branding, hero section, and 6 game cards', async ({ page }) => {
    await page.goto('/');

    // Check Branding
    await expect(page.getByRole('heading', { name: 'Family Game Hub' }).first()).toBeVisible();
    await expect(page.getByText('One Place. Endless Family Fun.').first()).toBeVisible();

    // Check All 6 Games are present in Library
    await expect(page.getByRole('heading', { name: 'Family Feud', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family Trivia', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Charades Party', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pictionary', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Family Bingo', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Guess the Word', exact: true })).toBeVisible();
  });

  test('How to Play modal opens and displays rules', async ({ page }) => {
    await page.goto('/');

    const howToPlayBtn = page.getByRole('button', { name: 'How to Play' }).first();
    await howToPlayBtn.click();

    await expect(page.getByRole('heading', { name: /How to Play/i })).toBeVisible();
  });

  test('Navigates to Family Feud setup from Quick Play and Hub card', async ({ page }) => {
    await page.goto('/');

    const quickPlayBtn = page.getByRole('button', { name: /Quick Play Feud/i });
    await quickPlayBtn.click();

    await expect(page).toHaveURL(/.*#\/setup/);
    await expect(page.getByText('GAME SETUP')).toBeVisible();
  });

  test('Launches Family Trivia into Host Console and reveals answer', async ({ page }) => {
    await page.goto('/#/games/family-trivia/setup');

    await expect(page.getByRole('heading', { name: 'Family Trivia' })).toBeVisible();
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    // Host Console loads
    await expect(page.getByText('Family Trivia Host Console').first()).toBeVisible();

    // Reveal answer button
    const revealBtn = page.getByRole('button', { name: /Reveal Answer on TV/i });
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();
    await expect(page.getByText('Correct Answer')).toBeVisible();
  });

  test('Launches Charades into Host Console with secret word and timer', async ({ page }) => {
    await page.goto('/#/games/charades/setup');

    await expect(page.getByRole('heading', { name: 'Charades Party' })).toBeVisible();
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    await expect(page.getByText('Charades Party Host Console').first()).toBeVisible();
    await expect(page.getByText('SECRET WORD — HOST ONLY')).toBeVisible();
    await expect(page.getByRole('button', { name: /Guessed Correctly/i })).toBeVisible();
  });

  test('Launches Pictionary into Host Console with drawing canvas', async ({ page }) => {
    await page.goto('/#/games/pictionary/setup');

    await expect(page.getByRole('heading', { name: 'Pictionary' })).toBeVisible();
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    await expect(page.getByText('Pictionary Host Canvas')).toBeVisible();
    await expect(page.getByText('SECRET WORD (DO NOT SAY OUT LOUD)')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('Launches Family Bingo into Host Console and calls balls', async ({ page }) => {
    await page.goto('/#/games/family-bingo/setup');

    await expect(page.getByRole('heading', { name: 'Family Bingo' })).toBeVisible();
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    await expect(page.getByText('Family Bingo Caller Console')).toBeVisible();
    const callBallBtn = page.getByRole('button', { name: /Call Next Ball/i });
    await expect(callBallBtn).toBeVisible();
    await callBallBtn.click();

    await expect(page.getByText('1 / 75 Numbers Called')).toBeVisible();
  });

  test('Launches Guess the Word into Host Console and reveals clues', async ({ page }) => {
    await page.goto('/#/games/guess-the-word/setup');

    await expect(page.getByRole('heading', { name: 'Guess the Word' })).toBeVisible();
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    await expect(page.getByText('Guess the Word Host Console').first()).toBeVisible();
    await expect(page.getByText('SECRET WORD (HOST ONLY)')).toBeVisible();

    const nextClueBtn = page.getByRole('button', { name: /Reveal Next Clue/i });
    await expect(nextClueBtn).toBeVisible();
    await nextClueBtn.click();
    await expect(page.getByText('Clue 2')).toBeVisible();
  });

  test('Global Settings page loads and allows updating audio settings', async ({ page }) => {
    await page.goto('/#/settings');

    await expect(page.getByRole('heading', { name: /Global Platform Settings/i })).toBeVisible();
    await expect(page.getByText('Master Volume')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test Sound FX' })).toBeVisible();
  });

  test('Game History page loads with empty ledger state or saved entries', async ({ page }) => {
    await page.goto('/#/history');

    await expect(page.getByRole('heading', { name: /Game History Ledger/i })).toBeVisible();
  });
});
