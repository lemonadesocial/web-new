import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import localFont from 'next/font/local';
import clsx from 'clsx';

import StyledJsxRegistry from './registry';
import './globals.css';

const generalSans = localFont({ src: '../public/fonts/GeneralSans-Variable.ttf', variable: '--font-body' });
const classDisplay = localFont({ src: '../public/fonts/ClashDisplay-Variable.ttf', variable: '--font-title' });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  return (
    <html lang="en" data-theme={theme?.value || 'dark'}>
      <body className={clsx('transition antialiased overflow-hidden', generalSans.variable, classDisplay.variable)}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
