import { Page } from '@playwright/test';

const AUTH_COOKIE_NAMES = ['ory_kratos_session', 'ory_kratos_session_staging'];
const DEFAULT_STAGING_SESSION = 'staging-session-token';

function getBaseUrl() {
  return process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:8000';
}

function getKratosUrl() {
  return process.env.PLAYWRIGHT_KRATOS_URL ?? process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL ?? getBaseUrl();
}

async function mockOryWhoAmI(page: Page, sessionValue: string) {
  await page.route('**/sessions/whoami**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'test-session-id',
        active: true,
        identity: {
          id: 'test-identity-id',
          traits: {
            email: 'host@lemonade.test',
            wallet: '0x0000000000000000000000000000000000000001',
          },
        },
      }),
      headers: {
        'set-cookie': `ory_kratos_session=${sessionValue}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  });
}

async function setAuthCookies(page: Page, sessionValue: string) {
  const baseUrl = getBaseUrl();
  const kratosUrl = getKratosUrl();
  const secure = baseUrl.startsWith('https://');
  const urls = Array.from(new Set([baseUrl, kratosUrl]));
  const cookies = urls.flatMap((url) =>
    AUTH_COOKIE_NAMES.map((name) => ({
      name,
      value: sessionValue,
      url,
      secure,
      sameSite: 'Lax' as const,
    }))
  );
  await page.context().addCookies(cookies);
}

export async function loginAsHost(page: Page) {
  const hostSession = process.env.PLAYWRIGHT_HOST_SESSION ?? DEFAULT_STAGING_SESSION;
  await mockOryWhoAmI(page, hostSession);
  await setAuthCookies(page, hostSession);
}

export async function loginAsGuest(page: Page) {
  const hostSession = process.env.PLAYWRIGHT_HOST_SESSION ?? DEFAULT_STAGING_SESSION;
  const guestSession = process.env.PLAYWRIGHT_GUEST_SESSION ?? hostSession;
  await mockOryWhoAmI(page, guestSession);
  await setAuthCookies(page, guestSession);
}
