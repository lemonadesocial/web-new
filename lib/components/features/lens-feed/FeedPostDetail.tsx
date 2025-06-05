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

type Props = {
  postId: string;
};

export function FeedPostDetail({ postId }: Props) {
  const { selectPost, isLoading } = usePost();
  const post = useAtomValue(feedPostAtom);
  const account = useAtomValue(accountAtom);

  React.useEffect(() => {
    if (postId) {
      selectPost({ postId });
    }
  }, [postId]);

  const author = React.useMemo(() => {
    if(post) {
      const rootPost = post.__typename === 'Repost' ? post.repostOf : post
      return rootPost.author
    }
  }, [post])

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
    <div className="-mt-6 flex flex-col gap-5 w-full">
      <div className="items-center border border-t-0 backdrop-blur-lg h-[48px] px-4 py-3 rounded-b-md">
        <button className="inline-flex items-center cursor-pointer gap-3" onClick={router.back}>
          <i className="icon-arrow-back-sharp size-[20px] text-tertiary" />
          Post
        </button>
      </div>

      <FeedPost post={post} />
      <PostComments
        postId={post.id}
        onSelectComment={(data) => {
          router.push(pathName.replace(post.id, data.id));
        }}
      />
    </div>
  );
}
