/**
 * Factory functions for mock GraphQL response objects.
 * All factories return minimal valid objects with sensible defaults.
 * Pass overrides to customize specific fields.
 */

export function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'user-host-001',
    name: 'Test Host',
    email: 'host@test.com',
    username: 'testhost',
    image_avatar: null,
    wallets: [],
    ...overrides,
  };
}

export function makeGuestUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'user-guest-001',
    name: 'Test Guest',
    email: 'guest@test.com',
    username: 'testguest',
    image_avatar: null,
    wallets: [],
    ...overrides,
  };
}

export function makeEvent(overrides: Record<string, unknown> = {}) {
  const now = new Date();
  const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  return {
    _id: 'event-001',
    title: 'Test Event',
    shortid: 'test-event-123',
    slug: 'test-event',
    description: 'A test event for E2E testing',
    start: start.toISOString(),
    end: end.toISOString(),
    timezone: 'America/New_York',
    private: false,
    virtual: false,
    virtual_url: null,
    approval_required: false,
    guest_limit: null,
    guest_limit_per: null,
    ticket_limit: 100,
    ticket_limit_per: null,
    cost: '0',
    currency: 'USD',
    address: {
      title: 'Test Venue',
      street_1: '123 Test St',
      city: 'New York',
      region: 'NY',
      country: 'US',
      latitude: 40.7128,
      longitude: -74.006,
    },
    host_expanded: makeUser(),
    cohosts_expanded: [],
    speaker_users_expanded: [],
    new_new_photos_expanded: [],
    published: true,
    ...overrides,
  };
}

export function makeTicketType(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'ticket-type-001',
    title: 'General Admission',
    description: '',
    active: true,
    private: false,
    limited: false,
    ticket_limit: null,
    ticket_limit_per: null,
    prices: [],
    default: false,
    category: null,
    category_expanded: null,
    photos_expanded: [],
    ...overrides,
  };
}

export function makeFiatPrice(overrides: Record<string, unknown> = {}) {
  return {
    cost: '2500',
    currency: 'USD',
    network: null,
    payment_accounts_expanded: [
      {
        _id: 'pa-stripe-001',
        provider: 'stripe',
        type: 'direct',
        account_info: {
          currency_map: {
            USD: { decimals: 2 },
            EUR: { decimals: 2 },
          },
        },
      },
    ],
    ...overrides,
  };
}

export function makeCryptoPrice(overrides: Record<string, unknown> = {}) {
  return {
    cost: '1000000',
    currency: 'USDC',
    network: 'ethereum',
    payment_accounts_expanded: [
      {
        _id: 'pa-crypto-001',
        provider: 'ethereum',
        type: 'direct',
        account_info: {
          currency_map: {
            USDC: { decimals: 6 },
          },
        },
      },
    ],
    ...overrides,
  };
}

export function makeGuest(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'guest-001',
    user_expanded: makeGuestUser(),
    ticket_expanded: {
      _id: 'ticket-001',
      shortid: 'tkt-001',
      type_expanded: makeTicketType(),
    },
    join_request_expanded: {
      _id: 'jr-001',
      state: 'approved',
      created_at: new Date().toISOString(),
    },
    checkin_expanded: null,
    ...overrides,
  };
}

export function makePendingGuest(overrides: Record<string, unknown> = {}) {
  return makeGuest({
    _id: 'guest-pending-001',
    user_expanded: makeGuestUser({ _id: 'user-pending-001', name: 'Pending Guest', email: 'pending@test.com' }),
    join_request_expanded: {
      _id: 'jr-pending-001',
      state: 'pending',
      created_at: new Date().toISOString(),
    },
    ...overrides,
  });
}

export function makeCheckedInGuest(overrides: Record<string, unknown> = {}) {
  return makeGuest({
    _id: 'guest-checkedin-001',
    user_expanded: makeGuestUser({ _id: 'user-ci-001', name: 'Checked In Guest', email: 'checkedin@test.com' }),
    checkin_expanded: {
      _id: 'ci-001',
      created_at: new Date().toISOString(),
    },
    ...overrides,
  });
}

export function makeEmailSetting(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'email-001',
    type: 'custom',
    custom_subject_html: 'Test Email Subject',
    custom_body_html: '<p>Test email body</p>',
    recipient_types: ['registration'],
    recipient_filters: {},
    scheduled_at: null,
    sent_at: null,
    owner_expanded: makeUser(),
    ...overrides,
  };
}

export function makeRegistrationQuestion(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'question-001',
    question: 'What brings you to this event?',
    type: 'text',
    required: false,
    options: [],
    ...overrides,
  };
}

export function makeGuestStatistics(overrides: Record<string, unknown> = {}) {
  return {
    total: 50,
    going: 30,
    pending_approval: 5,
    pending_invite: 10,
    declined: 3,
    checked_in: 2,
    ...overrides,
  };
}

export function makeSpace(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'space-001',
    title: 'Test Community',
    slug: 'test-community',
    ...overrides,
  };
}
