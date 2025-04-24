import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import * as fs from 'fs';
import * as path from 'path';

export default {
  plugins: [
    plugin(function ({ matchComponents }) {
      const iconsDir = path.join(__dirname, './lib/icons');
      const values: { [key: string]: { fullPath: string; isMultiColor: boolean } } = {};

      try {
        fs.readdirSync(iconsDir).forEach((file) => {
          if (path.extname(file) === '.svg') {
            const baseName = path.basename(file, '.svg');
            const isMultiColor = baseName.endsWith('-color');
            const utilityName = isMultiColor ? baseName.replace(/-color$/, '') : baseName;

            values[utilityName] = {
              fullPath: path.join(iconsDir, file),
              isMultiColor,
            };
          }
        });
      } catch (e) {
        console.error(`Error reading icons directory: ${iconsDir}`, e);
        return;
      }

      matchComponents(
        {
          icon: ({ fullPath, isMultiColor }: { fullPath: string; isMultiColor: boolean }) => {
            try {
              const content = fs.readFileSync(fullPath).toString().replace(/\r?\n|\r/g, '');
              const encodedContent = encodeURIComponent(content);
              const svgUrl = `url('data:image/svg+xml;utf8,${encodedContent}')`;

              const baseStyles = {
                display: 'inline-block',
                width: 24,
                height: 24,
                'background-repeat': 'no-repeat',
                'vertical-align': 'middle',
              };

              if (isMultiColor) {
                return {
                  ...baseStyles,
                  'background-image': svgUrl,
                  'background-position': 'center center',
                  'background-size': 'contain',
                  'background-color': 'transparent',
                };
              } else {
                const maskValue = `${svgUrl} center center / contain no-repeat`;
                return {
                  ...baseStyles,
                  '-webkit-mask': maskValue,
                  mask: maskValue,
                  'background-color': 'currentColor',
                };
              }
            } catch (e) {
              console.error(`Error processing SVG file: ${fullPath}`, e);
              return {};
            }
          },
        },
        { values },
      );
    }),
  ],
} satisfies Config;
