import { test, expect } from '@playwright/test';

test.describe('Production Details', () => {
  test('renders title and Cast section', async ({ page }) => {
    await page.goto('/productions/134773');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Forrest Gump' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cast' })).toBeVisible();
  });
});

