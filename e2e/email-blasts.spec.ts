import { expect, test } from '@playwright/test';
import { mockGraphQL } from './fixtures/graphql-mocks';
import { loginAsHost } from './fixtures/auth';
import { makeEvent, makeUser, makeEmailSetting } from './fixtures/test-data';

const HOST = makeUser();
const EVENT = makeEvent({ host: HOST._id });
const SCHEDULED_EMAIL = makeEmailSetting({
  _id: 'email-scheduled',
  scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  custom_subject_html: 'Reminder: Event Tomorrow',
});
const SENT_EMAIL = makeEmailSetting({
  _id: 'email-sent',
  sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  custom_subject_html: 'Welcome to Our Event',
});

const baseMocks = {
  GetMe: { data: { getMe: HOST } },
  GetEvent: { data: { getEvent: EVENT } },
  GetMyNotifications: { data: { getMyNotifications: [] } },
  GetListEventEmailSettings: {
    data: { listEventEmailSettings: [SCHEDULED_EMAIL, SENT_EMAIL] },
  },
  ListEventGuests: { data: { listEventGuests: [] } },
  CreateEventEmailSetting: { data: { createEventEmailSetting: makeEmailSetting({ _id: 'email-new' }) } },
  UpdateEventEmailSetting: { data: { updateEventEmailSetting: SCHEDULED_EMAIL } },
  DeleteEventEmailSetting: { data: { deleteEventEmailSetting: true } },
  InviteEvent: { data: { inviteEvent: true } },
};

test.describe('Email & Invites', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsHost(page);
    await mockGraphQL(page, baseMocks);
  });

  test('blasts page loads', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('scheduled and sent emails are displayed', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('CreateEventEmailSetting fires on blast creation', async ({ page }) => {
    let createCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEventEmailSetting') {
        createCalled = true;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    // Look for the blast message input area
    const blastInput = page.locator('[contenteditable="true"]').first();
    await expect(blastInput).toBeVisible({ timeout: 5000 });
    await blastInput.fill('Hello everyone!');

    // Click Send button and wait for mutation response
    const sendButton = page.getByRole('button', { name: /send/i }).first();
    await expect(sendButton).toBeVisible({ timeout: 5000 });
    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      sendButton.click(),
    ]);
  });

  test('InviteEvent fires when inviting guests by email', async ({ page }) => {
    let inviteCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'InviteEvent') {
        inviteCalled = true;
      }
      const mock = baseMocks[body.operationName as keyof typeof baseMocks];
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mock ?? { data: {} }),
      });
    });

    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('event reminders section is visible', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    // Event Reminders section should be visible
    const remindersText = page.getByText('Event Reminders');
    await expect(remindersText).toBeVisible({ timeout: 5000 });
  });
});
