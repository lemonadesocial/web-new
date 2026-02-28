'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface SpaceMember {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
}

interface SpaceMembersProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  members?: SpaceMember[];
  max_display?: number;
  columns?: 3 | 4 | 5;
  show_roles?: boolean;
}

function MemberCard({
  member,
  show_roles,
}: {
  member: SpaceMember;
  show_roles: boolean;
}) {
  const hasAvatar = member.avatar_url && member.avatar_url.trim().length > 0;
  const hasName = member.name && member.name.trim().length > 0;
  const hasRole = member.role && member.role.trim().length > 0;

  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-card-border bg-primary/4 p-4 transition hover:border-primary/20">
      {/* Avatar */}
      {hasAvatar ? (
        <img
          src={sanitizeMediaSrc(member.avatar_url)}
          alt={hasName ? member.name : 'Member avatar'}
          className="size-16 rounded-full border-2 border-card-border object-cover"
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-card-border bg-primary/4">
          <i className="icon-user size-6 text-tertiary" />
        </div>
      )}

      {/* Name */}
      <p className="text-sm font-semibold text-primary text-center line-clamp-1">
        {hasName ? member.name : 'Member'}
      </p>

      {/* Role badge */}
      {show_roles && hasRole && (
        <span className="inline-flex rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-secondary">
          {member.role}
        </span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-community size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No members yet</p>
      <p className="mt-1 text-xs text-tertiary">
        Members will appear here when they join the space
      </p>
    </div>
  );
}

function _SpaceMembers({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Members',
  members = [],
  max_display = 12,
  columns = 4,
  show_roles = true,
}: SpaceMembersProps) {
  const displayedMembers = members.slice(0, max_display);
  const remainingCount = members.length - displayedMembers.length;
  const hasMembers = displayedMembers.length > 0;

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
          {heading || 'Members'}
        </h2>
        {members.length > 0 && (
          <span className="text-sm font-medium text-secondary">
            {members.length.toLocaleString()} member{members.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Members grid or empty state */}
      {hasMembers ? (
        <>
          <div
            className={clsx(
              'grid gap-4',
              columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
              columns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
              columns === 5 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
            )}
          >
            {displayedMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                show_roles={show_roles}
              />
            ))}
          </div>

          {/* Overflow indicator */}
          {remainingCount > 0 && (
            <p className="mt-4 text-center text-sm text-secondary">
              +{remainingCount.toLocaleString()} more member{remainingCount !== 1 ? 's' : ''}
            </p>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceMembers = React.memo(_SpaceMembers);
SpaceMembers.craft = {
  displayName: 'SpaceMembers',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Members',
    members: [],
    max_display: 12,
    columns: 4,
    show_roles: true,
  },
};
