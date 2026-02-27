import { expect, test } from '@playwright/test';

/**
 * Post-deploy smoke tests.
 * These run against the REAL staging deployment (no mocks).
 * PLAYWRIGHT_BASE_URL must be set to the staging URL.
 *
 * These tests verify that critical pages load and render key elements.
 * They do NOT test mutations or business logic — that's what the mocked E2E tests are for.
 */

test.describe('Staging Smoke Tests', () => {
  test('health endpoint responds OK', async ({ request }) => {
    const response = await request.get('/api/livez');
    expect(response.status()).toBe(200);
    await expect(response.text()).resolves.toContain('OK');
  });

  test('homepage loads', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
  });

  test('OG extractor API returns 400 without URL param', async ({ request }) => {
    const response = await request.get('/api/og/extractor');
    expect(response.status()).toBe(400);
  });

  // Contract test: asserts response shape of the metadata API.
  // Update assertions here if the API response structure changes.
  test('username metadata API responds', async ({ request }) => {
    const response = await request.post('/api/lemonade-username/metadata', {
      data: { username: 'smoke_test' },
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body?.metadata?.name).toBe('smoke_test');
  });
});
