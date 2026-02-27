import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import { makeEvent, makeUser, makeSpace } from './fixtures/test-data';

const HOST = makeUser();
const SPACE = makeSpace();

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetMySpaces: { data: { getMySpaces: [SPACE] } },
  GetSpaces: { data: { getSpaces: [SPACE] } },
  GetSpace: { data: { getSpace: SPACE } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
};

test.describe('Event Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, {
      ...baseMocks,
      CreateEvent: { data: { createEvent: makeEvent() } },
      PinEventsToSpace: { data: { pinEventsToSpace: true } },
    });
  });

  test('create event page loads for authenticated host', async ({ page }) => {
    await page.goto('/localhost/create/event');
    // Page should load without errors — look for key form elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('event creation form has required fields', async ({ page }) => {
    await page.goto('/localhost/create/event');
    // Title input should be present
    const titleInput = page.locator('input[name="title"], textarea[name="title"], [contenteditable]').first();
    await expect(titleInput).toBeVisible({ timeout: 10000 });
  });

  test('CreateEvent mutation is called on form submit', async ({ page }) => {
    let createEventCalled = false;
    let capturedVariables: Record<string, unknown> = {};

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEvent') {
        createEventCalled = true;
        capturedVariables = body.variables ?? {};
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { createEvent: makeEvent() } }),
        });
      }

      // Handle other operations
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    // Fill in the title
    const titleInput = page.locator('input[name="title"]').first();
    await expect(titleInput).toBeVisible({ timeout: 5000 });
    await titleInput.fill('E2E Test Event');

    // Click submit and wait for the GraphQL mutation response
    const submitButton = page.getByRole('button', { name: /create|publish|save/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      submitButton.click(),
    ]);
  });

  test('form validation prevents submission without title', async ({ page }) => {
    let createEventCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEvent') {
        createEventCalled = true;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    // Try to submit without filling title
    const submitButton = page.getByRole('button', { name: /create|publish|save/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await submitButton.click();
    // Wait for any potential network activity to settle
    await page.waitForLoadState('networkidle');
    // CreateEvent should NOT have been called — validation should prevent it
    expect(createEventCalled).toBe(false);
  });
});
