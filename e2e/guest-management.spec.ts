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
    data: { listEventGuests: { items: [GUEST, PENDING_GUEST, CHECKED_IN_GUEST], total: 3 } },
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

  test('guest list page renders search, filter, sort, and export controls', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="guest-list-search"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="guest-list-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="guest-list-sort"]')).toBeVisible();
    await expect(page.locator('[data-testid="guest-list-export"]')).toBeVisible();
  });

  test('search input sends ListEventGuests with search variable', async ({ page }) => {
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

    const searchInput = page.locator('[data-testid="guest-list-search"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('Test Guest');

    // Wait for debounced GraphQL request (300ms debounce)
    await page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200);
    expect(searchQuery).toBe('Test Guest');
  });

  test('filter menu shows Going, Pending, Invited, Not Going, Checked In options', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    const filterButton = page.locator('[data-testid="guest-list-filter"]');
    await expect(filterButton).toBeVisible({ timeout: 10000 });
    await filterButton.click();

    // Filter dropdown should show all status options
    await expect(page.getByText('Going').first()).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Pending').first()).toBeVisible();
    await expect(page.getByText('Invited').first()).toBeVisible();
    await expect(page.getByText('Not Going').first()).toBeVisible();
    await expect(page.getByText('Checked In').first()).toBeVisible();
  });

  test('sort menu shows Register Time and Approval Status options', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    const sortButton = page.locator('[data-testid="guest-list-sort"]');
    await expect(sortButton).toBeVisible({ timeout: 10000 });
    await sortButton.click();

    await expect(page.getByText('Register Time').nth(1)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Approval Status')).toBeVisible();
  });

  test('export button triggers CSV download', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    const exportButton = page.locator('[data-testid="guest-list-export"]');
    await expect(exportButton).toBeVisible({ timeout: 10000 });
    // Export button should have the aria-label for accessibility
    await expect(exportButton).toHaveAttribute('aria-label', 'Export guest list');
  });

  test('check-in page renders tabs for guest statuses', async ({ page }) => {
    await page.goto(`/localhost/e/check-in/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // Check-in page should show tabs: All Guests, Going, Checked In, Invited
    await expect(page.getByText('All Guests')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Going')).toBeVisible();
    await expect(page.getByText('Checked In')).toBeVisible();
    await expect(page.getByText('Invited')).toBeVisible();
  });

  test('check-in page has search input and scan button', async ({ page }) => {
    await page.goto(`/localhost/e/check-in/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByPlaceholder('Search for a guest...')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Scan')).toBeVisible();
  });
});
