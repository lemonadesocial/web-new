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
  ListSpaces: { data: { listSpaces: [SPACE] } },
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

  test('create event page renders title input and submit button', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[data-testid="event-create-title"]');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await expect(titleInput).toHaveAttribute('placeholder', 'Event Title');

    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('submit button enables after typing title', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    const titleInput = page.locator('[data-testid="event-create-title"]');
    await expect(titleInput).toBeVisible({ timeout: 10000 });

    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await expect(submitButton).toBeDisabled();

    await titleInput.fill('E2E Test Event');
    await expect(submitButton).toBeEnabled();
  });

  test('CreateEvent mutation fires with correct title on submit', async ({ page }) => {
    let capturedVariables: Record<string, unknown> = {};

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEvent') {
        capturedVariables = body.variables ?? {};
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { createEvent: makeEvent() } }),
        });
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

    const titleInput = page.locator('[data-testid="event-create-title"]');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill('E2E Test Event');

    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      submitButton.click(),
    ]);

    expect(capturedVariables).toHaveProperty('input');
    const input = capturedVariables.input as Record<string, unknown>;
    expect(input.title).toBe('E2E Test Event');
    expect(input.start).toBeDefined();
    expect(input.end).toBeDefined();
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

    // Submit button should be disabled without a title
    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toBeDisabled();

    // CreateEvent should NOT have been called
    expect(createEventCalled).toBe(false);
  });
});
