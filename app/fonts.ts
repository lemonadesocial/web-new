import localFont from 'next/font/local';
import { twMerge } from 'tailwind-merge';

const generalSans = localFont({
  src: '../public/fonts/GeneralSans-Variable.ttf',
  variable: '--font-general-sans',
});

const classDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.ttf',
  variable: '--font-class-display',
});

// title fonts

const aktura = localFont({
  src: '../public/fonts/title/Aktura-Regular.otf',
  variable: '--font-aktura',
});

const array = localFont({
  src: '../public/fonts/title/Array-Bold.otf',
  variable: '--font-aktura',
});

const sarpanch = localFont({
  src: '../public/fonts/title/Sarpanch-Black.ttf',
  variable: '--font-sarpanch',
});

const chillax = localFont({
  src: '../public/fonts/title/Chillax-Semibold.otf',
  variable: '--font-chillax',
});

const chubbo = localFont({
  src: '../public/fonts/title/Chubbo-Bold.otf',
  variable: '--font-chubbo',
});

const comico = localFont({
  src: '../public/fonts/title/Comico-Regular.otf',
  variable: '--font-comico',
});

const khand = localFont({
  src: '../public/fonts/title/Khand-Bold.otf',
  variable: '--font-khand',
});

const melodrama = localFont({
  src: '../public/fonts/title/Melodrama-Bold.otf',
  variable: '--font-melodrama',
});

const poppins = localFont({
  src: '../public/fonts/title/Poppins-SemiBold.otf',
  variable: '--font-poppins',
});

const quilon = localFont({
  src: '../public/fonts/title/Quilon-Bold.otf',
  variable: '--font-quilon',
});

const sharpie = localFont({
  src: '../public/fonts/title/Sharpie-Extrabold.otf',
  variable: '--font-sharpie',
});

const rubik_dirt = localFont({
  src: '../public/fonts/title/RubikDirt-Regular.ttf',
  variable: '--font-rubik-dirt',
});

const stencil = localFont({
  src: '../public/fonts/title/BespokeStencil-Bold.otf',
  variable: '--font-stencil',
});

const tanker = localFont({
  src: '../public/fonts/title/Tanker-Regular.otf',
  variable: '--font-tanker',
});

const technor = localFont({
  src: '../public/fonts/title/Technor-Semibold.otf',
  variable: '--font-technor',
});

const zina = localFont({
  src: '../public/fonts/title/Zina-Regular.otf',
  variable: '--font-zina',
});

const zodiak = localFont({
  src: '../public/fonts/title/Zodiak-Bold.otf',
  variable: '--font-zodiak',
});

// body fonts
const archivo = localFont({
  src: '../public/fonts/body/Archivo-Regular.otf',
  variable: '--font-archivo',
});

const azeret_mono = localFont({
  src: '../public/fonts/body/AzeretMono-Regular.otf',
  variable: '--font-azeret-mono',
});

const ranade = localFont({
  src: '../public/fonts/body/Ranade-Regular.otf',
  variable: '--font-ranade',
});

const sentient = localFont({
  src: '../public/fonts/body/Sentient-Regular.otf',
  variable: '--font-sentient',
});

const spline_sans = localFont({
  src: '../public/fonts/body/SplineSans-Regular.otf',
  variable: '--font-spline-sans',
});

const supreme = localFont({
  src: '../public/fonts/body/Supreme-Medium.otf',
  variable: '--font-supreme',
});

const synonym = localFont({
  src: '../public/fonts/body/Synonym-Medium.otf',
  variable: '--font-synonym',
});

export default twMerge(
  generalSans.variable,
  classDisplay.variable,
  aktura.variable,
  array.variable,
  sarpanch.variable,
  chillax.variable,
  chubbo.variable,
  comico.variable,
  khand.variable,
  melodrama.variable,
  poppins.variable,
  quilon.variable,
  sharpie.variable,
  rubik_dirt.variable,
  stencil.variable,
  tanker.variable,
  technor.variable,
  zina.variable,
  zodiak.variable,
  //body fonts
  archivo.variable,
  azeret_mono.variable,
  ranade.variable,
  sentient.variable,
  spline_sans.variable,
  supreme.variable,
  synonym.variable,
);
