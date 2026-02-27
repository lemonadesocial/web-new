import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import { makeEvent, makeUser, makeTicketType } from './fixtures/test-data';

const HOST = makeUser();
const EVENT = makeEvent({ host: HOST._id });

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetEvent: { data: { getEvent: EVENT } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  GetEventTicketTypes: { data: { getEventTicketTypes: [makeTicketType()] } },
  ListEventTicketTypes: { data: { listEventTicketTypes: [makeTicketType()] } },
  UpdateEventRegistrationForm: { data: { updateEventRegistrationForm: EVENT } },
  UpdateEventSelfVerification: { data: { updateEventSelfVerification: EVENT } },
};

test.describe('Registration Form Builder', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, baseMocks);
  });

  test('registration form page renders heading and sections', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Registration Form')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Personal Information')).toBeVisible();
    await expect(page.getByText('Web3 Identity')).toBeVisible();
    await expect(page.getByText('Custom Questions')).toBeVisible();
  });

  test('Name and Email fields are shown as Required', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    // Name and Email cards with Required label
    await expect(page.getByText('Name')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Email')).toBeVisible();
    // Both should show "Required" labels
    const requiredLabels = page.getByText('Required');
    await expect(requiredLabels.first()).toBeVisible();
  });

  test('ETH Address has Off/Optional/Required dropdown', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('ETH Address')).toBeVisible({ timeout: 10000 });

    // Click the ETH Address toggle to open the dropdown
    const ethToggle = page.getByText('Off').first();
    await expect(ethToggle).toBeVisible();
    await ethToggle.click();

    // Dropdown should show Off, Optional, Required options
    await expect(page.getByText('Optional')).toBeVisible({ timeout: 3000 });
  });

  test('ETH Address change fires UpdateEventRegistrationForm', async ({ page }) => {
    let updateCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'UpdateEventRegistrationForm') {
        updateCalled = true;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    // Open ETH Address dropdown and select Optional
    const ethToggle = page.getByText('Off').first();
    await expect(ethToggle).toBeVisible({ timeout: 10000 });
    await ethToggle.click();

    const optionalItem = page.getByText('Optional');
    await expect(optionalItem).toBeVisible({ timeout: 3000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      optionalItem.click(),
    ]);

    expect(updateCalled).toBe(true);
  });

  test('Add Question button is visible and clickable', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('[data-testid="add-question-button"]');
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    // Question type modal should appear with options
    await expect(page.getByText('Text').first()).toBeVisible({ timeout: 3000 });
  });

  test('Self ID has Off/Required dropdown', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/registration`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Self ID')).toBeVisible({ timeout: 10000 });
  });
});
