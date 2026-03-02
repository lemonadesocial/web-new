import { Page } from '@playwright/test';

const AUTH_COOKIE_NAME = 'ory_kratos_session';
const TEST_HOST_SESSION = 'test-host-session-token';
const TEST_GUEST_SESSION = 'test-guest-session-token';

const MOCK_ORY_SESSION = {
  id: 'test-session-id',
  identity: {
    id: 'test-host-identity-id',
    traits: {
      email: 'host@test.com',
      wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      unicorn_wallet: null,
    },
  },
};

export async function loginAsHost(page: Page) {
  await page.route('**/sessions/whoami', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ORY_SESSION),
    })
  );

  await page.context().addCookies([
    {
      name: AUTH_COOKIE_NAME,
      value: TEST_HOST_SESSION,
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
}

export async function loginAsGuest(page: Page) {
  await page.route('**/sessions/whoami', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...MOCK_ORY_SESSION,
        identity: {
          ...MOCK_ORY_SESSION.identity,
          traits: { ...MOCK_ORY_SESSION.identity.traits, email: 'guest@test.com' },
        },
      }),
    })
  );

  await page.context().addCookies([
    {
      name: AUTH_COOKIE_NAME,
      value: TEST_GUEST_SESSION,
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
}
