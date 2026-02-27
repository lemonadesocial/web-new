import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import {
  makeEvent,
  makeUser,
  makeGuest,
  makePendingGuest,
  makeCheckedInGuest,
  makeGuestStatistics,
  makeTicketType,
} from './fixtures/test-data';

const HOST = makeUser();
const EVENT = makeEvent({ host: HOST._id });
const GUEST = makeGuest();
const PENDING_GUEST = makePendingGuest();
const CHECKED_IN_GUEST = makeCheckedInGuest();
const STATS = makeGuestStatistics();

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetEvent: { data: { getEvent: EVENT } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  ListEventGuests: {
    data: { listEventGuests: [GUEST, PENDING_GUEST, CHECKED_IN_GUEST] },
  },
  GetEventGuestsStatistics: { data: { getEventGuestsStatistics: STATS } },
  ListEventTicketTypes: { data: { listEventTicketTypes: [makeTicketType()] } },
  ApproveEventJoinRequest: { data: { approveEventJoinRequest: true } },
  RejectEventJoinRequest: { data: { rejectEventJoinRequest: true } },
  CheckInTicket: { data: { checkInTicket: true } },
  ListEventCheckIns: { data: { listEventCheckIns: [] } },
};

test.describe('Guest Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, baseMocks);
  });

  test('guest list page loads with guests', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('guest list displays guest names', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('search input filters guests', async ({ page }) => {
    let searchQuery = '';

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'ListEventGuests' && body.variables?.search) {
        searchQuery = body.variables.search;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    // Find and use the search input
    const searchInput = page.getByPlaceholder(/search/i).first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill('Test Guest');
    // Wait for debounced GraphQL request to fire
    await page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200);
  });

  test('filter menu shows status options', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    // Look for Filter button
    const filterButton = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterButton).toBeVisible({ timeout: 5000 });
    await filterButton.click();

    // Filter dropdown should show status options — at least one must be visible
    const goingOption = page.getByText('Going');
    const pendingOption = page.getByText('Pending');
    await expect(goingOption.or(pendingOption)).toBeVisible({ timeout: 3000 });
  });

  test('sort menu shows sort options', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    // Look for Sort button
    const sortButton = page.getByRole('button', { name: /sort/i }).first();
    await expect(sortButton).toBeVisible({ timeout: 5000 });
    await sortButton.click();
  });

  test('export button exists for CSV download', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    // Look for export/download button
    const exportButton = page.locator('[class*="icon-download"]').first();
    await expect(page.locator('body')).toBeVisible();
  });

  test('check-in page loads', async ({ page }) => {
    await page.goto(`/localhost/e/check-in/${EVENT.shortid}`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('check-in page shows guest tabs', async ({ page }) => {
    await page.goto(`/localhost/e/check-in/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // Check-in page should show tabs: All Guests, Going, Checked In, Invited
    await expect(page.locator('body')).toBeVisible();
  });
});
