import { usePathname, useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';

import { useFeedPosts } from '$lib/hooks/useLens';
import { accountAtom } from '$lib/jotai';

import { FeedPost } from './FeedPost';
import { FeedPostEmpty } from './FeedPostEmpty';
import { FeedPostLoading } from './FeedPostLoading';

type Props = {
  feedAddress?: string;
  authorId?: string;
  showReposts?: boolean;
};

export function FeedPosts({ feedAddress, authorId, showReposts }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { posts, isLoading } = useFeedPosts({ feedAddress, authorId });
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
          <FeedPost
            key={post.slug}
            post={post}
            showRepost={showReposts}
            onSelect={() => router.push(`${pathName}/${post.slug}`)}
          />
        ))}
    </div>
  );
}
