import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';

import { MainEventLayout } from './main';
import { Content } from './content';

export default async function Page() {
  return (
    <EventThemeProvider>
      <MainEventLayout>
        <Content />
      </MainEventLayout>
    </EventThemeProvider>
  );
}
