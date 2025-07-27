import { test, expect } from '@playwright/test';

test.describe('Sequence Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be fully loaded
    await page.waitForSelector('[data-testid="app-title"]');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sequence Timer/);
  });

  test('should have a header with the text "Sequence Timer"', async ({ page }) => {
    const header = page.getByTestId('app-title');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Sequence Timer');
  });

  test('should have a timer display', async ({ page }) => {
    const timerDisplay = page.getByTestId('timer-display');
    await expect(timerDisplay).toBeVisible();
    await expect(timerDisplay).toHaveText('No timer running.');
  });

  test('should show start and reset buttons initially', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    const resetButton = page.getByTestId('reset-button');
    const pauseButton = page.getByTestId('pause-button');
    const stopButton = page.getByTestId('stop-button');

    await expect(startButton).toBeVisible();
    await expect(resetButton).toBeVisible();
    await expect(pauseButton).toBeHidden();
    await expect(stopButton).toBeHidden();
  });

  test('should show pause and stop buttons when timer starts', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    const pauseButton = page.getByTestId('pause-button');
    const stopButton = page.getByTestId('stop-button');

    await startButton.click();
    
    await expect(pauseButton).toBeVisible();
    await expect(stopButton).toBeVisible();
    await expect(startButton).toBeHidden();
  });

  test('should pause the timer when pause button is clicked', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    const pauseButton = page.getByTestId('pause-button');
    const timerDisplay = page.getByTestId('timer-display');

    await startButton.click();
    await expect(pauseButton).toBeVisible();
    
    // Wait for the timer to start updating
    await page.waitForTimeout(1000);
    
    await pauseButton.click();
    const timeAfterPause = await timerDisplay.textContent();
    
    // Wait a bit to ensure the timer is actually paused
    await page.waitForTimeout(1000);
    const timeAfterWait = await timerDisplay.textContent();
    
    expect(timeAfterPause).toBe(timeAfterWait);
  });

  test('should reset the timer when reset button is clicked', async ({ page }) => {
    const startButton = page.getByTestId('start-button');
    const resetButton = page.getByTestId('reset-button');
    const timerDisplay = page.getByTestId('timer-display');

    await startButton.click();
    await page.waitForTimeout(1000);
    await resetButton.click();

    await expect(timerDisplay).toHaveText('No timer running.');
    await expect(startButton).toBeVisible();
  });
}); 