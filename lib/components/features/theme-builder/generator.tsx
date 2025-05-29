'use client';
import { generateCssVariables } from '$lib/utils/fetchers';
import clsx from 'clsx';
import { ShaderGradient } from './shader';
import { ThemeValues } from './store';
import { EmojiAnimate } from './emoji';

export function ThemeGenerator({ data }: { data: ThemeValues }) {
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
            ['emoji'].includes(data.theme as string) && 'minimal',
            data?.config?.color,
            data?.config?.class,
            data.config.mode,
          )}
        >
          {data?.theme === 'shader' && <ShaderGradient mode={data.config.mode} />}
          {data?.theme === 'emoji' && (
            <>
              {data.config?.effect?.type === 'video' && data?.config?.effect?.url && (
                <video
                  key={data.config.name}
                  className="min-w-full min-h-full fixed inset-0"
                  autoPlay
                  loop
                  playsInline
                  muted
                >
                  <source src={data?.config?.effect?.url} type="video/webm"></source>
                </video>
              )}

              {data.config.effect?.type === 'float' && (
                <EmojiAnimate key={data.config.effect.emoji} emoji={data.config.effect.emoji} />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
