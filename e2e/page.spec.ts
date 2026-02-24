import { expect, test } from '@playwright/test';

test.describe('API smoke checks', () => {
  test('GET /api/livez returns OK', async ({ request }) => {
    const response = await request.get('/api/livez');

    expect(response.status()).toBe(200);
    await expect(response.text()).resolves.toContain('OK');
  });

  test('POST /api/lemonade-username/metadata returns metadata payload', async ({ request }) => {
    const username = 'smoke_agent';
    const response = await request.post('/api/lemonade-username/metadata', {
      data: { username },
      headers: { 'content-type': 'application/json' },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body?.metadata?.name).toBe(username);
    expect(Array.isArray(body?.metadata?.attributes)).toBeTruthy();
  });

  test('GET /api/og/extractor without url returns 400', async ({ request }) => {
    const response = await request.get('/api/og/extractor');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body?.message).toBe('Bad Request');
  });
});
