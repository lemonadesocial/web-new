"use client";
import React from "react";
import clsx from "clsx";
import { useAtom } from "jotai";

import { defaultTheme, themeAtom } from "$lib/components/features/community/theme_builder/store";
import { generateCssVariables } from "$lib/utils/fetchers";

import { ShaderGradient } from "$lib/components/features/community/theme_builder/shader";
import { Space } from "$lib/graphql/generated/backend/graphql";

const ThemeGenerator = ({ space }: { space: Space; }) => {
  const theme = space?.theme_data;
  const [data, setThemeAtom] = useAtom(themeAtom);

  React.useEffect(() => {
    if (theme) {
      setThemeAtom({
        ...defaultTheme,
        theme: theme.theme,
        config: { fg: theme.foreground?.key, bg: theme.background?.key, name: theme?.class, ...(theme.config || {}) },
        font_title: theme.font_title,
        font_body: theme.font_body,
        variables: { ...theme.variables },
      });
    }
  }, []);

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
