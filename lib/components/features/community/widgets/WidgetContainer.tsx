'use client';
import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderActionKind, useTheme } from '$lib/components/features/theme-builder/provider';

export function WidgetContainer({ space }: { space: Space }) {
  const [state] = useTheme();

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
