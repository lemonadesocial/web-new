import { ExploreContent } from '$lib/components/features/explore/Explore';
import { notFound } from 'next/navigation';

function Page() {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'production') return notFound();

  return <ExploreContent />;
}
export default Page;
