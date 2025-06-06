import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { postId, Post } from '@lens-protocol/client';
import { repost } from '@lens-protocol/client/actions';
import { handleOperationWith } from '@lens-protocol/client/ethers';

import { toast } from '$lib/components/core';
import { sessionClientAtom } from '$lib/jotai/lens';
import { useSigner } from '$lib/hooks/useSigner';
import { PostButton } from './PostButton';

interface PostRepostProps {
  post: Post;
}

export function PostRepost({ post }: PostRepostProps) {
  const [reposts, setReposts] = useState(post.stats.reposts);
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();

  const handleRepost = async () => {
    if (!sessionClient || !signer) {
      toast.error('Please connect your wallet to repost');
      return;
    }

    try {
      setReposts((prev) => prev + 1);

      const result = await repost(sessionClient, {
        post: postId(post.id),
      }).andThen(handleOperationWith(signer));

      if (result.isErr()) {
        setReposts((prev) => prev - 1);
        toast.error('Failed to repost');
      } else {
        toast.success('Reposted successfully');
      }
    } catch (error: any) {
      setReposts((prev) => prev - 1);
      toast.error(error.message);
    }
  };

  return (
    <PostButton
      icon="icon-repost"
      label={reposts}
      onClick={(e) => {
        e.stopPropagation();
        handleRepost();
      }}
      isActive={!!post.operations?.hasReposted}
    />
  );
} 
