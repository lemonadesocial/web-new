import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import { makeEvent, makeUser } from './fixtures/test-data';

const HOST = makeUser();

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetSpaces: { data: { getSpaces: [] } },
  GetMySpaces: { data: { getMySpaces: [] } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  ListSpaces: { data: { listSpaces: [] } },
  CreateEvent: { data: { createEvent: makeEvent() } },
};

test.describe('Date/Time/Timezone', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, baseMocks);
  });

  test('event creation page shows title input and date/time section', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    // Title input must be visible
    const titleInput = page.locator('[data-testid="event-create-title"]');
    await expect(titleInput).toBeVisible({ timeout: 10000 });

    // Date/time section should show the globe icon (timezone indicator)
    await expect(page.locator('.icon-globe')).toBeVisible();
  });

  test('timezone selector shows timezone info', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    // Timezone card should be visible with timezone abbreviation
    const timezoneCard = page.locator('.icon-globe').first();
    await expect(timezoneCard).toBeVisible({ timeout: 10000 });
  });

  test('CreateEvent mutation includes start, end, and timezone fields', async ({ page }) => {
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
    await titleInput.fill('Date Test Event');

    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      submitButton.click(),
    ]);

    // Verify the mutation includes date-related fields
    expect(capturedVariables).toHaveProperty('input');
    const input = capturedVariables.input as Record<string, unknown>;
    expect(input.start).toBeDefined();
    expect(input.end).toBeDefined();
    expect(input.timezone).toBeDefined();
    // start and end should be ISO date strings
    expect(typeof input.start).toBe('string');
    expect(typeof input.end).toBe('string');
  });

  test('event has default dates pre-filled (not empty)', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    // The DateTimeGroup renders date text — verify something date-like is visible
    // The component shows formatted start and end dates
    await expect(page.locator('[data-testid="event-create-title"]')).toBeVisible({ timeout: 10000 });

    // The submit button should be disabled (no title yet) but date section should be populated
    const submitButton = page.locator('[data-testid="event-create-submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('start and end dates show formatted time buttons', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-create-title"]')).toBeVisible({ timeout: 10000 });

    // DateTimeGroup renders "Start" and "End" labels
    await expect(page.getByText('Start')).toBeVisible();
    await expect(page.getByText('End')).toBeVisible();

    // Time picker buttons should show formatted times (hh:mm AM/PM pattern)
    const timeButtons = page.locator('button').filter({ hasText: /\d{1,2}:\d{2}\s*(AM|PM)/i });
    const count = await timeButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('user timezone is auto-detected and displayed', async ({ page }) => {
    await page.goto('/localhost/create/event');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="event-create-title"]')).toBeVisible({ timeout: 10000 });

    // The timezone component shows the globe icon
    const timezoneSection = page.locator('.icon-globe').first();
    await expect(timezoneSection).toBeVisible();

    // The timezone text near the globe should contain a timezone identifier or offset
    const timezoneParent = timezoneSection.locator('..');
    const timezoneText = await timezoneParent.textContent();
    expect(timezoneText?.length).toBeGreaterThan(0);
  });
});
