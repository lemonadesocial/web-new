import localFont from 'next/font/local';
import { twMerge } from 'tailwind-merge';

const generalSans = localFont({
  display: 'swap',
  src: '../public/assets/fonts/GeneralSans-Variable.ttf',
  variable: '--font-general-sans',
});

const classDisplay = localFont({
  display: 'swap',
  src: '../public/assets/fonts/ClashDisplay-Variable.ttf',
  variable: '--font-class-display',
});

const classDisplayBold = localFont({
  display: 'swap',
  src: '../public/assets/fonts/ClashDisplay-Bold.ttf',
  variable: '--font-class-display-bold',
});

// title fonts

const aktura = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Aktura-Regular.otf',
  variable: '--font-aktura',
});

const array = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Array-Bold.otf',
  variable: '--font-aktura',
});

const sarpanch = localFont({
  src: '../public/assets/fonts/title/Sarpanch-Black.ttf',
  variable: '--font-sarpanch',
});

const chillax = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Chillax-Semibold.otf',
  variable: '--font-chillax',
});

const chubbo = localFont({
  src: '../public/assets/fonts/title/Chubbo-Bold.otf',
  variable: '--font-chubbo',
});

const comico = localFont({
  src: '../public/assets/fonts/title/Comico-Regular.otf',
  variable: '--font-comico',
});

const khand = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Khand-Bold.otf',
  variable: '--font-khand',
});

const melodrama = localFont({
  src: '../public/assets/fonts/title/Melodrama-Bold.otf',
  variable: '--font-melodrama',
});

const poppins = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Poppins-SemiBold.otf',
  variable: '--font-poppins',
});

const quilon = localFont({
  src: '../public/assets/fonts/title/Quilon-Bold.otf',
  variable: '--font-quilon',
});

const sharpie = localFont({
  src: '../public/assets/fonts/title/Sharpie-Extrabold.otf',
  variable: '--font-sharpie',
});

const rubik_dirt = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/RubikDirt-Regular.ttf',
  variable: '--font-rubik-dirt',
});

const stencil = localFont({
  src: '../public/assets/fonts/title/BespokeStencil-Bold.otf',
  variable: '--font-stencil',
});

const tanker = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Tanker-Regular.otf',
  variable: '--font-tanker',
});

const technor = localFont({
  src: '../public/assets/fonts/title/Technor-Semibold.otf',
  variable: '--font-technor',
});

const zina = localFont({
  src: '../public/assets/fonts/title/Zina-Regular.otf',
  variable: '--font-zina',
});

const zodiak = localFont({
  display: 'swap',
  src: '../public/assets/fonts/title/Zodiak-Bold.otf',
  variable: '--font-zodiak',
});

// body fonts
const archivo = localFont({
  src: '../public/assets/fonts/body/Archivo-Regular.otf',
  variable: '--font-archivo',
});

const azeret_mono = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/AzeretMono-Regular.otf',
  variable: '--font-azeret-mono',
});

const ranade = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/Ranade-Regular.otf',
  variable: '--font-ranade',
});

const sentient = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/Sentient-Regular.otf',
  variable: '--font-sentient',
});

const spline_sans = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/SplineSans-Regular.otf',
  variable: '--font-spline-sans',
});

const supreme = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/Supreme-Medium.otf',
  variable: '--font-supreme',
});

const synonym = localFont({
  display: 'swap',
  src: '../public/assets/fonts/body/Synonym-Medium.otf',
  variable: '--font-synonym',
});

const multitypePixel = localFont({
  display: 'swap',
  src: '../public/assets/fonts/MultiTypePixel-DisplayBold.otf',
  variable: '--font-multitype-pixel',
});

export default twMerge(
  generalSans.variable,
  classDisplay.variable,
  classDisplayBold.variable,
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
  multitypePixel.variable,
);
