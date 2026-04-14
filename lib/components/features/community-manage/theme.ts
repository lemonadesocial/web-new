import { merge } from 'lodash';

import { defaultPassportConfig } from '$lib/components/features/theme-builder/passports';
import { defaultTheme, ThemeValues } from '$lib/components/features/theme-builder/store';
import { Space } from '$lib/graphql/generated/backend/graphql';

type CommunityThemeSource = Pick<Space, 'theme_data' | 'theme_name'> | null | undefined;

export function getCommunityThemeData(space: CommunityThemeSource): ThemeValues {
  const themeData = merge({}, defaultTheme) as ThemeValues;
  const rawTheme = space?.theme_data as any;

  if (rawTheme) {
    const normalizedTheme = merge({}, themeData, {
      theme: rawTheme.theme,
      font_title: rawTheme.font_title,
      font_body: rawTheme.font_body,
      variables: rawTheme.variables,
      config: {
        mode: rawTheme.mode || rawTheme.config?.mode,
        color: rawTheme.foreground?.key || rawTheme.config?.fg || rawTheme.config?.color,
        class: rawTheme.class,
        image: rawTheme.config?.image,
        name: rawTheme.config?.name,
        effect: rawTheme.config?.effect,
      },
    }) as ThemeValues;

    if (space?.theme_name && space.theme_name !== 'default') {
      return merge({}, normalizedTheme, defaultPassportConfig[space.theme_name] || {});
    }

    return normalizedTheme;
  }

  if (space?.theme_name && space.theme_name !== 'default') {
    return merge({}, themeData, defaultPassportConfig[space.theme_name] || {}) as ThemeValues;
  }

  return themeData;
}
