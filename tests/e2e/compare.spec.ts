import { test, expect } from '@playwright/test';

test.describe('Compare Movies', () => {
  test('shows two movie search inputs', async ({ page }) => {
    await page.goto('/compare');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Shared Actors from Movies' })).toBeVisible();
    await expect(page.getByPlaceholder('Search First Movie')).toBeVisible();
    await expect(page.getByPlaceholder('Search Second Movie')).toBeVisible();
  });

  test('with movie params, shows loading or results', async ({ page }) => {
    await page.goto('/compare?movie1=134773&movie2=104257&label1=Forrest+Gump&label2=Saving+Private+Ryan');
    await page.waitForSelector('main', { state: 'visible' });
    const spinnerVisible = await page.locator('.animate-spin').first().isVisible().catch(() => false);
    const sharedHeadingVisible = await page.locator('text=Shared Actors').isVisible().catch(() => false);
    const noResultsVisible = await page.locator('text=No shared actors found.').isVisible().catch(() => false);
    expect(spinnerVisible || sharedHeadingVisible || noResultsVisible).toBeTruthy();
  });
});
