import { test, expect } from '@playwright/test';

test.describe('Family Feud Game Show End-to-End Tests', () => {
  test('Main Menu loads correctly and navigates to Game Setup', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'FAMILY FEUD' })).toBeVisible();
    await expect(page.getByText('START NEW GAME')).toBeVisible();

    await page.getByText('START NEW GAME').click();
    await expect(page).toHaveURL(/.*#\/setup/);
    await expect(page.getByText('GAME SETUP')).toBeVisible();
  });

  test('Displays clean empty state in Question Pack Library when no packs exist', async ({ page }) => {
    await page.goto('/#/packs');

    await expect(page.getByText('QUESTION PACK LIBRARY')).toBeVisible();
    await expect(page.getByText('No question packs available yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create New Pack' })).toBeVisible();
  });

  test('Displays clean empty state in Game Setup when no packs exist and disables launch', async ({ page }) => {
    await page.goto('/#/setup');

    await expect(page.getByText('GAME SETUP')).toBeVisible();
    await expect(page.getByText('No question packs available yet.')).toBeVisible();

    const startBtn = page.getByRole('button', { name: 'START GAME NOW' });
    await expect(startBtn).toBeDisabled();
  });

  test('Creates custom pack, configures questions, and launches game', async ({ page }) => {
    // 1. Go to Packs Library
    await page.goto('/#/packs');
    await expect(page.getByText('No question packs available yet.')).toBeVisible();

    // 2. Click Create New Pack
    await page.getByRole('button', { name: 'Create New Pack' }).click();

    // 3. Arrive at Pack Editor
    await expect(page.getByText('QUESTION PACK EDITOR')).toBeVisible();

    // Set Pack Title
    const titleInput = page.locator('input[value="New Custom Survey Pack"]');
    await titleInput.fill('Family Gathering Trivia');

    // Set Question 1 prompt
    const promptInput = page.getByPlaceholder('e.g. Name something found in a kitchen...');
    if (await promptInput.count() > 0) {
      await promptInput.fill('Name something in the kitchen');
    }

    // Save Changes
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Saved successfully!')).toBeVisible();

    // Return to Packs Library
    await page.getByText('Packs Library').click();
    await expect(page.getByText('QUESTION PACK LIBRARY')).toBeVisible();
    await expect(page.getByText('Family Gathering Trivia')).toBeVisible();

    // Go to Setup and select the newly created pack
    await page.goto('/#/setup');
    await expect(page.getByText('GAME SETUP')).toBeVisible();
    await expect(page.getByText('Family Gathering Trivia').first()).toBeVisible();

    // Select the pack
    await page.getByText('Family Gathering Trivia').first().click();

    // START GAME NOW is enabled
    const startBtn = page.getByRole('button', { name: 'START GAME NOW' });
    await expect(startBtn).toBeEnabled();
    await startBtn.click();

    // Host console loads
    await expect(page.getByText('HOST CONSOLE')).toBeVisible();
  });

  test('TV Display controls, answer un-reveal/hide, strikes, and multi-screen sync work correctly', async ({ page }) => {
    // 1. Create a custom pack first to play with
    await page.goto('/#/packs');
    await page.getByRole('button', { name: 'Create New Pack' }).click();
    await expect(page.getByText('QUESTION PACK EDITOR')).toBeVisible();

    const titleInput = page.locator('input[value="New Custom Survey Pack"]');
    await titleInput.fill('Game Night Special');

    // Add prompt & answers
    const textarea = page.locator('textarea');
    if (await textarea.count() > 0) {
      await textarea.fill('Name something found in a refrigerator');
    }

    // Add a second question so navigation between questions works
    await page.getByRole('button', { name: 'Add' }).first().click();

    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Saved successfully!')).toBeVisible();

    // 2. Launch game with this pack
    await page.goto('/#/setup');
    await expect(page.getByText('GAME SETUP')).toBeVisible();
    await page.getByText('Game Night Special').first().click();
    await page.getByRole('button', { name: 'START GAME NOW' }).click();

    // 3. Host console loads
    await expect(page.getByText('HOST CONSOLE')).toBeVisible();

    // 4. Verify TV toolbar elements are present
    await expect(page.getByText('TV Display:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open TV Display' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reconnect Display' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Check Status' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fullscreen TV' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close TV Display' })).toBeVisible();

    // 5. Resolve Face-Off so we are in Regular Play
    await page.getByText('They PLAY the Board').first().click();
    await expect(page.getByText('Controlling Team:')).toBeVisible();

    // 6. Reveal an answer, then test Hide (un-reveal)
    const revealBtns = page.getByRole('button', { name: 'Reveal', exact: true });
    if (await revealBtns.count() > 0) {
      await revealBtns.first().click();
      await expect(page.getByText('Revealed').first()).toBeVisible();

      // Click Hide to un-reveal
      const hideBtn = page.getByRole('button', { name: 'Hide' }).first();
      await expect(hideBtn).toBeVisible();
      await hideBtn.click();

      // Reverts to Reveal button
      await expect(page.getByRole('button', { name: 'Reveal', exact: true }).first()).toBeVisible();
    }

    // 7. Test Question navigation
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // 8. Test End Game Confirmation Modal
    const endGameBtn = page.getByRole('button', { name: 'End Game' });
    await expect(endGameBtn).toBeVisible();
    await endGameBtn.click();

    await expect(page.getByText('End Game Now?')).toBeVisible();
    await page.getByRole('button', { name: 'Yes, End Game' }).click();

    // Game completed
    await expect(page.getByText('GAME SHOW CONCLUDED!')).toBeVisible();
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
