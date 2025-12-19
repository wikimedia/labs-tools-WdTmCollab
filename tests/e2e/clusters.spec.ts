import { test, expect } from '@playwright/test';

test.describe('Collaboration Clusters', () => {
  test('renders cluster grid and sample cluster', async ({ page }) => {
    await page.goto('/shared-castings');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Collaboration Clusters' })).toBeVisible();
    await expect(page.locator('text=Spielberg Regulars')).toBeVisible();
  });
});

