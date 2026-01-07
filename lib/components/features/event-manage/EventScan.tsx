'use client';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';

import { Button, modal, Spacer, Skeleton } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { formatWithTimezone } from '$lib/utils/date';
import { useQuery } from '$lib/graphql/request';
import { GetEventGuestsStatisticsDocument } from '$lib/graphql/generated/backend/graphql';
import { EventProtected } from '../event-manage/EventProtected';
import { TicketCheckInModal } from './modals/TicketCheckInModal';

export function EventScan({ shortid }: { shortid: string }) {
  return (
    <EventProtected shortid={shortid}>
      {(event: Event) => <EventScanContent event={event} />}
    </EventProtected>
  );
}

function EventScanContent({ event }: { event: Event }) {
  const router = useRouter();

  const eventDate = event.start
    ? formatWithTimezone(event.start, 'MMM d, h:mm a OOO', event.timezone as string)
    : '';

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const value = detectedCodes[0].rawValue;
      modal.open(TicketCheckInModal, {
        props: {
          event,
          shortId: value,
          onClose: () => modal.close(),
        },
      });
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
  };

  return (
    <div className="page mx-auto py-4 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p>{event.title}</p>
          {eventDate && <p className="text-tertiary text-sm">{eventDate}</p>}
        </div>
        <Button
          variant="tertiary"
          iconLeft="icon-list-bulleted"
          size="sm"
          onClick={() => router.push(`/e/check-in/${event.shortid}`)}
        >
          Guest List
        </Button>
      </div>

      <Spacer size="md" />
      <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />

      <Spacer size="md" />

      <div className="rounded-md border-card-border aspect-video overflow-hidden">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          styles={{
            container: {
              width: '100%',
              height: '100%',
            },
          }}
          components={{
            finder: false
          }}
        />
      </div>

      <Spacer size="md" />

      <GuestStatsCard event={event} />
    </div>
  );
}

interface GuestStatus {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

function GuestStatsCard({ event }: { event: Event }) {
  const { data, loading } = useQuery(GetEventGuestsStatisticsDocument, {
    variables: {
      event: event._id,
    },
  });

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton animate className="h-6 w-24 rounded" />
          <Skeleton animate className="h-6 w-20 rounded" />
        </div>
        <Skeleton animate className="h-2 w-full rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton animate className="h-4 w-24 rounded" key={i} />
          ))}
        </div>
        <Skeleton animate className="h-4 w-32 rounded mt-2" />
      </div>
    );
  }

  if (!data?.getEventGuestsStatistics) return null;

  const stats = data.getEventGuestsStatistics;

  const progressBarStatuses: GuestStatus[] = [
    {
      label: 'Checked In',
      count: stats.checked_in,
      color: 'text-success-500',
      bgColor: 'bg-success-500',
    },
    {
      label: 'Pending Approval',
      count: stats.pending_approval,
      color: 'text-warning-500',
      bgColor: 'bg-warning-500',
    },
    {
      label: 'Invited',
      count: stats.pending_invite,
      color: 'text-alert-400',
      bgColor: 'bg-alert-400',
    },
    {
      label: 'Not Going',
      count: stats.declined,
      color: 'text-secondary',
      bgColor: 'bg-secondary',
    },
  ];

  const legendStatuses: GuestStatus[] = [
    {
      label: 'Pending Approval',
      count: stats.pending_approval,
      color: 'text-warning-500',
      bgColor: 'bg-warning-500',
    },
    {
      label: 'Invited',
      count: stats.pending_invite,
      color: 'text-alert-400',
      bgColor: 'bg-alert-400',
    },
    {
      label: 'Not Going',
      count: stats.declined,
      color: 'text-secondary',
      bgColor: 'bg-secondary',
    },
  ];

  const totalGuests = progressBarStatuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <div className="p-4 pb-3 bg-primary/8 rounded-md space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-success-500">
            <span className="text-xl font-semibold">{stats.checked_in}</span>{' '}
            <span>Checked In</span>
          </p>
          <p className="text-tertiary">
            <span className="font-semibold">{stats.going}</span> Going
          </p>
        </div>

        <div className="flex h-2 rounded-full overflow-hidden">
          {progressBarStatuses.map((status, index) => {
            const percentage = totalGuests > 0 ? (status.count / totalGuests) * 100 : 0;
            const isLast = index === progressBarStatuses.length - 1;
            const isFirst = index === 0;

            return (
              <div
                key={status.label}
                className={`${status.bgColor} ${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                style={{ width: `${percentage}%` }}
              />
            );
          })}
        </div>

        <div className="flex gap-2 flex-wrap">
          {legendStatuses.map((status) => (
            <div key={status.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.bgColor}`} />
              <p className={`text-sm ${status.color}`}>
                {status.count}{' '}{status.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <NextLink
        href={`/e/manage/${event.shortid}`}
        className="flex items-center gap-1 text-tertiary hover:text-primary transition-colors w-fit"
      >
        <p className="text-tertiary">Manage Event Page</p>
        <i className="icon-arrow-outward size-5 text-quaternary" />
      </NextLink>
    </div>
  );
}

