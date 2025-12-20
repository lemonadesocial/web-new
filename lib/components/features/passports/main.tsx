'use client';
import Header from '$lib/components/layouts/header';
import { notFound } from 'next/navigation';
import { PASSPORT_CONFIG, PASSPORT_PROVIDER, PassportConfig } from './config';

interface Props {
  provider: PASSPORT_PROVIDER;
}

export function MainPassport({ provider }: Props) {
  if (!PASSPORT_CONFIG[provider]) return notFound();

  const PassportProvider = PASSPORT_CONFIG[provider].provider;
  return (
    <PassportProvider>
      <Content config={PASSPORT_CONFIG[provider]} />
    </PassportProvider>
  );
}

function Content({ config }: { config: PassportConfig }) {
  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-[1200px] h-full mx-auto flex flex-col-reverse md:flex-row gap-6 md:gap-18 p-4 md:p-0 overflow-auto">
          {config.content()}
        </div>
      </div>

      {config.footer()}
    </main>
  );
}
