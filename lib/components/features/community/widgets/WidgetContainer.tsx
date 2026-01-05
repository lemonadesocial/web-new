'use client';
import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderActionKind, useTheme } from '$lib/components/features/theme-builder/provider';
import { defaultPassportConfig } from '../../theme-builder/passports';

export function WidgetContainer({ space }: { space: Space }) {
  const [state, dispatch] = useTheme();

  React.useEffect(() => {
    if (space.theme_name) {
      const config = defaultPassportConfig[space.theme_name as string];
      console.log(state);
      const main = document.getElementsByTagName('main')?.[0];
      main.setAttribute('style', `background: url(${config.template.image})`);
      dispatch({ type: ThemeBuilderActionKind.select_template, payload: { ...config } });
    }
  }, [space.theme_name]);

  return (
    <div data-coin-template className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {'template' in state &&
        state.template.widgets?.map((w) => {
          const Comp = w.component;

          return <Comp key={w.key} space={space} {...w.props} />;
        })}
    </div>
  );
}
