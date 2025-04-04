import type { Metadata } from 'next';
import clsx from 'clsx';

import StyledJsxRegistry from './registry';
import './globals.css';
import fonts from './fonts';

export const metadata: Metadata = {
  title: 'Lemonade',
  description: 'Discover events & communities, find your tribe! Create your own Lemonade Stand to build and collaborate with creators across the world. #makelemonade',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={clsx('transition antialiased', fonts)}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
