'use client';
import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderActionKind, useTheme } from '$lib/components/features/theme-builder/provider';
import { defaultPassportConfig } from '../../theme-builder/passports';

export function WidgetContainer({ space }: { space: Space }) {
  const [state, dispatch] = useTheme();

  // React.useEffect(() => {
  //   if (space.theme_name) {
  //     const config = defaultPassportConfig['zugrama'] || defaultPassportConfig[space.theme_name as string];
  //     const main = document.getElementsByTagName('main')?.[0];
  //     main.setAttribute('style', `background: url(${config.template.image}); background-size: cover`);
  //     dispatch({ type: ThemeBuilderActionKind.select_template, payload: { ...config } });
  //   }
  // }, [space.theme_name]);


  return (
    <div data-coin-template className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {'template' in state &&
        state.template.widgets?.map((w) => {
          const Comp = w.component;
          const enable = w.enable ?? true;

          if (!enable) return null;

          return <Comp key={w.key} space={space} {...w.props} />;
        })}
    </div>
  );
}
