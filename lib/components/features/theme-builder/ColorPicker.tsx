import { ColorPicker } from '$lib/components/core';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeBuilderAction, ThemeBuilderActionKind } from './provider';
import getPalette from 'tailwindcss-palette-generator';

export function MenuColorPicker({
  color,
  dispatch,
  strategy,
}: {
  color?: string;
  strategy?: 'fixed' | 'absolute';
  dispatch: React.Dispatch<ThemeBuilderAction>;
}) {
  return (
    <ColorPicker.Root strategy={strategy}>
      <ColorPicker.Trigger>
        <div
          className={twMerge(
            'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full custom',
            clsx(color === 'custom' && 'outline-2'),
          )}
          style={{
            background:
              'conic-gradient(from 180deg at 50% 50%, rgb(222, 97, 134) 0deg, rgb(197, 95, 205) 58.12deg, rgb(175, 145, 246) 114.38deg, rgb(53, 130, 245) 168.75deg, rgb(69, 194, 121) 208.13deg, rgb(243, 209, 90) 243.75deg, rgb(247, 145, 62) 285deg, rgb(244, 87, 95) 360deg)',
          }}
        ></div>
      </ColorPicker.Trigger>
      <ColorPicker.Content
        color={'#fff'}
        onChange={(result) => {
          const hex = result.hex;
          let customColors: Record<string, string> = {};
          if (color === 'custom' && hex) {
            const palette = getPalette([
              { color: hex, name: 'custom', shade: 500, shades: [50, 100, 200, 300, 400, 500, 700, 950] },
            ]) as unknown as {
              custom: {
                500: string;
                950: string;
                700: string;
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
              };
            };

            customColors = {
              '--color-custom-50': palette.custom[50],
              '--color-custom-100': palette.custom[100],
              '--color-custom-200': palette.custom[200],
              '--color-custom-300': palette.custom[300],
              '--color-custom-400': palette.custom[400],
              '--color-custom-500': palette.custom[500],
              '--color-custom-700': palette.custom[700],
              '--color-custom-950': palette.custom[950],
            };
          }

          dispatch({
            type: ThemeBuilderActionKind.select_color,
            payload: { config: { color: 'custom' }, variables: { custom: customColors } },
          });
        }}
      />
    </ColorPicker.Root>
  );
}
