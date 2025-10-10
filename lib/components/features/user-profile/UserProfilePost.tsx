import { FeedPosts } from '../lens-feed/FeedPosts';

export function UserProfilePost({ address }: { address?: string }) {
  if (!address) return null;
  return <FeedPosts authorId={address} />;
}
