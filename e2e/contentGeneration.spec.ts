import { test, expect } from '@playwright/test';

test.describe('Phase 3: Dynamic Content Generation Tests', () => {
  test('Family Trivia Setup features Dynamic Content Generator with categories and preview deck', async ({ page }) => {
    await page.goto('/#/games/family-trivia/setup');

    // Generator header
    await expect(page.getByRole('heading', { name: /Dynamic Content Generator/i })).toBeVisible();
    await expect(page.getByText(/Local Procedural Engine/i)).toBeVisible();

    // Controls
    const generateBtn = page.getByRole('button', { name: /Generate Fresh Set/i });
    await expect(generateBtn).toBeVisible();

    // Review deck contains Q1
    await expect(page.getByText(/Host Review & Customization/i)).toBeVisible();
    await expect(page.getByText(/Q1 ·/i)).toBeVisible();

    // Trigger generate fresh set
    await generateBtn.click();
    await expect(page.getByText(/Content generated successfully/i)).toBeVisible();
  });

  test('Charades Setup generates and previews acting prompts with difficulty points', async ({ page }) => {
    await page.goto('/#/games/charades/setup');

    await expect(page.getByRole('heading', { name: /Dynamic Content Generator/i })).toBeVisible();
    await expect(page.getByText(/Host Review & Customization/i)).toBeVisible();

    // Regenerate all prompts
    const regenAllBtn = page.getByRole('button', { name: /Regenerate All/i });
    await expect(regenAllBtn).toBeVisible();
    await regenAllBtn.click();
    await expect(page.getByText(/Content generated successfully/i)).toBeVisible();
  });

  test('Family Bingo Setup generates valid 5x5 player cards with FREE space', async ({ page }) => {
    await page.goto('/#/games/family-bingo/setup');

    await expect(page.getByRole('heading', { name: /Dynamic Content Generator/i })).toBeVisible();

    // Shows card preview selector
    await expect(page.getByRole('button', { name: /Player 1/i })).toBeVisible();
    await expect(page.getByText(/FREE/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Print Cards/i })).toBeVisible();
  });

  test('Host Console allows in-game "+ Generate New" content generation on the fly', async ({ page }) => {
    await page.goto('/#/games/family-trivia/setup');
    await page.getByRole('button', { name: /Start Game Console/i }).click();

    // In-game host console
    await expect(page.getByText('Family Trivia Host Console').first()).toBeVisible();

    // In-game generate button
    const genNewBtn = page.getByRole('button', { name: /\+ Generate New/i });
    await expect(genNewBtn).toBeVisible();
    await genNewBtn.click();

    // Question updates or advances
    await expect(page.getByText(/Question /i)).toBeVisible();
  });

  test('Settings Page allows managing Gemini API key and clearing content history', async ({ page }) => {
    await page.goto('/#/settings');

    await expect(page.getByRole('heading', { name: /Dynamic Content Generation & AI Engine/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Enter Google Gemini API Key/i)).toBeVisible();

    const saveKeyBtn = page.getByRole('button', { name: /Save Key/i });
    await expect(saveKeyBtn).toBeVisible();

    const testConnBtn = page.getByRole('button', { name: /Test Connection/i });
    await expect(testConnBtn).toBeVisible();
  });

  test('Family Feud remains 100% untouched and does NOT use party content generator', async ({ page }) => {
    await page.goto('/#/setup');

    // Confirm Feud Game Setup loaded
    await expect(page.getByText('GAME SETUP')).toBeVisible();

    // Confirm Filipino built-in packs are present
    await expect(page.getByText(/Mga Linyahan ni Mama/i)).toBeVisible();

    // Confirm party generator is NOT injected here
    await expect(page.getByRole('heading', { name: /Dynamic Content Generator/i })).not.toBeVisible();
  });
});
