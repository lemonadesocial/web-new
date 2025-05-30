import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { PostReactionType, postId, Post } from '@lens-protocol/client';
import { addReaction, undoReaction } from '@lens-protocol/client/actions';
import clsx from 'clsx';

import { toast } from '$lib/components/core';
import { useLensAuth } from '$lib/hooks/useLens';
import { sessionClientAtom } from '$lib/jotai/lens';

import { PostButton } from './PostButton';

interface PostReactionProps {
  post: Post;
  isComment?: boolean;
}

export function PostReaction({ post, isComment }: PostReactionProps) {
  const [isUpvoted, setIsUpvoted] = useState(post.operations?.hasUpvoted);

  const [upvotes, setUpvotes] = useState(post.stats.upvotes);
  const sessionClient = useAtomValue(sessionClientAtom);
  const handleLensAuth = useLensAuth();

  const handleUpvote = async () => {
    if (!sessionClient) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    try {
      setIsUpvoted(!isUpvoted);
      setUpvotes((prev) => (isUpvoted ? prev - 1 : prev + 1));

      const result = isUpvoted
        ? await undoReaction(sessionClient, {
            post: postId(post.id),
            reaction: PostReactionType.Upvote,
          })
        : await addReaction(sessionClient, {
            post: postId(post.id),
            reaction: PostReactionType.Upvote,
          });

      if (result.isErr()) {
        setIsUpvoted(!isUpvoted);
        setUpvotes((prev) => (isUpvoted ? prev + 1 : prev - 1));
        toast.error('Failed to update reaction');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isComment) return (
    <div className="flex gap-2 items-center">
      <i className={clsx(isUpvoted ? "icon-heart-filled text-accent-400" : "icon-heart-outline text-tertiary hover:text-primary", "size-5 cursor-pointer")} onClick={handleUpvote} />
      <p className="text-tertiary">{upvotes}</p>
    </div>
  )

  return (
    <PostButton
      icon={isUpvoted ? "icon-heart-filled" : "icon-heart-outline"}
      onClick={() => handleLensAuth(handleUpvote)}
      label={upvotes}
      isActive={isUpvoted}
      className={isUpvoted ? 'sm:bg-accent-500 sm:hover:bg-accent-700' : ''}
    />
  );
}
