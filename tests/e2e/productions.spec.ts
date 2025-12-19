import { test, expect } from '@playwright/test';

test.describe('Shared Productions', () => {
  test('shows two actor search inputs', async ({ page }) => {
    await page.goto('/productions');
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Shared Productions' })).toBeVisible();
    await expect(page.getByPlaceholder('Select First Actor')).toBeVisible();
    await expect(page.getByPlaceholder('Select Second Actor')).toBeVisible();
  });

  test('with actor params, shows loading or grid', async ({ page }) => {
    await page.goto('/productions?actor1=38111&actor2=28782&label1=Tom+Hanks&label2=Robin+Wright');
    await page.waitForSelector('main', { state: 'visible' });
    const loadingVisible = await page.getByRole('heading', { name: 'Loading shared productions...' }).isVisible().catch(() => false);
    const gridVisible = await page.locator('.grid').first().isVisible().catch(() => false);
    expect(loadingVisible || gridVisible).toBeTruthy();
  });
});
