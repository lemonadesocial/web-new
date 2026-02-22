'use client';

import React from 'react';
import { SectionWrapper } from '../SectionWrapper';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface ScheduleSession {
  id?: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  stage?: string;
  speaker_names?: string[];
}

function EventScheduleInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  sessions,
  show_descriptions,
  group_by_stage,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  sessions?: ScheduleSession[];
  show_descriptions?: boolean;
  group_by_stage?: boolean;
}) {
  const displayHeading = heading || 'Schedule';
  const sessionList = Array.isArray(sessions) ? (sessions as ScheduleSession[]) : [];
  const hasSessions = sessionList.length > 0;

  function formatTime(iso?: string): string {
    if (!iso) return '';
    try {
      const date = new Date(iso);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return iso;
    }
  }

  // Group sessions by stage if enabled
  function getGroupedSessions(): Record<string, ScheduleSession[]> {
    const groups: Record<string, ScheduleSession[]> = {};
    for (const session of sessionList) {
      const stage = session.stage || 'Main Stage';
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(session);
    }
    return groups;
  }

  function renderSession(session: ScheduleSession, index: number) {
    const startTime = formatTime(session.start_time);
    const endTime = formatTime(session.end_time);
    const timeLabel = startTime
      ? endTime
        ? `${startTime} - ${endTime}`
        : startTime
      : '';

    return (
      <div
        key={session.id || `session-${index}`}
        className="flex gap-4 sm:gap-6"
      >
        {/* Time column */}
        <div className="flex w-28 shrink-0 flex-col pt-0.5">
          {timeLabel ? (
            <span className="text-sm font-medium text-secondary">
              {timeLabel}
            </span>
          ) : (
            <span className="text-sm text-tertiary opacity-60">No time</span>
          )}
        </div>

        {/* Timeline dot + line */}
        <div className="flex flex-col items-center">
          <div className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-primary bg-primary/20" />
          <div className="w-px grow bg-card-border" />
        </div>

        {/* Content column */}
        <div className="flex flex-col gap-1 pb-6">
          <h3 className="text-base font-semibold text-primary">
            {session.title || 'Untitled Session'}
          </h3>
          {show_descriptions !== false && session.description && (
            <p className="text-sm text-secondary leading-relaxed">
              {session.description}
            </p>
          )}
          {session.speaker_names && session.speaker_names.length > 0 && (
            <p className="text-xs text-tertiary mt-1">
              {session.speaker_names.join(', ')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {displayHeading}
        </h2>

        {hasSessions ? (
          group_by_stage ? (
            /* Grouped by stage */
            <div className="flex flex-col gap-10">
              {Object.entries(getGroupedSessions()).map(([stage, stageSessions]) => (
                <div key={stage} className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-primary border-b border-card-border pb-2">
                    {stage}
                  </h3>
                  <div className="flex flex-col">
                    {stageSessions.map((s, i) => renderSession(s, i))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Flat timeline */
            <div className="flex flex-col">
              {sessionList.map((s, i) => renderSession(s, i))}
            </div>
          )
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 px-6 py-12">
            <svg
              className="size-8 text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No sessions configured
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add sessions to build your event schedule
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventSchedule = React.memo(EventScheduleInner);
EventSchedule.craft = {
  displayName: 'EventSchedule',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Schedule',
    sessions: [],
    show_descriptions: true,
    group_by_stage: false,
  },
};
