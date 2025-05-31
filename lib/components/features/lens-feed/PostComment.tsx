import { Post } from "@lens-protocol/client";
import { useState } from "react";

import { useLensAuth } from "$lib/hooks/useLens";
import { modal } from "$lib/components/core";

import { PostButton } from "./PostButton";
import { AddCommentModal } from "./AddCommentModal";

type PostCommentProps = {
  post: Post;
};

export function PostComment({ post }: PostCommentProps) {
  const [commentCount, setCommentCount] = useState(post.stats.comments);
  const handleLensAuth = useLensAuth();

  const handleAddComment = async () => {
    modal.open(AddCommentModal, {
      props: {
        post,
        onSuccess: () => setCommentCount(commentCount + 1),
      },
      dismissible: true,
    });
  };

  return (
    <PostButton
      icon="icon-chat"
      label={commentCount}
      onClick={() => handleLensAuth(handleAddComment)}
    />
  );
}
