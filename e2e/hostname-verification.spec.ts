import { expect, test, Route } from '@playwright/test';

import { loginAsHost } from './fixtures/auth';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { makeSpace, makeUser } from './fixtures/test-data';

const HOST = makeUser();
const SPACE = makeSpace({
  _id: 'space-hostname-001',
  hostnames: ['events.example.com'],
  fav_icon_url: null,
});

const UNVERIFIED_ENTRY = {
  __typename: 'WhitelabelHostname',
  hostname: 'events.example.com',
  verified: false,
  challenge_token: 'tok_initial',
  verified_at: null,
  created_at: '2026-04-23T00:00:00Z',
  last_checked_at: null,
  last_check_error: null,
};

const VERIFIED_ENTRY = {
  ...UNVERIFIED_ENTRY,
  verified: true,
  verified_at: '2026-04-23T00:00:05Z',
  last_checked_at: '2026-04-23T00:00:05Z',
};

const REQUEST_RESPONSE = {
  __typename: 'HostnameVerificationInstructions',
  hostname: 'events.example.com',
  challenge_token: 'tok_initial',
  txt_record_name: '_lemonade-challenge.events.example.com',
  txt_record_value: 'tok_initial',
  verified: false,
};

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetSpace: { data: { getSpace: SPACE } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  GetSpaceHostnameEntries: {
    data: {
      getSpace: {
        __typename: 'Space',
        _id: SPACE._id,
        hostname_entries: [UNVERIFIED_ENTRY],
      },
    },
  },
  RequestHostnameVerification: {
    data: { requestHostnameVerification: REQUEST_RESPONSE },
  },
  VerifyHostname: {
    data: {
      verifyHostname: {
        ...VERIFIED_ENTRY,
        __typename: 'HostnameVerificationStatus',
        txt_record_name: REQUEST_RESPONSE.txt_record_name,
        txt_record_value: REQUEST_RESPONSE.txt_record_value,
      },
    },
  },
};

test.describe('Custom domain hostname verification', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, baseMocks);
  });

  test('runs through request → verify → success on an unverified hostname', async ({ page }) => {
    await page.goto(`/s/manage/${SPACE._id}/settings/advanced`);
    await page.waitForLoadState('networkidle');

    // The hostname row renders with the Unverified badge and a Verify button.
    const badge = page.getByTestId('hostname-badge-unverified').first();
    await expect(badge).toBeVisible({ timeout: 10000 });

    const verifyButton = page.getByRole('button', { name: 'Verify', exact: true });
    await expect(verifyButton).toBeVisible();
    await verifyButton.click();

    // Modal opens with the TXT record instructions.
    await expect(page.getByText('_lemonade-challenge.events.example.com').first()).toBeVisible();
    await expect(page.getByText('tok_initial')).toBeVisible();

    // Click verify inside the modal.
    await page.getByRole('button', { name: 'Verify now' }).click();

    // Success state renders before auto-close.
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });
  });

  test('shows the DNS failure message when the TXT record is missing', async ({ page }) => {
    await mockGraphQL(page, {
      ...baseMocks,
      VerifyHostname: {
        data: {
          verifyHostname: {
            ...UNVERIFIED_ENTRY,
            __typename: 'HostnameVerificationStatus',
            verified: false,
            last_check_error: 'TXT record not found on _lemonade-challenge.events.example.com',
            last_checked_at: '2026-04-23T00:00:10Z',
            txt_record_name: REQUEST_RESPONSE.txt_record_name,
            txt_record_value: REQUEST_RESPONSE.txt_record_value,
          },
        },
      },
    });

    await page.goto(`/s/manage/${SPACE._id}/settings/advanced`);
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Verify', exact: true }).click();
    await page.getByRole('button', { name: 'Verify now' }).click();

    const errorBlock = page.getByTestId('verify-error');
    await expect(errorBlock).toBeVisible({ timeout: 5000 });
    await expect(errorBlock).toContainText('TXT record not found');
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  });

  test('re-verify flow is available on already-verified hostnames', async ({ page }) => {
    await mockGraphQL(page, {
      ...baseMocks,
      GetSpaceHostnameEntries: {
        data: {
          getSpace: {
            __typename: 'Space',
            _id: SPACE._id,
            hostname_entries: [VERIFIED_ENTRY],
          },
        },
      },
    });

    await page.goto(`/s/manage/${SPACE._id}/settings/advanced`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('hostname-badge-verified').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /re-verify/i })).toBeVisible();
  });

  test('fires RequestHostnameVerification with the correct variables', async ({ page }) => {
    let capturedVariables: Record<string, unknown> = {};

    await page.route('**/graphql', async (route: Route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData) as {
        operationName?: string;
        variables?: Record<string, unknown>;
      };

      if (body.operationName === 'RequestHostnameVerification') {
        capturedVariables = body.variables ?? {};
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { requestHostnameVerification: REQUEST_RESPONSE } }),
        });
      }

      if (body.operationName && baseMocks[body.operationName as keyof typeof baseMocks]) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(baseMocks[body.operationName as keyof typeof baseMocks]),
        });
      }

      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"data":{}}' });
    });

    await page.goto(`/s/manage/${SPACE._id}/settings/advanced`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Verify', exact: true }).click();

    await expect.poll(() => capturedVariables.hostname).toBe('events.example.com');
    expect(capturedVariables.space_id).toBe(SPACE._id);
  });
});
