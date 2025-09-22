'use client';
import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { PostComposer } from '$lib/components/features/lens-feed/PostComposer';
import { useAccount, usePost } from '$lib/hooks/useLens';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';

function Page() {
  const { account } = useAccount();

  const router = useRouter();
  const { createPost } = usePost();

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    createPost({ metadata, feedAddress });
  };

  const onSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <PostComposer onPost={onPost} showFeedOptions />
      {match(account?.address)
        .with(account?.address, () => <FeedPosts feedAddress={account?.address} onSelectPost={onSelectPost} />)
        .otherwise(() => (
          <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />
        ))}
    </div>
  );
}

export default Page;
