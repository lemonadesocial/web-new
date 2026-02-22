'use client';

import { PlaceholderSection } from '../PlaceholderSection';

export function Columns(props: Record<string, unknown>) {
  return <PlaceholderSection sectionLabel="Columns" {...props} />;
}

export function ColumnCanvas(props: Record<string, unknown>) {
  return <PlaceholderSection sectionLabel="Column Canvas" {...props} />;
}
