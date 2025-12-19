import { test, expect } from '@playwright/test';

test.describe('Actors List', () => {
  test('loads and shows search instructions', async ({ page }) => {
    await page.goto('/actors');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Find Actor Collaborations' })).toBeVisible();
    await expect(page.getByLabel('Search for actors')).toBeVisible();
  });

  test('query params trigger loading state', async ({ page }) => {
    await page.goto('/actors?actorId=38111&label=Tom+Hanks&page=1');
    await expect(page.locator('text=Loading collaborations...')).toBeVisible();
  });
});
