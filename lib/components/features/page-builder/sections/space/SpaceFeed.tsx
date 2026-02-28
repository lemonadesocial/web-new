'use client';

import React from 'react';

import { SectionWrapper } from '../SectionWrapper';
import { sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface FeedPost {
  id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  likes?: number;
}

interface SpaceFeedProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  posts?: FeedPost[];
  max_display?: number;
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 30) return date.toLocaleDateString();
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  } catch {
    return dateStr;
  }
}

function PostCard({ post }: { post: FeedPost }) {
  const hasAvatar = post.author_avatar && post.author_avatar.trim().length > 0;
  const hasContent = post.content && post.content.trim().length > 0;

  return (
    <div className="rounded-md border border-card-border bg-primary/4 p-5 transition hover:border-primary/20">
      {/* Author row */}
      <div className="flex items-center gap-3">
        {hasAvatar ? (
          <img
            src={sanitizeMediaSrc(post.author_avatar)}
            alt={post.author_name}
            className="size-10 rounded-full border border-card-border object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-card-border bg-primary/4">
            <i className="icon-user size-4 text-tertiary" />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-semibold text-primary">
            {post.author_name || 'Anonymous'}
          </span>
          {post.created_at && (
            <span className="text-xs text-tertiary">
              {formatRelativeTime(post.created_at)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {hasContent && (
        <p className="mt-3 text-sm leading-relaxed text-secondary line-clamp-4">
          {post.content}
        </p>
      )}

      {/* Footer with likes */}
      {typeof post.likes === 'number' && post.likes >= 0 && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-card-border pt-3">
          <i className="icon-heart size-4 text-tertiary" />
          <span className="text-xs font-medium text-secondary">
            {post.likes.toLocaleString()} like{post.likes !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-message size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No posts yet</p>
      <p className="mt-1 text-xs text-tertiary">
        Activity and updates will appear here
      </p>
    </div>
  );
}

function _SpaceFeed({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Latest Updates',
  posts = [],
  max_display = 5,
}: SpaceFeedProps) {
  const displayedPosts = posts.slice(0, max_display);
  const hasPosts = displayedPosts.length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          {heading || 'Latest Updates'}
        </h2>
        {hasPosts && (
          <span className="text-sm font-medium text-secondary hover:text-primary transition cursor-pointer">
            View All
          </span>
        )}
      </div>

      {/* Posts list or empty state */}
      {hasPosts ? (
        <div className="flex flex-col gap-4">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceFeed = React.memo(_SpaceFeed);
SpaceFeed.craft = {
  displayName: 'SpaceFeed',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Latest Updates',
    posts: [],
    max_display: 5,
  },
};
