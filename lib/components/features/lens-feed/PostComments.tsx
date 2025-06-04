import { useComments } from '$lib/hooks/useLens';
import { AnyPost } from '@lens-protocol/client';

import { FeedPost } from './FeedPost';
import { PostComposer } from './PostComposer';

type PostCommentsProps = {
  postId: string;
  feedAddress?: string;
  onSelectComment?: (comment: AnyPost) => void;
};

export function PostComments({ postId, feedAddress, onSelectComment }: PostCommentsProps) {
  const { comments, createComment } = useComments({ postId, feedAddress });

  const onPost = async (metadata: unknown) => {
    await createComment(metadata);
  };

  return (
    <div className="space-y-5">
      <PostComposer placeholder="Add a comment..." onPost={onPost} />

      {!!comments.length && (
        <div className="border rounded-md divide-y divide-[var(--color-divider)]">
          {comments.map((comment) => (
            <FeedPost key={comment.id} post={comment} isComment onSelect={() => onSelectComment?.(comment)} />
          ))}
        </div>
      )}
    </div>
  );
}
