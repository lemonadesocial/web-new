'use client';
import React from 'react';
import { generateCssVariables } from '$lib/utils/fetchers';
import clsx from 'clsx';
import { isMobile } from 'react-device-detect';

import { ShaderGradient } from './shader';
import { ThemeValues } from './store';
import { EmojiAnimate } from './emoji';

export function ThemeGenerator({
  data,
  style,
  scoped = false,
  scopeSelector,
}: {
  data: ThemeValues;
  style?: React.CSSProperties;
  scoped?: boolean;
  scopeSelector?: string;
}) {
  const [mode, setMode] = React.useState(data.config.mode);
  const videoMobRef = React.useRef<HTMLVideoElement>(null);
  const videoWebRef = React.useRef<HTMLVideoElement>(null);

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
    } else {
      setMode(data.config.mode);
    }
  }, [data.config.mode]);

  const autoplay = () => {
    if (document.visibilityState === 'visible') {
      if (videoMobRef.current && videoMobRef.current.paused) {
        videoMobRef.current.preload = 'auto';
        setTimeout(() => videoMobRef.current?.play(), 500);
      }

      if (videoWebRef.current && videoWebRef.current.paused) {
        videoWebRef.current.preload = 'auto';
        setTimeout(() => videoWebRef.current?.play(), 500);
      }
    }

    if (document.visibilityState === 'hidden') {
      if (videoMobRef.current) videoMobRef.current?.pause();
      if (videoWebRef.current) videoWebRef.current?.pause();
    }
  };

  React.useLayoutEffect(() => {
    document.addEventListener('visibilitychange', autoplay);
    return () => document.removeEventListener('visibilitychange', autoplay);
  }, []);

  const modeKey = mode === 'auto' ? 'dark' : mode;
  const isMinimalTheme = data.theme === 'minimal';
  const isCustomTheme = data.theme === 'custom';
  const modeVars = data.variables?.[modeKey === 'dark' ? 'dark' : 'light'];
  const backgroundColor = modeVars?.['--color-background'] ||
    (isMinimalTheme
      ? (modeKey === 'light' ? 'var(--color-accent-50)' : 'var(--color-accent-950)')
      : isCustomTheme
        ? (data.variables?.custom?.['--color-background'] as string | undefined)
        : undefined);
  const selector = scopeSelector || '[data-theme-scope]';

  const scopedBackgroundStyle = scoped
    ? ({
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: isMinimalTheme || isCustomTheme ? backgroundColor : undefined,
        ...style,
      } as React.CSSProperties)
    : style;

  return (
    <>
      {data?.variables && (
        <style jsx global>
          {`
            ${scoped
              ? `${selector} {
              ${data.variables.font && generateCssVariables(data.variables.font)}
              ${data.variables?.custom && generateCssVariables(data.variables?.custom)}
              ${data.variables.pattern && generateCssVariables(data.variables.pattern)}
              ${(mode === 'dark' || (mode === 'auto' && modeKey === 'dark')) && data.variables.dark && generateCssVariables(data.variables.dark)}
              ${(mode === 'light' || (mode === 'auto' && modeKey === 'light')) && data.variables.light && generateCssVariables(data.variables.light)}
            }`
              : `body {
              ${data.variables.font && generateCssVariables(data.variables.font)}
            }

            :root {
              ${data.variables?.custom && generateCssVariables(data.variables?.custom)}
              ${data.variables.pattern && generateCssVariables(data.variables.pattern)}
              ${mode === 'dark' && data.variables.dark && generateCssVariables(data.variables.dark)}
              ${mode === 'light' && data.variables.light && generateCssVariables(data.variables.light)}
            }`}
          `}
        </style>
      )}

      {
        !!(backgroundColor && (isMinimalTheme || isCustomTheme)) && (
          <style jsx global>
            {`
              ${scoped ? `${selector} .background.${data.theme}` : `.background.${data.theme}`} {
                --minimal-color-bg: ${backgroundColor} !important;
                background-color: ${backgroundColor} !important;
              }
            `}
          </style>
        )
      }

      {data?.theme && (
        <div
          data-theme={mode}
          className={clsx(
            'background',
            data.theme,
            data.config.name,
            // allow bg for emoji
            data?.config?.color,
            data?.config?.class,
            mode,
            scoped && 'w-full h-full',
          )}
          style={scopedBackgroundStyle}
        >
          {data.theme === 'shader' && (
            <ShaderGradient mode={mode} scoped={scoped} scopeSelector={scoped ? selector : undefined} />
          )}

          {data.theme === 'image' && data.config?.image && (
            <div
              className={
                scoped
                  ? 'min-w-full min-h-full absolute inset-0 aspect-video bg-cover! bg-no-repeat'
                  : 'min-w-full min-h-full fixed inset-0 aspect-video bg-cover! bg-no-repeat'
              }
              style={{ background: `url(${data.config.image?.url})` }}
            />
          )}

          {data.theme === 'passport' && (data.config?.image || data.template?.image) && (
            <div
              className={
                scoped
                  ? 'min-w-full min-h-full absolute inset-0 aspect-video bg-cover! bg-no-repeat'
                  : 'min-w-full min-h-full fixed inset-0 aspect-video bg-cover! bg-no-repeat'
              }
              style={{ background: `url(${data.config?.image?.url || data.template?.image})` }}
            />
          )}

          {data.config?.effect?.type === 'video' && data?.config?.effect?.url && (
            <div key={data.config.effect.name}>
              {!isMobile ? (
                <video
                  ref={videoWebRef}
                  className={
                    scoped
                      ? 'min-w-full min-h-full absolute hidden md:block inset-0'
                      : 'min-w-full min-h-full fixed hidden md:block inset-0'
                  }
                  autoPlay
                  loop
                  playsInline
                  muted
                >
                  <source
                    src={data?.config?.effect?.url.replace('.webm', '') + '_web.mov'}
                    type="video/mp4;codecs=hvc1"
                  ></source>
                  <source
                    src={data?.config?.effect?.url.replace('.webm', '') + '_web.webm'}
                    type="video/webm"
                  ></source>
                </video>
              ) : (
                <video
                  ref={videoMobRef}
                  className={
                    scoped
                      ? 'min-w-full min-h-full absolute inset-0 md:hidden'
                      : 'min-w-full min-h-full fixed inset-0 md:hidden'
                  }
                  autoPlay
                  loop
                  playsInline
                  muted
                >
                  <source
                    src={data?.config?.effect?.url.replace('.webm', '') + '_mobile.mov'}
                    type="video/mp4;codecs=hvc1"
                  ></source>
                  <source
                    src={data?.config?.effect?.url.replace('.webm', '') + '_mobile.webm'}
                    type="video/webm"
                  ></source>
                </video>
              )}
            </div>
          )}

          {data.config.effect?.type === 'float' && (
            <EmojiAnimate
              key={data.config.effect.emoji}
              emoji={data.config.effect.emoji}
              scoped={scoped}
            />
          )}
        </div>
      )}
    </>
  );
}
