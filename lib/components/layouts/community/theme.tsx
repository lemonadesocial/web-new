"use client";
import clsx from "clsx";
import { useAtom } from "jotai";

import { themeAtom } from "$lib/components/features/community/theme_builder/store";
import { generateCssVariables } from "$lib/utils/fetchers";

import { ShaderGradient } from "$lib/components/features/community/theme_builder/shader";

const ThemeGenerator = () => {
  const [data] = useAtom(themeAtom);

  return <>
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
          ['shader', 'pattern'].includes(data?.theme as string) && data?.config?.name,
          data?.config?.bg,
          data?.config?.class,
        )}
      >
        {data?.theme === 'shader' && <ShaderGradient mode={data.config.mode} />}
      </div>
    )}
  </>;
};

export default ThemeGenerator;
