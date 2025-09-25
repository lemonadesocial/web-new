export const LEMONHEAD_CHAIN_ID = [process.env.NEXT_PUBLIC_APP_ENV, process.env.APP_ENV].includes('production')
  ? '1'
  : '11155111';

interface LemonheadColor {
  bg: string;
  fg: string;
  overlay: string;
}

export const LEMONHEAD_COLORS: Record<string, LemonheadColor> = {
  violet: { bg: '#ddd6fe', fg: '#8b5cf6', overlay: '#d8b4fe80' },
  fuchsia: { bg: '#f5d0fe', fg: '#d946ef', overlay: '#f0abfc80' },
  pink: { bg: '#fbcfe8', fg: '#ec4899', overlay: '#f9a8d480' },
  red: { bg: '#fee2e2', fg: '#ef4444', overlay: '#fca5a580' },
  orange: { bg: '#ffedd5', fg: '#f97316', overlay: '#fcd34d80' },
  yellow: { bg: '#fef9c3', fg: '#eab308', overlay: '#fde04780' },
  lime: { bg: '#ecfccb', fg: '#84cc16', overlay: '#bef26480' },
  green: { bg: '#dcfce7', fg: '#22c55e', overlay: '#86efad80' },
  teal: { bg: '#ccfbf1', fg: '#14b8a6', overlay: '#5eead480' },
  cyan: { bg: '#cffafe', fg: '#06b6d4', overlay: '#67e8f980' },
  blue: { bg: '#bfdbfe', fg: '#3b82f6', overlay: '#93c5fd80' },
  indigo: { bg: '#e0e7ff', fg: '#6366f1', overlay: '#a5b4fc80' },
};
