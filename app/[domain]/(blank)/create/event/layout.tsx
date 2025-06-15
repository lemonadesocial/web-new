import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { MainEventLayout } from './main';

type LayoutProps = React.PropsWithChildren & {};

export default function EventLayout({ children }: LayoutProps) {
  return (
    <EventThemeProvider>
      <MainEventLayout>{children}</MainEventLayout>
    </EventThemeProvider>
  );
}
