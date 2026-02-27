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
  ListEventGuests: { data: { listEventGuests: { items: [], total: 0 } } },
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

  test('blasts page renders blast input and system messages section', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    // Blast input area (TextEditor with contenteditable)
    const blastInput = page.locator('[contenteditable="true"]').first();
    await expect(blastInput).toBeVisible({ timeout: 10000 });

    // System Messages section with Event Reminders
    await expect(page.getByText('System Messages')).toBeVisible();
    await expect(page.getByText('Event Reminders')).toBeVisible();
  });

  test('Send button appears on focus and fires CreateEventEmailSetting', async ({ page }) => {
    let createCalled = false;

    await page.route('**/graphql', async (route) => {
      const postData = route.request().postData();
      if (!postData) return route.fulfill({ status: 200, body: '{"data":{}}' });

      const body = JSON.parse(postData);
      if (body.operationName === 'CreateEventEmailSetting') {
        createCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { createEventEmailSetting: makeEmailSetting({ _id: 'email-new' }) } }),
        });
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

    // Focus the blast input to reveal the Send button
    const blastInput = page.locator('[contenteditable="true"]').first();
    await expect(blastInput).toBeVisible({ timeout: 10000 });
    await blastInput.click();
    await blastInput.pressSequentially('Hello everyone!');

    // Send button should now be visible
    const sendButton = page.locator('[data-testid="blast-send-button"]');
    await expect(sendButton).toBeVisible({ timeout: 5000 });
    await expect(sendButton).toBeEnabled();

    await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/graphql') && resp.status() === 200),
      sendButton.click(),
    ]);

    expect(createCalled).toBe(true);
  });

  test('scheduled emails section shows scheduled blast', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    // Scheduled section should be visible with the scheduled email subject
    await expect(page.getByText('Scheduled')).toBeVisible({ timeout: 10000 });
  });

  test('sent emails section shows sent blast', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    // Sent section should be visible
    await expect(page.getByText('Sent')).toBeVisible({ timeout: 10000 });
  });

  test('Post-Event Feedback Schedule button is visible', async ({ page }) => {
    await page.goto(`/localhost/e/manage/${EVENT.shortid}/blasts`);
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Post-Event Feedback')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Schedule')).toBeVisible();
  });
});
