import { notFound } from 'next/navigation';

import { FeedPostDetail } from '$lib/components/features/lens-feed/FeedPostDetail';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (!slug) return notFound();

  return (
    <div className="max-w-[1080px] mx-auto mt-6">
      <FeedPostDetail postSlug={slug} />
    </div>
  );
}
