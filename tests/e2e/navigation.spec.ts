import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('Feature cards navigate across pages', async ({ page }) => {
    await page.goto('/');
    await Promise.all([
      page.waitForURL('**/actors'),
      page.locator('section.grid').locator('a[href="/actors"]').click()
    ]);
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Find Actor Collaborations' })).toBeVisible();

    await page.goto('/');
    await Promise.all([
      page.waitForURL('**/productions'),
      page.locator('section.grid').locator('a[href="/productions"]').click()
    ]);
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Shared Productions' })).toBeVisible();

    await page.goto('/');
    await Promise.all([
      page.waitForURL('**/compare'),
      page.locator('section.grid').locator('a[href="/compare"]').click()
    ]);
    await page.waitForSelector('main', { state: 'visible' });
    await expect(page.getByRole('heading', { name: 'Shared Actors from Movies' })).toBeVisible();
  });

  test('Skip to main content link works', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: 'Skip to main content' }).first();
    await skip.evaluate((el: any) => el.click());
    await expect.poll(async () => {
      const hasHash = (await page.url()).includes('#main-content');
      const focused = await page.evaluate(() => document.activeElement?.id === 'main-content');
      return hasHash || focused;
    }).toBeTruthy();
  });
});
