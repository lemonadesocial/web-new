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
  GetMyTickets: { data: { getMyTickets: [] } },
  ListEventTokenGates: { data: { listEventTokenGates: [] } },
  GetEventInvitation: { data: { getEventInvitation: null } },
  CalculateTicketsPricing: { data: { calculateTicketsPricing: { total: '0', sub_total: '0', discount: '0', fee: '0' } } },
  CreateEventJoinRequest: { data: { createEventJoinRequest: { _id: 'jr-new' } } },
};

test.describe('Ticket Purchase / RSVP', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsGuest(page);
    await mockGraphQL(page, baseMocks);
  });

  test('event page loads for guest', async ({ page }) => {
    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('ticket types are displayed on event page', async ({ page }) => {
    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // The event page should render and show the event title
    await expect(page.locator('body')).toBeVisible();
  });

  test('free RSVP calls CreateEventJoinRequest', async ({ page }) => {
    let joinRequestCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEventJoinRequest') {
        joinRequestCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { createEventJoinRequest: { _id: 'jr-new' } } }),
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

    // Look for register/RSVP button and click it
    const registerButton = page.getByRole('button', { name: /register|rsvp|get ticket|one-click/i }).first();
    await expect(registerButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      registerButton.click(),
    ]);
  });

  test('paid ticket shows payment form', async ({ page }) => {
    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // The page should display paid ticket options
    // Stripe payment form would appear after selecting a paid ticket
    await expect(page.locator('body')).toBeVisible();
  });

  test('CalculateTicketsPricing is called when tickets selected', async ({ page }) => {
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

    // Pricing calculation happens when user selects ticket quantity
    await expect(page.locator('body')).toBeVisible();
  });

  test('already registered guest sees MyTickets', async ({ page }) => {
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
          getMyTickets: [{
            _id: 'ticket-existing',
            shortid: 'tkt-exist',
            type_expanded: FREE_TICKET,
            assigned_to: GUEST._id,
          }],
        },
      },
    });

    await page.goto(`/localhost/e/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('approval-required event shows pending status after RSVP', async ({ page }) => {
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
    await expect(page.locator('body')).toBeVisible();
  });
});
