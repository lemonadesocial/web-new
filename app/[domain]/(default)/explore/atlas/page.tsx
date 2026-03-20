import { AtlasExplore } from '$lib/components/features/explore/AtlasExplore';

export const metadata = {
  title: 'Atlas Events',
  description: 'Search for events from Lemonade, Eventbrite, Lu.ma, Meetup, and more via Atlas Protocol.',
};

export default function AtlasExplorePage() {
  return <AtlasExplore />;
}
