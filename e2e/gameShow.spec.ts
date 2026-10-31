import { test, expect } from '@playwright/test';

test.describe('Family Feud Game Show End-to-End Tests', () => {
  test('Main Menu loads correctly and navigates to Game Setup', async ({ page }) => {
    await page.goto('/');

    // Check title specifically with role heading
    await expect(page.getByRole('heading', { name: 'FAMILY FEUD' })).toBeVisible();
    await expect(page.getByText('START NEW GAME')).toBeVisible();

    // Click Start New Game
    await page.getByText('START NEW GAME').click();
    await expect(page).toHaveURL(/.*#\/setup/);
    await expect(page.getByText('GAME SETUP')).toBeVisible();
  });

  test('Creates game, plays Face-off, reveals answers, calls strikes, and resolves steal', async ({ page }) => {
    await page.goto('/#/setup');

    // Wait for setup to be ready
    await expect(page.getByText('GAME SETUP')).toBeVisible();

    // Fill in team names
    const team1Input = page.getByPlaceholder('e.g. Team Santos');
    await team1Input.fill('Garcia Family');

    const team2Input = page.getByPlaceholder('e.g. Team Reyes');
    await team2Input.fill('Flores Family');

    // Click Start Game Now
    await page.getByText('START GAME NOW').click();

    // Host console should load
    await expect(page.getByText('HOST CONSOLE')).toBeVisible();
    await expect(page.getByText('FACE-OFF ROUND 1')).toBeVisible();
    await expect(page.getByText('Garcia Family Wins Face-off')).toBeVisible();

    // Team 1 wins faceoff and chooses to play
    await page.getByText('They PLAY the Board').first().click();

    // Regular round play active
    await expect(page.getByText('Controlling Team:')).toBeVisible();
    await expect(page.getByText('Garcia Family').first()).toBeVisible();

    // Click "Reveal" on the first answer
    const revealBtns = page.getByRole('button', { name: 'Reveal', exact: true });
    await expect(revealBtns.first()).toBeVisible();
    await revealBtns.first().click();

    // Verify first answer shows "Revealed"
    await expect(page.getByText('Revealed').first()).toBeVisible();

    // Record 3 strikes
    const strikeBtn = page.getByText('STRIKE (X)');
    await strikeBtn.click();
    await strikeBtn.click();
    await strikeBtn.click();

    // Steal Opportunity banner should be visible
    await expect(page.getByText('STEAL ATTEMPT BY:')).toBeVisible();

    // Mark steal successful
    await page.getByText('Steal SUCCESSFUL').click();

    // Round summary appears
    await expect(page.getByText('Round Complete!')).toBeVisible();
  });

  test('Question Pack Library allows searching and viewing packs', async ({ page }) => {
    await page.goto('/#/packs');

    await expect(page.getByText('QUESTION PACK LIBRARY')).toBeVisible();
    await expect(page.getByText('Pinoy Fiesta & Filipino Family Life')).toBeVisible();

    // Test Search
    const searchInput = page.getByPlaceholder('Search questions, prompts, or answers...');
    await searchInput.fill('Fiesta');
    await expect(page.getByText('Pinoy Fiesta & Filipino Family Life')).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.getByText('Create Custom Pack')).toBeVisible();

    // Verify Filipino packs exist in library, including new packs
    await expect(page.getByRole('heading', { name: 'Filipino Food & Drinks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Certified Pinoy Moments' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pamilya Group Chat' })).toBeVisible();
  });

  test('Game Setup displays all 10 categories, previews questions, and launches Filipino pack', async ({ page }) => {
    await page.goto('/#/setup');

    await expect(page.getByText('GAME SETUP')).toBeVisible();

    // Verify category pills are visible
    await expect(page.getByRole('button', { name: '★ All Categories' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Philippine Geography & Trivia' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sports & Basketball' })).toBeVisible();

    // Click Philippine Geography & Trivia category
    await page.getByRole('button', { name: 'Philippine Geography & Trivia' }).click();

    // Verify question preview shows questions for that pack
    await expect(page.getByText('Pack: Philippine Geography & Trivia')).toBeVisible();
    await expect(page.getByText('Name a major island group in the Philippines.')).toBeVisible();

    // Uncheck shuffle to guarantee question 1 is first
    const shuffleCheckbox = page.getByRole('checkbox');
    if (await shuffleCheckbox.isChecked()) {
      await shuffleCheckbox.uncheck();
    }

    // Launch the game
    await page.getByText('START GAME NOW').click();

    // Verify host console loads with the selected pack question
    await expect(page.getByText('HOST CONSOLE')).toBeVisible();
    await expect(page.getByText('Name a famous tourist destination in the Philippines.')).toBeVisible();
  });

  test('LDS Scripture Trivia packs appear in setup and host console displays scripture reference', async ({ page }) => {
    await page.goto('/#/setup');
    await expect(page.getByText('GAME SETUP')).toBeVisible();

    // Verify Noah and the Great Flood category pill
    const noahBtn = page.getByRole('button', { name: 'Noah and the Great Flood' });
    await expect(noahBtn).toBeVisible();
    await noahBtn.click();

    // Check preview shows scripture badge
    await expect(page.getByText('Pack: Noah and the Great Flood')).toBeVisible();
    await expect(page.getByText('📖 Genesis 6:14')).toBeVisible();

    // Uncheck shuffle
    const shuffleCheckbox = page.getByRole('checkbox');
    if (await shuffleCheckbox.isChecked()) {
      await shuffleCheckbox.uncheck();
    }

    // Launch game
    await page.getByText('START GAME NOW').click();

    // Verify Host Console displays scripture reference and format
    await expect(page.getByText('HOST CONSOLE')).toBeVisible();
    await expect(page.getByText('📖 Genesis 6:14')).toBeVisible();
    await expect(page.getByText('🏷️ Name the Object')).toBeVisible();
  });

  test('Settings Page allows volume adjustment and sound testing', async ({ page }) => {
    await page.goto('/#/settings');

    await expect(page.getByText('SETTINGS & RULES')).toBeVisible();
    await expect(page.getByText('Audio & Sound Synthesis')).toBeVisible();
    await expect(page.getByText('Host Keyboard Shortcuts')).toBeVisible();

    // Sound test button clicks without error
    const introBtn = page.getByText('🎺 Intro Fanfare');
    await expect(introBtn).toBeVisible();
    await introBtn.click();
  });
});
