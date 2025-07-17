import React from 'react';
import { Post } from '@lens-protocol/client';

import { useLensAuth } from '$lib/hooks/useLens';
import { modal } from '$lib/components/core';

import { PostButton } from './PostButton';
import { AddCommentModal } from './AddCommentModal';

type PostCommentProps = {
  post: Post;
};

export function PostComment({ post }: PostCommentProps) {
  const [commentCount, setCommentCount] = React.useState(0);
  const handleLensAuth = useLensAuth();

  React.useEffect(() => {
    setCommentCount(post.stats.comments);
  }, [post.stats.comments]);

  const handleAddComment = async () => {
    modal.open(AddCommentModal, {
      props: {
        post,
        onSuccess: () => setCommentCount(commentCount + 1),
      },
    });
  };

  return (
    <PostButton
      icon="icon-chat"
      label={commentCount}
      onClick={(e) => {
        e.stopPropagation();
        handleLensAuth(handleAddComment);
      }}
    />
  );
}
