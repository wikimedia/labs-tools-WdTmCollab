import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('loads and shows search', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Wikidata TransMedia Collaboration' })).toBeVisible();
    await expect(page.getByLabel('Search for actors')).toBeVisible();
  });

  test('popular actors section shows loading state', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Popular Actors' })).toBeVisible();
  });
});

