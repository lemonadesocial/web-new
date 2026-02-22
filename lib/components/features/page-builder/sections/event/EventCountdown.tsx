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

/**
 * Compute the time remaining from now until a target date.
 * Returns { days, hours, minutes, seconds, expired }.
 */
function computeTimeRemaining(target: string) {
  try {
    const targetMs = new Date(target).getTime();
    const nowMs = Date.now();
    const diff = targetMs - nowMs;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, expired: false };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  }
}

function padTwo(n: number): string {
  return String(n).padStart(2, '0');
}

function _EventCountdown({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  target_date,
  show_days,
  show_hours,
  show_minutes,
  show_seconds,
  expired_text,
  ...rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  target_date?: string;
  show_days?: boolean;
  show_hours?: boolean;
  show_minutes?: boolean;
  show_seconds?: boolean;
  expired_text?: string;
}) {
  const displayHeading = heading || 'Event Starts In';
  const expiredMessage = expired_text || 'Event has started!';

  // If no target_date, show placeholder "00" values
  const hasTarget = !!target_date;
  const time = hasTarget
    ? computeTimeRemaining(target_date as string)
    : { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

  const showDays = show_days !== false;
  const showHours = show_hours !== false;
  const showMinutes = show_minutes !== false;
  const showSeconds = show_seconds !== false;

  const units: { label: string; value: string }[] = [];
  if (showDays) units.push({ label: 'Days', value: padTwo(time.days) });
  if (showHours) units.push({ label: 'Hours', value: padTwo(time.hours) });
  if (showMinutes) units.push({ label: 'Minutes', value: padTwo(time.minutes) });
  if (showSeconds) units.push({ label: 'Seconds', value: padTwo(time.seconds) });

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {displayHeading}
        </h2>

        {hasTarget && time.expired ? (
          /* Expired state */
          <p className="text-lg font-semibold text-secondary">
            {expiredMessage}
          </p>
        ) : (
          /* Countdown boxes */
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {units.map((unit, index) => (
              <React.Fragment key={unit.label}>
                {index > 0 && (
                  <span className="text-3xl sm:text-4xl font-bold text-tertiary select-none hidden sm:block">
                    :
                  </span>
                )}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={clsx(
                      'flex items-center justify-center rounded-lg border border-card-border bg-primary/4',
                      'min-w-[72px] sm:min-w-[96px] px-4 py-4 sm:py-6',
                    )}
                  >
                    <span className="text-3xl sm:text-5xl font-bold tabular-nums text-primary">
                      {unit.value}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-secondary">
                    {unit.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {!hasTarget && (
          <p className="text-sm text-tertiary opacity-60">
            Set a target date to start the countdown
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventCountdown = React.memo(_EventCountdown);
EventCountdown.craft = {
  displayName: 'EventCountdown',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: 'Event Starts In',
    target_date: '',
    show_days: true,
    show_hours: true,
    show_minutes: true,
    show_seconds: true,
    expired_text: 'Event has started!',
  },
};
