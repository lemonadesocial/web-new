'use client';
import React from 'react';
import { generateCssVariables } from '$lib/utils/fetchers';
import clsx from 'clsx';
import { ShaderGradient } from './shader';
import { ThemeValues } from './store';
import { EmojiAnimate } from './emoji';

export function ThemeGenerator({ data }: { data: ThemeValues }) {
  const [mode, setMode] = React.useState(data.config.mode);

  React.useEffect(() => {
    if (data.config.mode === 'auto' && window.matchMedia) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) setMode('dark');
      else setMode('light');

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const isDarkMode = event.matches;
        if (data.config.mode === 'auto') {
          if (isDarkMode) setMode('dark');
          else setMode('light');
        }
      });
    }
  }, [data.config.mode]);

  return (
    <>
      {data?.variables && (
        <style global jsx>
          {`
            body {
              ${data.variables.font && generateCssVariables(data.variables.font)}
            }

            :root {
              ${data.variables?.custom && generateCssVariables(data.variables?.custom)}
              ${data.variables.pattern && generateCssVariables(data.variables.pattern)}
            }
          `}
        </style>
      )}

      {data?.theme && (
        <div
          className={clsx(
            'background',
            data?.theme,
            data.config.name,
            // allow bg for emoji
            data?.config?.color,
            data?.config?.class,
            mode,
          )}
        >
          {data?.theme === 'shader' && <ShaderGradient mode={mode} />}

          {data.config?.effect?.type === 'video' && data?.config?.effect?.url && (
            <div key={data.config.effect.name}>
              <video className="min-w-full min-h-full fixed hidden md:block inset-0" autoPlay loop playsInline muted>
                <source src={data?.config?.effect?.url + '_web.mov'} type="video/mp4;codecs=hvc1"></source>
                <source src={data?.config?.effect?.url + '_web.webm'} type="video/webm"></source>
              </video>
              <video className="min-w-full min-h-full fixed inset-0 md:hidden" autoPlay loop playsInline muted>
                <source src={data?.config?.effect?.url + '_mobile.mov'} type="video/mp4;codecs=hvc1"></source>
                <source src={data?.config?.effect?.url + '_mobile.webm'} type="video/webm"></source>
              </video>
            </div>
          )}

          {data.config.effect?.type === 'float' && (
            <EmojiAnimate key={data.config.effect.emoji} emoji={data.config.effect.emoji} />
          )}
        </div>
      )}
    </>
  );
}
