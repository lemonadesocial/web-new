import { useEffect, useState } from 'react';
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
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  const sessionClient = useAtomValue(sessionClientAtom);
  const handleLensAuth = useLensAuth();

  useEffect(() => {
    setIsUpvoted(!!post.operations?.hasUpvoted);
    setUpvotes(post.stats.upvotes);
  }, [post]);

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

  if (isComment)
    return (
      <div className="flex gap-2 items-center">
        <i
          className={clsx(
            isUpvoted ? 'icon-heart-filled text-accent-400' : 'icon-heart-outline text-tertiary hover:text-primary',
            'size-5 cursor-pointer',
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleUpvote();
          }}
        />
        {upvotes > 0 && <p className="text-tertiary">{upvotes}</p>}
      </div>
    );

  return (
    <PostButton
      icon={isUpvoted ? 'icon-heart-filled' : 'icon-heart-outline'}
      onClick={(e) => {
        e.stopPropagation();
        handleLensAuth(handleUpvote);
      }}
      label={upvotes}
      isActive={isUpvoted}
      className={isUpvoted ? 'text-accent-500 hover:text-accent-700' : ''}
    />
  );
}
