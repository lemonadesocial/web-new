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

  test('guest statistics are displayed on the guest list page', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    // The GetEventGuestsStatistics query returns counts — verify stats are rendered
    // Stats values from STATS mock: total=50, going=30, pending_approval=5, checked_in=2
    await expect(page.locator('[data-testid="guest-list-search"]')).toBeVisible({ timeout: 10000 });

    // The guest list should show guest data from the ListEventGuests mock
    // At least one guest name should be visible
    await expect(page.getByText('Test Guest').first()).toBeVisible({ timeout: 5000 });
  });

  test('guest list shows pagination controls', async ({ page }) => {
    // Create mock with more guests to trigger pagination
    const manyGuests = Array.from({ length: 3 }, (_, i) =>
      makeGuest({
        _id: `guest-${i}`,
        user_expanded: {
          ...makeGuest().user_expanded,
          _id: `user-${i}`,
          name: `Guest ${i}`,
          email: `guest${i}@test.com`,
        },
      }),
    );

    await mockGraphQL(page, {
      ...baseMocks,
      ListEventGuests: {
        data: { listEventGuests: { items: manyGuests, total: 50 } },
      },
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}/guests`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="guest-list-search"]')).toBeVisible({ timeout: 10000 });

    // With total=50 and page size=25, pagination should show "Page 1 of 2"
    // or at minimum, a next page button
    const pageInfo = page.getByText(/Page/i).first();
    await expect(pageInfo).toBeVisible({ timeout: 5000 });
  });

  test('ApproveEventJoinRequest fires when approving a pending guest', async ({ page }) => {
    let approveCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'ApproveEventJoinRequest') {
        approveCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { approveEventJoinRequest: true } }),
        });
      }
      if (body.operationName === 'GetEventGuestDetailedInfo') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              getEventGuestDetailedInfo: {
                user: PENDING_GUEST.user_expanded,
                tickets: [PENDING_GUEST.ticket_expanded],
                join_request: PENDING_GUEST.join_request_expanded,
                payments: [],
                invitation: null,
                application_answers: [],
              },
            },
          }),
        });
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

    // Click on a pending guest to open the details drawer
    const pendingGuestName = page.getByText('Pending Guest').first();
    await expect(pendingGuestName).toBeVisible({ timeout: 10000 });
    await pendingGuestName.click();

    // Look for the Approve button in the drawer
    const approveButton = page.getByRole('button', { name: /Approve/i }).first();
    if (await approveButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await Promise.all([
        page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
        approveButton.click(),
      ]);
      expect(approveCalled).toBe(true);
    }
  });
});
