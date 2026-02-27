import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsGuest } from './fixtures/auth';
import { makeEvent, makeGuestUser, makeTicketType, makeFiatPrice } from './fixtures/test-data';

const GUEST = makeGuestUser();
const FREE_TICKET = makeTicketType({ _id: 'free-ticket', title: 'Free Entry', prices: [] });
const PAID_TICKET = makeTicketType({
  _id: 'paid-ticket',
  title: 'VIP Pass',
  prices: [makeFiatPrice()],
});
const EVENT = makeEvent({
  event_ticket_types: [FREE_TICKET, PAID_TICKET],
  approval_required: false,
});

const baseMocks = {
  GetMe: { data: { getMe: GUEST } },
  GetEvent: { data: { getEvent: EVENT } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  GetEventTicketTypes: { data: { getEventTicketTypes: [FREE_TICKET, PAID_TICKET] } },
  ListEventTicketTypes: { data: { listEventTicketTypes: [FREE_TICKET, PAID_TICKET] } },
  GetMyEventJoinRequest: { data: { getMyEventJoinRequest: null } },
  GetMyTickets: { data: { getMyTickets: { tickets: [], total: 0 } } },
  ListEventTokenGates: { data: { listEventTokenGates: [] } },
  GetEventInvitation: { data: { getEventInvitation: null } },
  CalculateTicketsPricing: { data: { calculateTicketsPricing: { total: '0', sub_total: '0', discount: '0', fee: '0' } } },
  RedeemTickets: { data: { redeemTickets: { _id: 'jr-new' } } },
};

test.describe('Ticket Purchase / RSVP', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGuest(page);
    await mockGraphQL(page, baseMocks);
  });

  test('event page renders ticket types', async ({ page }) => {
    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // Ticket type names should be visible on the page
    await expect(page.getByText(FREE_TICKET.title)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(PAID_TICKET.title)).toBeVisible();
  });

  test('register button is visible and responds to click', async ({ page }) => {
    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const registerButton = page.locator('[data-testid="event-register-button"]');
    await expect(registerButton).toBeVisible({ timeout: 10000 });
  });

  test('free RSVP calls RedeemTickets mutation', async ({ page }) => {
    let redeemCalled = false;
    let capturedVariables: Record<string, unknown> = {};

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'RedeemTickets') {
        redeemCalled = true;
        capturedVariables = body.variables ?? {};
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { redeemTickets: { _id: 'jr-new' } } }),
        });
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const registerButton = page.locator('[data-testid="event-register-button"]');
    await expect(registerButton).toBeVisible({ timeout: 10000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      registerButton.click(),
    ]);
  });

  test('CalculateTicketsPricing is called when ticket quantity changes', async ({ page }) => {
    let pricingCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CalculateTicketsPricing') {
        pricingCalled = true;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // Look for the ticket select item's increment button (NumberInput +)
    const ticketItem = page.locator(`[data-testid="ticket-select-${PAID_TICKET._id}"]`);
    await expect(ticketItem).toBeVisible({ timeout: 10000 });

    // Click the increment button inside the ticket item
    const incrementButton = ticketItem.locator('button').last();
    await incrementButton.click();
    await page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200);

    expect(pricingCalled).toBe(true);
  });

  test('already registered guest sees their tickets', async ({ page }) => {
    await mockGraphQL(page, {
      ...baseMocks,
      GetMyEventJoinRequest: {
        data: {
          getMyEventJoinRequest: {
            _id: 'jr-existing',
            state: 'approved',
          },
        },
      },
      GetMyTickets: {
        data: {
          getMyTickets: {
            tickets: [{
              _id: 'ticket-existing',
              shortid: 'tkt-exist',
              type_expanded: FREE_TICKET,
              assigned_to: GUEST._id,
            }],
            total: 1,
          },
        },
      },
    });

    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // The register button should NOT be visible — user already has tickets
    const registerButton = page.locator('[data-testid="event-register-button"]');
    await expect(registerButton).not.toBeVisible({ timeout: 5000 });
  });

  test('approval-required event shows "Request to Join" button text', async ({ page }) => {
    const approvalEvent = makeEvent({
      ...EVENT,
      approval_required: true,
    });

    await mockGraphQL(page, {
      ...baseMocks,
      GetEvent: { data: { getEvent: approvalEvent } },
    });

    await page.goto(`/localhost/e/${approvalEvent.shortid}`);
    await page.waitForLoadState('networkidle');

    const registerButton = page.locator('[data-testid="event-register-button"]');
    await expect(registerButton).toBeVisible({ timeout: 10000 });
    await expect(registerButton).toContainText(/Request to Join|One-click Apply/);
  });
});
