import { ASSET_PREFIX } from '$lib/utils/constants';
import { atom } from 'jotai';

export type ThemeValues = {
  theme?: 'minimal' | 'shader' | 'pattern';
  config: {
    mode?: 'dark' | 'light' | 'system';
    name?: string;
    fg?: string;
    bg?: string;
    class?: string;
  };
  font_title: string;
  font_body: string;
  variables: {
    font: Record<string, string>;
    dark?: Record<string, string | number>;
    light?: Record<string, string | number>;
    pattern?: Record<string, string>;
  };
};

export const defaultTheme: ThemeValues = {
  config: {
    mode: 'system',
    name: '',
    class: '',
    fg: 'violet',
    bg: 'violet',
  },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {},
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
  // 'custom',
];

const minimal = {
  image: `${ASSET_PREFIX}/assets/images/minimal.png`,
  name: 'Minimal',
  ui: {
    mode: 'system',
    config: { fg: colors, bg: colors },
    disabled: { fg: false, bg: false, style: true, mode: true },
  },
};

export const shaders = ['dreamy', 'summer', 'melon', 'barbie', 'sunset', 'ocean', 'forest', 'lavender'];

const shader = {
  image: `${ASSET_PREFIX}/assets/images/gradient.png`,
  name: 'Gradient',
  ui: {
    mode: 'all',
    config: {
      fg: colors,
      bg: shaders,
    },
    disabled: { fg: true, bg: false, style: true, mode: false },
  },
};

export const presets = {
  minimal,
  shader,
};

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
