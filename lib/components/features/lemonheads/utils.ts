export const LEMONHEAD_CHAIN_ID = [process.env.NEXT_PUBLIC_APP_ENV, process.env.APP_ENV].includes('production')
  ? '1'
  : '11155111';

interface LemonheadColor {
  bg: string;
  fg: string;
}

export const LEMONHEAD_COLORS: Record<string, LemonheadColor> = {
  violet: { bg: '#ddd6fe', fg: '#8b5cf6' },
  fuchsia: { bg: '#f5d0fe', fg: '#d946ef' },
  pink: { bg: '#fbcfe8', fg: '#ec4899' },
  red: { bg: '#fee2e2', fg: '#ef4444' },
  orange: { bg: '#ffedd5', fg: '#f97316' },
  yellow: { bg: '#fef9c3', fg: '#eab308' },
  lime: { bg: '#ecfccb', fg: '#84cc16' },
  green: { bg: '#dcfce7', fg: '#22c55e' },
  teal: { bg: '#ccfbf1', fg: '#14b8a6' },
  cyan: { bg: '#cffafe', fg: '#06b6d4' },
  blue: { bg: '#bfdbfe', fg: '#3b82f6' },
  indigo: { bg: '#e0e7ff', fg: '#6366f1' },
};
