'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { usePost } from '$lib/hooks/useLens';
import { FeedPost } from './FeedPost';
import { PostComments } from './PostComments';
import { useAtomValue } from 'jotai';
import { accountAtom, feedPostAtom } from '$lib/jotai';
import { FeedPostEmpty } from './FeedPostEmpty';
import { FeedPostLoading } from './FeedPostLoading';
import { AnyPost } from '@lens-protocol/client';
import { LensProfileCard } from '../lens-account/LensProfileCard';
import { Card } from '$lib/components/core';

type Props = {
  postSlug: string;
};

export function FeedPostDetail({ postSlug }: Props) {
  const { selectPost, isLoading } = usePost();
  const post = useAtomValue(feedPostAtom);
  const account = useAtomValue(accountAtom);

  React.useEffect(() => {
    if (postSlug) {
      selectPost({ slug: postSlug });
    }
  }, [postSlug]);

  const author = React.useMemo(() => {
    if (post) {
      const rootPost = post.__typename === 'Repost' ? post.repostOf : post;
      return rootPost.author;
    }
  }, [post]);

  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-8 items-start pb-10">
      {isLoading ? (
        <FeedPostLoading />
      ) : !post ? (
        <FeedPostEmpty account={account} />
      ) : (
        <FeedPostDetailContent post={post} />
      )}

      {author && <LensProfileCard account={author} />}
    </div>
  );
}

export function FeedPostDetailContent({ post }: { post: AnyPost }) {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="flex flex-col gap-5 w-full">
      <Card.Root onClick={router.back}>
        <Card.Content className="flex items-center gap-3">
          <i className="icon-arrow-back-sharp size-[20px] text-tertiary" />
          Post
        </Card.Content>
      </Card.Root>

      <FeedPost post={post} showRepost />
      <PostComments
        postId={post.id}
        onSelectComment={(data) => {
          router.push(pathName.replace(post.slug, data.slug));
        }}
      />
    </div>
  );
}
