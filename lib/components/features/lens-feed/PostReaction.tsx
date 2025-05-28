import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { PostReactionType, postId, Post } from '@lens-protocol/client';
import { addReaction, undoReaction, fetchPostReactions } from '@lens-protocol/client/actions';

import { Button, toast } from '$lib/components/core';
import { client } from '$lib/utils/lens/client';
import { accountAtom, sessionClientAtom } from '$lib/jotai/lens';
import clsx from 'clsx';

interface PostReactionProps {
  post: Post;
  isComment?: boolean;
}

export function PostReaction({ post, isComment }: PostReactionProps) {
  const [isUpvoted, setIsUpvoted] = useState(false);

  const [upvotes, setUpvotes] = useState(post.stats.upvotes);
  const sessionClient = useAtomValue(sessionClientAtom);
  const account = useAtomValue(accountAtom);


  useEffect(() => {
    const checkUpvoteState = async () => {
      if (!sessionClient || !account) return;
      const result = await fetchPostReactions(client, {
        post: postId(post.id),
      });

      if (result.isErr()) return;

      const { items } = result.value;
      const userReaction = items.find(
        (item) => item.account.address === account.address
      );

      if (userReaction) {
        const hasUpvote = userReaction.reactions.some(
          (r) => r.reaction === PostReactionType.Upvote
        );
        setIsUpvoted(hasUpvote);
      }
    };

    checkUpvoteState();
  }, [sessionClient, account]);

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
    <Button
      variant={isUpvoted ? "primary" : "tertiary"}
      onClick={handleUpvote}
      iconLeft={isUpvoted ? "icon-heart-filled" : "icon-heart-outline"}
      className="rounded-full"
    >
      {upvotes}
    </Button>
  );
}
