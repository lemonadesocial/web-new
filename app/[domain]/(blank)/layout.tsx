import React from 'react';
import { Main } from './main';

export default async function Layout({ children }: React.PropsWithChildren) {
  return <Main>{children}</Main>;
}
