import { ASSET_PREFIX } from '$lib/utils/constants';

export type ColorPreset = Record<string, { light: string; dark: string; default: string }>;

const colors: ColorPreset = {
  violet: { light: 'bg-violet-50', default: 'bg-violet-500', dark: 'bg-violet-950' },
  red: { light: 'bg-red-50', default: 'bg-red-500', dark: 'bg-red-950' },
  orange: { light: 'bg-orange-50', default: 'bg-orange-500', dark: 'bg-orange-950' },
  amber: { light: 'bg-amber-50', default: 'bg-amber-500', dark: 'bg-amber-950' },
  yellow: { light: 'bg-yellow-50', default: 'bg-yellow-500', dark: 'bg-yellow-950' },
  lime: { light: 'bg-lime-50', default: 'bg-lime-500', dark: 'bg-lime-950' },
  green: { light: 'bg-green-50', default: 'bg-green-500', dark: 'bg-green-950' },
  emerald: { light: 'bg-emerald-50', default: 'bg-emerald-500', dark: 'bg-emerald-950' },
  teal: { light: 'bg-teal-50', default: 'bg-teal-500', dark: 'bg-teal-950' },
  cyan: { light: 'bg-cyan-50', default: 'bg-cyan-500', dark: 'bg-cyan-950' },
  sky: { light: 'bg-sky-50', default: 'bg-sky-500', dark: 'bg-sky-950' },
  blue: { light: 'bg-blue-50', default: 'bg-blue-500', dark: 'bg-blue-950' },
  indigo: { light: 'bg-indigo-50', default: 'bg-indigo-500', dark: 'bg-indigo-950' },
  purple: { light: 'bg-purple-50', default: 'bg-purple-500', dark: 'bg-purple-950' },
  fuchsia: { light: 'bg-fuchsia-50', default: 'bg-fuchsia-500', dark: 'bg-fuchsia-950' },
  pink: { light: 'bg-pink-50', default: 'bg-pink-500', dark: 'bg-pink-950' },
  rose: { light: 'bg-rose-50', default: 'bg-rose-500', dark: 'bg-rose-950' },
};

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

export const defaultColorPreset = {
  font: {
    '--font-title': 'var(--font-class-display)',
    '--font-body': 'var(--font-general-sans)',
  },
  dark: {
    '--color-background': 'var(--color-woodsmoke-950)',
    '--color-accent-500': 'var(--color-violet-500)',
  },
  light: {
    '--color-background': 'var(--color-woodsmoke-50)',
    '--color-accent-500': 'var(--color-violet-500)',
  },
};

export type PresetKey = 'minimal' | 'pattern';

type Presets = {
  [k in PresetKey]: { image: string; background: boolean; colors: ColorPreset; assets?: string[] };
};

export const presets: Presets = {
  minimal: {
    image: `${ASSET_PREFIX}/assets/images/minimal.png`,
    background: true,
    colors,
  },
  pattern: {
    image: `${ASSET_PREFIX}/assets/images/pattern.png`,
    colors,
    background: false,
    assets: ['cross', 'hypnotic', 'plus', 'polkadot', 'wave', 'zigzag'],
  },
  // gradient: {
  //   image: GradientPreview,
  //   colors: {},
  // },
};

export function getRandomFont(type: 'title' | 'body'): string {
  const bodyFonts = Object.keys(fonts[type]);
  const randomIndex = Math.floor(Math.random() * bodyFonts.length);
  return fonts.body[bodyFonts[randomIndex]];
}

export function getRandomColor(): [string, { light: string; dark: string; default: string }] {
  const colorKeys = Object.keys(colors);
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  const randomColorKey = colorKeys[randomIndex];
  return [randomColorKey, colors[randomColorKey]];
}
