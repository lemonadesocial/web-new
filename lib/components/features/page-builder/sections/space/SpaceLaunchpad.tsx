'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface LaunchpadProject {
  id: string;
  name: string;
  image_url?: string;
  status?: string;
  raised?: number;
  goal?: number;
  currency?: string;
}

interface SpaceLaunchpadProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  description?: string;
  projects?: LaunchpadProject[];
  columns?: 2 | 3;
}

function getStatusColor(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'live':
      return 'bg-green-500/20 text-green-400';
    case 'upcoming':
      return 'bg-blue-500/20 text-blue-400';
    case 'ended':
    case 'closed':
      return 'bg-red-500/20 text-red-400';
    case 'funded':
      return 'bg-purple-500/20 text-purple-400';
    default:
      return 'bg-primary/8 text-secondary';
  }
}

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  return (
    <div className="mt-3 w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-secondary">
          {percentage.toFixed(0)}% raised
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/8">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: LaunchpadProject }) {
  const hasImage = project.image_url && project.image_url.trim().length > 0;
  const hasGoal =
    typeof project.goal === 'number' && project.goal > 0;
  const hasRaised = typeof project.raised === 'number';
  const currency = project.currency || 'USD';

  return (
    <div className="overflow-hidden rounded-md border border-card-border bg-primary/4 transition hover:border-primary/20">
      {/* Project image */}
      {hasImage ? (
        <div className="aspect-video w-full overflow-hidden bg-primary/8">
          <img
            src={project.image_url}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-primary/4">
          <i className="icon-rocket size-8 text-tertiary" />
        </div>
      )}

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-primary line-clamp-1">
            {project.name || 'Untitled Project'}
          </h3>
          {project.status && (
            <span
              className={clsx(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                getStatusColor(project.status),
              )}
            >
              {project.status}
            </span>
          )}
        </div>

        {/* Raised / Goal */}
        {hasGoal && hasRaised && (
          <>
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-secondary">
                <span className="font-semibold text-primary">
                  {project.raised!.toLocaleString()} {currency}
                </span>{' '}
                raised
              </span>
              <span className="text-tertiary">
                of {project.goal!.toLocaleString()} {currency}
              </span>
            </div>
            <ProgressBar raised={project.raised!} goal={project.goal!} />
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-rocket size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No projects yet</p>
      <p className="mt-1 text-xs text-tertiary">
        Launchpad projects will appear here
      </p>
    </div>
  );
}

function _SpaceLaunchpad({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Launchpad',
  description = '',
  projects = [],
  columns = 2,
}: SpaceLaunchpadProps) {
  const hasProjects = projects.length > 0;
  const hasDescription = description && description.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {heading || 'Launchpad'}
        </h2>
        {hasDescription && (
          <p className="mt-2 text-sm text-secondary">{description}</p>
        )}
      </div>

      {/* Projects grid or empty state */}
      {hasProjects ? (
        <div
          className={clsx(
            'grid gap-4',
            columns === 2 && 'grid-cols-1 sm:grid-cols-2',
            columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceLaunchpad = React.memo(_SpaceLaunchpad);
SpaceLaunchpad.craft = {
  displayName: 'SpaceLaunchpad',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Launchpad',
    description: '',
    projects: [],
    columns: 2,
  },
};
