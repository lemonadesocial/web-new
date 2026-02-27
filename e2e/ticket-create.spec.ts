import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import { makeEvent, makeUser, makeTicketType } from './fixtures/test-data';

const HOST = makeUser();
const EVENT = makeEvent({ host: HOST._id });
const TICKET = makeTicketType();

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetEvent: { data: { getEvent: EVENT } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  ListEventTicketTypes: { data: { listEventTicketTypes: [TICKET] } },
  ListEventTokenGates: { data: { listEventTokenGates: [] } },
  GetEventGuestsStatistics: { data: { getEventGuestsStatistics: { total: 0, going: 0, pending_approval: 0, checked_in: 0, pending_invite: 0 } } },
};

test.describe('Ticket Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, {
      ...baseMocks,
      CreateEventTicketType: { data: { createEventTicketType: makeTicketType({ _id: 'new-ticket' }) } },
      UpdateEventTicketType: { data: { updateEventTicketType: TICKET } },
      DeleteEventTicketType: { data: { deleteEventTicketType: true } },
    });
  });

  test('ticket list renders with existing ticket and Add Ticket Type button', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // The existing ticket title should be visible
    await expect(page.getByText(TICKET.title)).toBeVisible({ timeout: 10000 });

    // Add Ticket Type button should be visible
    const addButton = page.locator('[data-testid="add-ticket-type"]');
    await expect(addButton).toBeVisible();
  });

  test('Add Ticket Type button opens ticket drawer', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('[data-testid="add-ticket-type"]');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // The drawer should open with a title input for the new ticket
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
  });

  test('CreateEventTicketType mutation fires when saving new ticket', async ({ page }) => {
    let createCalled = false;
    let capturedVariables: Record<string, unknown> = {};

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEventTicketType') {
        createCalled = true;
        capturedVariables = body.variables ?? {};
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { createEventTicketType: makeTicketType() } }),
        });
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('[data-testid="add-ticket-type"]');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Fill ticket title in the drawer
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill('VIP Ticket');

    // Click Create Ticket button and wait for mutation
    const createButton = page.getByRole('button', { name: /Create Ticket/i }).first();
    await expect(createButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      createButton.click(),
    ]);

    expect(createCalled).toBe(true);
  });

  test('clicking existing ticket opens edit drawer', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    // Click on the existing ticket row
    const ticketRow = page.getByText(TICKET.title);
    await expect(ticketRow).toBeVisible({ timeout: 10000 });
    await ticketRow.click();

    // Drawer should open with the ticket title pre-filled
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await expect(titleInput).toHaveValue(TICKET.title);
  });
});
