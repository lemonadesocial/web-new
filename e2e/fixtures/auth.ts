import { Page } from '@playwright/test';

const AUTH_COOKIE_NAME = 'ory_kratos_session';
const TEST_HOST_SESSION = 'test-host-session-token';
const TEST_GUEST_SESSION = 'test-guest-session-token';

export async function loginAsHost(page: Page) {
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
  await page.context().addCookies([
    {
      name: AUTH_COOKIE_NAME,
      value: TEST_GUEST_SESSION,
      domain: '127.0.0.1',
      path: '/',
    },
  ]);
}
