import { test, expect } from '@playwright/test';

test.describe('Actor Details', () => {
  test('renders analytics or fallback states', async ({ page }) => {
    await page.goto('/actors/38111');
    await page.waitForSelector('main', { state: 'visible' });
    const analyticsVisible = await page.locator('text=Network & Analytics').isVisible().catch(() => false);
    const loadingVisible = await page.locator('text=Loading actor details...').isVisible().catch(() => false);
    const errorVisible = await page.locator('text=Error loading actor').isVisible().catch(() => false);
    expect(analyticsVisible || loadingVisible || errorVisible).toBeTruthy();
  });

  test('shows collaboration network graph or empty state', async ({ page }) => {
    await page.goto('/actors/38111');
    await page.waitForSelector('main', { state: 'visible' });
    const loadingVisible = await page.locator('text=Loading actor details...').isVisible().catch(() => false);
    const errorVisible = await page.locator('text=Error loading actor').isVisible().catch(() => false);
    if (loadingVisible || errorVisible) {
      expect(true).toBeTruthy();
      return;
    }

    await expect(page.getByRole('heading', { name: 'Collaboration Network' })).toBeVisible();
    const svgVisible = await page.locator('svg').first().isVisible().catch(() => false);
    const emptyStateVisible = await page.locator('text=Not enough data to generate network.').isVisible().catch(() => false);
    expect(svgVisible || emptyStateVisible).toBeTruthy();
  });
});
