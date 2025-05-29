import { useComments } from "$lib/hooks/useLens";

import { FeedPost } from "./FeedPost";
import { PostComposer } from "./PostComposer";

type PostCommentsProps = {
  postId: string;
  feedAddress?: string;
};

export function PostComments({ postId, feedAddress }: PostCommentsProps) {
  const {
    comments,
    createComment,
  } = useComments({ postId, feedAddress });

  const onPost = async (metadata: unknown) => {
    await createComment(metadata);
  };

  return (
    <div className="space-y-5">
      <PostComposer
        placeholder="Add a comment..."
        onPost={onPost}
      />
      {comments.map((comment, index) => (
        <div className="rounded-md border" key={comment.id}>
          <FeedPost post={comment} isComment />
          {
            index < comments.length - 1 && <hr className="border-t" />
          }
        </div>
      )
      )}
    </div>
  );
}
