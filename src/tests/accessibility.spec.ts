import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// 1. Define all the routes you want to audit
const routes = [
  '/',                     // Home
  '/actors',               // Actors Listing
  '/productions',          // Productions Listing
  '/compare',              // Compare Page
  '/compare?movie1=134773&movie2=104257&label1=Forrest+Gump&label2=Saving+Private+Ryan',
  '/actors/38111',         // Using the ID from your Mock Data (Tom Hanks)
  '/productions/134773',
  '/productions?actor1=38111&actor2=28782&label1=Tom+Hanks&label2=Robin+Wright'
];

test.describe('Comprehensive Accessibility Audit', () => {
  for (const route of routes) {
    test(`should check ${route} for accessibility violations`, async ({ page }) => {
      await page.goto(route);

      await page.waitForSelector('main', { state: 'visible', timeout: 15000 });

      if (route.includes('?')) {
        try {
          await page.waitForSelector('.grid', { timeout: 5000 });
        } catch (e) {
          console.log(`Note: Content grid did not load for ${route}`);
        }
      }

      await injectAxe(page);

      await checkA11y(page, {
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: { rules: { 'color-contrast': { enabled: false } } }
      });
    });
  }
});