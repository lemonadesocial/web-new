'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnyPost } from '@lens-protocol/client';

import { usePost } from '$lib/hooks/useLens';
import { FeedPost } from './FeedPost';
import { PostComments } from './PostComments';

type Props = {
  postId: string;
};
export function FeedPostDetail({ postId }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { getPost } = usePost();

  const [post, setPost] = React.useState<AnyPost | null>();

  React.useEffect(() => {
    if (postId) {
      getPost({ postId }).then((res) => setPost(res));
    }
  }, [postId]);

  if (!post) return null;

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
          router.push(pathName.replace(postId, data.id));
        }}
      />
    </div>
  );
}
