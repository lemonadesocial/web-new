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

  test('UpdateEventTicketType fires when editing existing ticket', async ({ page }) => {
    let updateCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'UpdateEventTicketType') {
        updateCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { updateEventTicketType: TICKET } }),
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

    // Open existing ticket drawer
    const ticketRow = page.getByText(TICKET.title);
    await expect(ticketRow).toBeVisible({ timeout: 10000 });
    await ticketRow.click();

    // Modify the title
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill('Updated Ticket Name');

    // Click Update Ticket button
    const updateButton = page.getByRole('button', { name: /Update Ticket/i }).first();
    await expect(updateButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      updateButton.click(),
    ]);

    expect(updateCalled).toBe(true);
  });

  test('DeleteEventTicketType fires when deleting a ticket', async ({ page }) => {
    let deleteCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'DeleteEventTicketType') {
        deleteCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { deleteEventTicketType: true } }),
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

    // Open existing ticket drawer
    const ticketRow = page.getByText(TICKET.title);
    await expect(ticketRow).toBeVisible({ timeout: 10000 });
    await ticketRow.click();

    // Click the delete button (icon-delete in the drawer header)
    const deleteButton = page.locator('.icon-delete').first();
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      deleteButton.click(),
    ]);

    expect(deleteCalled).toBe(true);
  });

  test('ticket drawer shows visibility toggles (active and private)', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('[data-testid="add-ticket-type"]');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Active toggle should be visible
    const activeToggle = page.locator('#active');
    await expect(activeToggle).toBeVisible({ timeout: 5000 });

    // Private toggle should be visible
    const privateToggle = page.locator('#private');
    await expect(privateToggle).toBeVisible();
  });

  test('ticket drawer shows capacity and per-person limit options', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}`);
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('[data-testid="add-ticket-type"]');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Capacity option should show icon-vertical-align-top
    await expect(page.locator('.icon-vertical-align-top').first()).toBeVisible({ timeout: 5000 });

    // Per-person limit option should show icon-ticket-plus
    await expect(page.locator('.icon-ticket-plus').first()).toBeVisible();
  });
});
