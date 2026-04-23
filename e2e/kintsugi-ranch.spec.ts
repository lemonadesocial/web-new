import { expect, test } from '@playwright/test';

test.describe('Kintsugi Ranch smoke test', () => {
  test('homepage shows Kintsugi Ranch text', async ({ page }) => {
    await page.goto('https://kintsugiranch.com/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Kintsugi Ranch' })).toBeVisible();
  });
});
