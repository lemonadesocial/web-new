export const FiatCurrencyCodes = ['AUD', 'CAD', 'EUR', 'GBP', 'INR', 'USD'] as const;
export type Currency = (typeof FiatCurrencyCodes)[number];
