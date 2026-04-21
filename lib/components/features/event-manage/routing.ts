export const eventManageTabs = [
  'overview',
  'guests',
  'registration',
  'payments',
  'blasts',
  'insights',
  'more',
] as const;

export type EventManageTab = (typeof eventManageTabs)[number];

export const defaultEventManageTab: EventManageTab = 'overview';

const eventManageTabSet = new Set<EventManageTab>(eventManageTabs);

export const eventManagePaymentTabs = ['direct-ledger', 'settings'] as const;

export type EventManagePaymentTab = (typeof eventManagePaymentTabs)[number];

export const defaultEventManagePaymentTab: EventManagePaymentTab = 'direct-ledger';

const eventManagePaymentTabSet = new Set<EventManagePaymentTab>(eventManagePaymentTabs);

export function getEventManageTab(tab: string | null | undefined): EventManageTab {
  return tab && eventManageTabSet.has(tab as EventManageTab)
    ? (tab as EventManageTab)
    : defaultEventManageTab;
}

export function getEventManagePaymentTab(tab: string | null | undefined): EventManagePaymentTab {
  return tab && eventManagePaymentTabSet.has(tab as EventManagePaymentTab)
    ? (tab as EventManagePaymentTab)
    : defaultEventManagePaymentTab;
}

interface EventManageUrlOptions {
  tab?: EventManageTab;
  paymentTab?: EventManagePaymentTab;
}

export function getEventManageUrl(shortid: string, options: EventManageUrlOptions = {}) {
  const {
    tab = defaultEventManageTab,
    paymentTab = defaultEventManagePaymentTab,
  } = options;
  const searchParams = new URLSearchParams();

  if (tab !== defaultEventManageTab) {
    searchParams.set('tab', tab);
  }

  if (tab === 'payments' && paymentTab !== defaultEventManagePaymentTab) {
    searchParams.set('paymentsTab', paymentTab);
  }

  const query = searchParams.toString();

  return query ? `/e/manage/${shortid}?${query}` : `/e/manage/${shortid}`;
}
