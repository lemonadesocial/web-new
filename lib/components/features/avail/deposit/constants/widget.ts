export const SCROLL_THRESHOLD_PX = 50;
export const PROGRESS_BAR_ANIMATION_DELAY_MS = 50;
export const PROGRESS_BAR_EXIT_DURATION_MS = 300;

// Timing
export const LOADING_SKELETON_DELAY_MS = 600;
export const CHARACTER_ANIMATION_DURATION_MS = 400;
export const SHINE_ANIMATION_DURATION_MS = 500;
export const SIMULATION_POLL_INTERVAL_MS = 15000;

// Safety & Calculations
export const BALANCE_SAFETY_MARGIN = 0.92; // Keep 8% as safety buffer
export const DEFAULT_TOKEN_DECIMALS = 6;

// Layout
export const CHAIN_ITEM_HEIGHT_PX = 49;
export const VERTICAL_LINE_TOP_OFFSET_PX = 48;
export const MAX_INPUT_WIDTH_PX = 300;

// Asset Selection
export const STABLECOIN_SYMBOLS = ["USDC", "USDT", "DAI", "TUSD", "USDP"] as const;

// Animation classes (for reference, actual classes defined in CSS)
export const ANIMATION_CLASSES = {
  slideInFromRight: "animate-slide-in-from-right",
  slideInFromLeft: "animate-slide-in-from-left",
  digitIn: "animate-digit-in",
  glareShine: "animate-glare-shine",
  transferWave: "animate-transfer-wave",
  progress: "animate-progress",
} as const;
