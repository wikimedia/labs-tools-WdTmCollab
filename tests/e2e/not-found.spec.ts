import { test, expect } from '@playwright/test';

test.describe('404 Not Found', () => {
  test('invalid route returns 404 and shows Not Found', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('networkidle');
    expect(response && response.status()).toBe(404);
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('This page could not be found.')).toBeVisible();
  });
});
