import { usePathname, useRouter } from 'next/navigation';

import { evmAddress } from '@lens-protocol/client';
import { useAtomValue } from 'jotai';

import { useFeedPosts } from '$lib/hooks/useLens';
import { Skeleton } from '$lib/components/core';
import { accountAtom } from '$lib/jotai';

import { FeedPost } from './FeedPost';
import { FeedPostEmpty } from './FeedPostEmpty';
import { FeedPostLoading } from './FeedPostLoading';

export function FeedPosts({ feedAddress }: { feedAddress: string }) {
  const router = useRouter();
  const pathName = usePathname();

  const { posts, isLoading } = useFeedPosts(evmAddress(feedAddress));
  const account = useAtomValue(accountAtom);

  if (isLoading) {
    return <FeedPostLoading />;
  }

  if (posts.length === 0) {
    return <FeedPostEmpty account={account} />;
  }

  return (
    <div className="space-y-4">
      {posts
        .filter((item: any) => !item.root)
        .map((post) => (
          <FeedPost key={post.slug} post={post} onSelect={() => router.push(`${pathName}/${post.id}`)} />
        ))}
    </div>
  );
}
