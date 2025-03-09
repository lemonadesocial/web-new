import React from 'react';
import { generateCssVariables } from '$lib/utils/fetchers';
import { Button, Card, Spacer } from '$lib/components/core';
import clsx from 'clsx';

const themes = {
  default: {
    dark: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-woodsmoke-950)',
      '--color-primary-500': 'var(--color-violet-500)',
    },
    light: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-woodsmoke-950)',
    },
  },
  rose: {
    dark: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-rose-950)',
      '--color-forceground': 'var(--color-white)',
      '--color-primary-500': 'var(--color-rose-500)',
    },
    light: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-rose-50)',
      '--color-forceground': 'var(--color-black)',
    },
  },
  green: {
    dark: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-emerald-950)',
      '--color-forceground': 'var(--color-white)',
      '--color-primary-500': 'var(--color-emerald-500)',
    },
    light: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
      '--color-background': 'var(--color-emerald-50)',
      '--color-forceground': 'var(--color-black)',
    },
  },
};

export default function ThemeBuilder() {
  const [styled, setStyled] = React.useState<Record<string, string>>();
  const [mode] = React.useState<'light' | 'dark'>('dark');
  const [selected, setSelected] = React.useState('default');

  return (
    <>
      {styled && (
        <style jsx global>
          {`
            :root {
              ${generateCssVariables(styled)}
            }
          `}
        </style>
      )}

      <div className="flex flex-1 p-4 gap-3 max-w-[1080px] m-auto">
        {Object.entries(themes).map(([key, value]) => (
          <Card
            key={key}
            style={value[mode]}
            className={clsx(
              'border-transparent max-w-[240px] bg-background hover:bg-background hover:border-white',
              selected === key && 'border-white',
            )}
            onClick={() => {
              setStyled(value[mode]);
              setSelected(key);
            }}
          >
            <h3 className="text-xl font-semibold">Title</h3>
            <p className="line-clamp-2 text-sm font-medium">
              <span className="text-primary-500">Lorem ipsum</span> dolor sit amet, consectetur adipiscing elit. Aenean
              congue lorem a semper tristique. Nullam luctus quam ut posuere pulvinar. Curabitur sollicitudin ex et
              velit lacinia, suscipit pulvinar nulla semper. Aenean et vestibulum ligula, eget porta odio. Nam lacinia
              risus non luctus porta. Duis mollis nibh eu nisl tempus scelerisque. Aliquam velit mauris, faucibus eget
              eros at, efficitur sodales elit.
            </p>
            <Spacer className="h-4" />
            <div className="flex items-center gap-2">
              <Button size="sm">Subscribe</Button>
              <Button size="sm" icon="icon-dot" outlined />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
