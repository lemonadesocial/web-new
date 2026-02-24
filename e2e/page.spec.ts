import { expect, test } from '@playwright/test';

test('health endpoint responds', async ({ page }) => {
  const response = await page.goto('/api/livez');
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toContainText('OK');
});
