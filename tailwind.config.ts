import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import * as fs from 'fs';
import * as path from 'path';

export default {
  plugins: [
    plugin(function ({ matchComponents }) {
      let iconsDir = path.join(__dirname, './lib/icons');
      let values: { [key: string]: any } = {};
      fs.readdirSync(iconsDir).forEach((file) => {
        let name = path.basename(file, '.svg');
        values[name] = { name, fullPath: path.join(iconsDir, file) };
      });
      matchComponents(
        {
          // @ts-ignore
          icon: ({ name, fullPath }: { name: string; fullPath: string }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, '');

            return {
              [`--icon-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              '-webkit-mask': `var(--icon-${name})`,
              mask: `var(--icon-${name})`,
              'mask-repeat': 'no-repeat',
              'mask-size': 'cover',
              'background-color': 'currentColor',
              'vertical-align': 'middle',
              display: 'inline-block',
              width: 24,
              height: 24,
            };
          },
        },
        { values },
      );
    }),
  ],
} satisfies Config;
