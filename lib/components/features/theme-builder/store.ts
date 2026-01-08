import { ASSET_PREFIX } from '$lib/utils/constants';
import { atom } from 'jotai';

export type ThemeValues = {
  theme?: 'default' | 'minimal' | 'shader' | 'pattern' | 'image' | 'passport';
  config: {
    mode?: 'dark' | 'light' | 'auto';
    name?: string;
    color?: string;
    class?: string;
    image?: {
      name: string;
      _id: string;
      url: string;
    };
    effect?: {
      name: string;
      type?: 'video' | 'float';
      url?: string;
      emoji?: string;
    };
  };
  font_title: string;
  font_body: string;
  variables: {
    font?: Record<string, string>;
    custom?: Record<string, string>;
    dark?: Record<string, string | number>;
    light?: Record<string, string | number>;
    pattern?: Record<string, string>;
  };
};

export const defaultTheme: ThemeValues = {
  theme: 'default',
  config: {
    mode: 'dark',
    color: '',
    name: '',
    class: '',
    effect: {
      name: '',
      url: '',
      emoji: '',
    },
  },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {},
    custom: {},
    light: {},
    dark: {},
    pattern: {},
  },
};

export const themeAtom = atom<ThemeValues>(defaultTheme);

export const fonts: { title: Record<string, string>; body: Record<string, string> } = {
  title: {
    default: 'var(--font-class-display)',
    aktura: 'var(--font-aktura)',
    array: 'var(--font-array)',
    basePixel: 'var(--font-base-pixel)',
    sarpanch: 'var(--font-sarpanch)',
    chillax: 'var(--font-chillax)',
    chubbo: 'var(--font-chubbo)',
    comico: 'var(--font-comico)',
    khand: 'var(--font-khand)',
    melodrama: 'var(--font-melodrama)',
    poppins: 'var(--font-poppins)',
    quilon: 'var(--font-quilon)',
    sharpie: 'var(--font-sharpie)',
    rubik_dirt: 'var(--font-rubik-dirt)',
    stencil: 'var(--font-stencil)',
    tanker: 'var(--font-tanker)',
    technor: 'var(--font-technor)',
    zina: 'var(--font-zina)',
    zodiak: 'var(--font-zodiak)',
  },
  body: {
    default: 'var(--font-general-sans)',
    archivo: 'var(--font-archivo)',
    azeret_mono: 'var(--font-azeret-mono)',
    antonio: 'var(--font-antonio)',
    ranade: 'var(--font-ranade)',
    sentient: 'var(--font-sentient)',
    spline_sans: 'var(--font-spline-sans)',
    supreme: 'var(--font-supreme)',
    synonym: 'var(--font-synonym)',
  },
};

export const colors = [
  'violet',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

type ThemePresetType = {
  image: string;
  name: string;
  ui?: {
    mode?: 'all' | 'system' | 'dark' | 'light';
    config?: { colors?: string[]; shaders?: Array<{ name: string; accent: string }> };
    disabled?: {
      color?: boolean;
      effect?: boolean;
      /** @deprecated fg - bg */
      fg?: boolean;
      bg?: boolean;
      style?: boolean;
      mode?: boolean;
    };
  };
};

const minimal: ThemePresetType = {
  image: `${ASSET_PREFIX}/assets/images/minimal.png`,
  name: 'Minimal',
  ui: {
    mode: 'system',
    config: { colors },
    disabled: {
      style: true,
    },
  },
};

export const shaders = [
  { name: 'dreamy', accent: 'violet' },
  { name: 'summer', accent: 'sky' },
  { name: 'melon', accent: 'orange' },
  { name: 'barbie', accent: 'pink' },
  { name: 'sunset', accent: 'orange' },
  { name: 'ocean', accent: 'blue' },
  { name: 'forest', accent: 'green' },
  { name: 'lavender', accent: 'purple' },
];

const shader: ThemePresetType = {
  image: `${ASSET_PREFIX}/assets/images/gradient.png`,
  name: 'Gradient',
  ui: {
    mode: 'all',
    config: { colors, shaders },
    disabled: { color: true },
  },
};

export const patterns = ['cross', 'hypnotic', 'plus', 'polkadot', 'wave', 'zigzag'];
const pattern: ThemePresetType = {
  image: `${ASSET_PREFIX}/assets/images/pattern.png`,
  name: 'Pattern',
  ui: {
    disabled: {},
  },
};

export const emojis: Record<string, { emoji: string; type: 'video' | 'float'; label: string; url?: string }> = {
  rabbit: { emoji: '🐇', type: 'video', label: 'Rabbit', url: `${ASSET_PREFIX}/assets/video/bunny` },
  football: { emoji: '🏈', type: 'float', label: 'Football' },
  beer_pong: { emoji: '🥤', type: 'video', label: 'Beer Pong', url: `${ASSET_PREFIX}/assets/video/beer_pong` },
  heart: { emoji: '❤️', type: 'float', label: 'Heart' },
  party: { emoji: '🥳', type: 'float', label: 'Party' },
  glasses: { emoji: '😎', type: 'float', label: 'Glasses' },
  clover: { emoji: '🍀', type: 'float', label: 'Clover' },
  pumpkin: { emoji: '🎃', type: 'float', label: 'Pumpkin' },
  lollipop: { emoji: '🍭', type: 'float', label: 'Lollipop' },
  earth: { emoji: '🌎', type: 'float', label: 'Earth' },
  fire: { emoji: '🔥', type: 'float', label: 'Fire' },
  ghost: { emoji: '👻', type: 'float', label: 'Ghost' },
  dragon: { emoji: '🐲', type: 'float', label: 'Dragon' },
  cocktail: { emoji: '🍸', type: 'float', label: 'Cocktail' },
  basketball: { emoji: '🏀', type: 'float', label: 'Basketball' },
  demon: { emoji: '😈', type: 'float', label: 'Demon' },
  alien: { emoji: '👽', type: 'float', label: 'Alien' },
  skull: { emoji: '💀', type: 'float', label: 'Skull' },
};

const image: ThemePresetType = {
  image: `${ASSET_PREFIX}/assets/images/image.png`,
  name: 'Image',
  ui: {
    disabled: { mode: true },
  },
};

export const presets = {
  minimal,
  shader,
  pattern,
  image,
};

export const modes = [
  { mode: 'light', icon: 'icon-sunny', label: 'Light' },
  { mode: 'dark', icon: 'icon-clear-night', active: 'text-blue-400', label: 'Dark' },
  { mode: 'auto', icon: 'icon-dark-theme-filled', label: 'Auto' },
];

export function getRandomFont(type: 'title' | 'body') {
  const keys = Object.keys(fonts[type]);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const key = keys[randomIndex];
  return [key, fonts[type][key]];
}

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export function getThemeName(theme: ThemeValues) {
  return !theme.theme || theme.theme === 'default' ? 'minimal' : theme.theme;
}
