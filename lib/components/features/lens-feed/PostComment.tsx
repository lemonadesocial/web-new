import { Post } from "@lens-protocol/client";
import { PostButton } from "./PostButton";
import { useLensAuth } from "$lib/hooks/useLens";
import { AddCommentModal } from "./AddCommentModal";
import { modal } from "$lib/components/core";

type PostCommentProps = {
  post: Post;
};

export function PostComment({ post }: PostCommentProps) {
  const handleLensAuth = useLensAuth();

  const handleAddComment = async () => {
    modal.open(AddCommentModal, {
      props: {
        post
      },
      dismissible: true,
    });
  };

  return (
    <PostButton
      icon="icon-chat"
      label={post.stats.comments}
      onClick={() => handleLensAuth(handleAddComment)}
    />
  );
}
