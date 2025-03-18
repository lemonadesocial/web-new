import type { Metadata } from 'next';
// import { cookies } from 'next/headers';
import clsx from 'clsx';

import StyledJsxRegistry from './registry';
import './globals.css';
import fonts from './fonts';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

// TODO: will update default data-theme later from site config
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = await cookies();
  // const theme = cookieStore.get('theme');

  return (
    <html lang="en">
      <body className={clsx('transition antialiased', fonts)}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
