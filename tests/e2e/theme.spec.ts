import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test('should switch between light and dark themes', async ({ page }) => {
    await page.goto('/');

    // Check initial theme (light)
    const initialHtmlClass = await page.getAttribute('html', 'class');
    expect(initialHtmlClass).toContain('light');

    // Get initial background color
    const initialBgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('background-color');
    });

    // Click the theme toggle button
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Check for dark mode class
    const darkHtmlClass = await page.getAttribute('html', 'class');
    expect(darkHtmlClass).toContain('dark');

    // Get dark mode background color
    const darkBgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('background-color');
    });

    // Ensure background color has changed
    expect(darkBgColor).not.toBe(initialBgColor);

    // Switch back to light mode
    await page.getByRole('button', { name: /toggle theme/i }).click();

    // Check for light mode class
    const lightHtmlClass = await page.getAttribute('html', 'class');
    expect(lightHtmlClass).toContain('light');

    // Get light mode background color
    const lightBgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).getPropertyValue('background-color');
    });

    // Ensure background color is back to the initial color
    expect(lightBgColor).toBe(initialBgColor);
  });
});
