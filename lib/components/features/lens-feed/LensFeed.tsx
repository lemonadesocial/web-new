'use client';
import { useAtomValue } from 'jotai';

import { usePost } from '$lib/hooks/useLens';
import { accountAtom } from '$lib/jotai';

import { PostComposer } from './PostComposer';
import { FeedPosts } from './FeedPosts';

export function LensFeed({
  feedAddress,
  authorId,
  showReposts,
  onSelectPost,
}: {
  feedAddress?: string;
  authorId?: string;
  showReposts?: boolean;
  onSelectPost?: (slug: string) => void;
}) {
  const { createPost } = usePost();
  const account = useAtomValue(accountAtom);

  const onPost = async (metadata: unknown) => {
    await createPost({ metadata, feedAddress });
  };

  const canPost = authorId ? authorId === account?.address : !!account;

  return (
    <div className="w-full space-y-4">
      {canPost && <PostComposer onPost={onPost} />}
      <FeedPosts feedAddress={feedAddress} authorId={authorId} showReposts={showReposts} onSelectPost={onSelectPost} />
    </div>
  );
}
