'use client';
import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderActionKind, useTheme } from '$lib/components/features/theme-builder/provider';
import vinylPassportConfig from '$lib/components/features/theme-builder/passports/vinyl-nation';
import festivalPassportConfig from '../../theme-builder/passports/festival-nation';
import dripPassportConfig from '../../theme-builder/passports/drip-nation';

export function WidgetContainer({ space }: { space: Space }) {
  const [state, dispatch] = useTheme();

  React.useEffect(() => {
    const config = dripPassportConfig;
    const main = document.getElementsByTagName('main')?.[0];
    main.setAttribute('style', `background: url(${config.template.image})`);
    dispatch({ type: ThemeBuilderActionKind.select_template, payload: { ...config } });
  }, []);

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
