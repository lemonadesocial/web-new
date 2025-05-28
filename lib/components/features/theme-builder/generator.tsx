'use client';
import { generateCssVariables } from '$lib/utils/fetchers';
import clsx from 'clsx';
import { ShaderGradient } from './shader';
import { ThemeValues } from './store';

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
            data?.config?.color,
            data?.config?.class,
            data.config.mode,
          )}
        >
          {data?.theme === 'shader' && <ShaderGradient mode={data.config.mode} />}
          {data?.theme === 'emoji' && data.config?.effect?.type === 'video' && data?.config?.effect?.url && (
            <video key={data.config.name} className="w-full h-full fixed inset-0" autoPlay loop muted>
              <source src={data?.config?.effect?.url}></source>
            </video>
          )}
        </div>
      )}
    </>
  );
}
