import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { Content } from './content';

export default function Page() {
  return (
    <EventThemeProvider>
      <Content />
    </EventThemeProvider>
  );
}
