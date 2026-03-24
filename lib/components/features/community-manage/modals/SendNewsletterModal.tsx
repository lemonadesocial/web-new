'use client';

import React from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core/button/button';
import { Calendar } from '$lib/components/core/calendar';
import { modal } from '$lib/components/core/dialog/modal';
import { Menu } from '$lib/components/core/menu/menu';
import { toast } from '$lib/components/core/toast/toast';
import {
  EmailRecipientType,
  GetSpaceMembersDocument,
  GetSpaceTagsDocument,
  SpaceTagFragmentFragmentDoc,
  SpaceTagType,
  UpdateSpaceNewsletterDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { useMutation, useQuery } from '$lib/graphql/request';
import { getUserTimezoneOption } from '$lib/utils/timezone';

type RecipientTypeOption = {
  kind: 'type';
  key: string;
  label: string;
  count?: number | null;
  icon: string;
  value: EmailRecipientType;
};

type RecipientTagOption = {
  kind: 'tag';
  key: string;
  label: string;
  count?: number | null;
  color: string;
  value: string;
};

type RecipientOption = RecipientTypeOption | RecipientTagOption;
const DEFAULT_TIMEZONE = 'UTC';
const RECIPIENT_TAGS_SECTION_LABEL = 'Tags';
const NO_RECIPIENTS_FOUND_LABEL = 'No recipients found.';
const SCHEDULE_TIMES = Array.from({ length: 24 }, (_, hour) =>
  Array.from({ length: 2 }, (_, index) => {
    const minutes = index * 30;
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return {
      value: `${hour.toString().padStart(2, '0')}:${formattedMinutes}`,
      label: `${formattedHour}:${formattedMinutes} ${period}`,
    };
  }),
).flat();

function createTypeKey(value: EmailRecipientType) {
  return `type:${value}`;
}

function createTagKey(value: string) {
  return `tag:${value}`;
}

function formatCount(value?: number | null) {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat('en-US').format(value);
}

function getOptionLabel(option: RecipientOption) {
  const count = formatCount(option.count);
  return count ? `${option.label} (${count})` : option.label;
}

function getDefaultScheduleAt() {
  const date = new Date();
  date.setSeconds(0, 0);

  const minutes = date.getMinutes();
  if (minutes === 0 || minutes === 30) {
    return date.toISOString();
  }

  date.setMinutes(minutes < 30 ? 30 : 60);
  return date.toISOString();
}

function MiniQuotaRing({ available, total }: { available: number; total: number }) {
  const usedPercent = total > 0 ? Math.min(Math.max(((total - available) / total) * 100, 0), 100) : 0;
  const radius = 6.5;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex size-4 items-center justify-center text-primary">
      <svg className="-rotate-90 size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r={radius} stroke="currentColor" strokeOpacity="0.24" strokeWidth="2" />
        <circle
          cx="8"
          cy="8"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * usedPercent) / 100}
        />
      </svg>
    </div>
  );
}

function RecipientItem({
  option,
  selected,
  onToggle,
}: {
  option: RecipientOption;
  selected: boolean;
  onToggle: (key: string) => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-xs px-2 py-1.5 text-left transition hover:bg-primary/8"
      onClick={() => onToggle(option.key)}
    >
      {option.kind === 'tag' ? (
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: option.color }}
          aria-hidden="true"
        />
      ) : (
        <i aria-hidden="true" className={twMergeOptionIcon(option.icon)} />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium">
        <span className="truncate text-secondary">{option.label}</span>
        {option.count !== null && option.count !== undefined && (
          <span className="truncate text-tertiary">{formatCount(option.count)}</span>
        )}
      </div>

      <i
        aria-hidden="true"
        className={clsx('size-4 shrink-0', selected ? 'icon-square-check text-primary' : 'icon-square text-quaternary')}
      />
    </button>
  );
}

function twMergeOptionIcon(icon: string) {
  return clsx('size-4 shrink-0 text-tertiary', icon);
}

function RecipientDropdown({
  options,
  selectedKeys,
  onToggle,
}: {
  options: RecipientOption[];
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const selectedOptions = React.useMemo(
    () => options.filter((option) => selectedKeys.has(option.key)),
    [options, selectedKeys],
  );

  const visibleTypeOptions = React.useMemo(
    () =>
      options.filter(
        (option) =>
          option.kind === 'type' &&
          (!query || option.label.toLowerCase().includes(query.trim().toLowerCase())),
      ) as RecipientTypeOption[],
    [options, query],
  );

  const visibleTagOptions = React.useMemo(
    () =>
      options.filter(
        (option) =>
          option.kind === 'tag' &&
          (!query || option.label.toLowerCase().includes(query.trim().toLowerCase())),
      ) as RecipientTagOption[],
    [options, query],
  );

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-secondary">Recipients</p>

      <Menu.Root className="w-full" placement="bottom-start" strategy="fixed" withFlip isOpen={isOpen} onOpenChange={setIsOpen}>
        <Menu.Trigger className="block w-full">
          <div className="flex min-h-10 w-full items-start rounded-sm border border-primary/8 bg-background/64">
            <div className="flex flex-1 flex-wrap gap-0.5 p-1">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <div
                    key={option.key}
                    className="flex h-8 max-w-full items-center gap-1.5 rounded-xs bg-primary/8 px-2.5 py-1.5"
                  >
                    <span className="truncate text-sm font-medium text-primary">{getOptionLabel(option)}</span>
                    <button
                      type="button"
                      className="shrink-0 text-tertiary transition hover:text-primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggle(option.key);
                      }}
                      aria-label={`Remove ${option.label}`}
                    >
                      <i aria-hidden="true" className="icon-x size-4" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="px-2.5 py-1.5 text-sm font-medium text-quaternary">Choose recipients</span>
              )}
            </div>

            <div className="flex h-10 shrink-0 items-center px-2.5 text-tertiary">
              <i aria-hidden="true" className={clsx('icon-chevron-down size-5 transition', isOpen && 'rotate-180')} />
            </div>
          </div>
        </Menu.Trigger>

        <FloatingPortal>
          <Menu.Content className="w-[308px] max-w-[calc(100vw-40px)] overflow-hidden p-0 shadow-[0_4px_8px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="border-b border-card-border bg-card px-3 py-2">
              <input
                value={query}
                placeholder="Search"
                className="w-full bg-transparent text-base font-medium text-primary outline-none placeholder:text-quaternary"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="max-h-[280px] overflow-y-auto p-1 no-scrollbar">
              {visibleTypeOptions.map((option) => (
                <RecipientItem
                  key={option.key}
                  option={option}
                  selected={selectedKeys.has(option.key)}
                  onToggle={onToggle}
                />
              ))}

              {visibleTagOptions.length > 0 && (
                <>
                  <div className="mt-1 border-t border-card-border px-2 py-1.5">
                    <p className="text-xs font-medium text-tertiary">{RECIPIENT_TAGS_SECTION_LABEL}</p>
                  </div>

                  {visibleTagOptions.map((option) => (
                    <RecipientItem
                      key={option.key}
                      option={option}
                      selected={selectedKeys.has(option.key)}
                      onToggle={onToggle}
                    />
                  ))}
                </>
              )}

              {visibleTypeOptions.length === 0 && visibleTagOptions.length === 0 && (
                <div className="px-2 py-1.5 text-sm font-medium text-tertiary">{NO_RECIPIENTS_FOUND_LABEL}</div>
              )}
            </div>
          </Menu.Content>
        </FloatingPortal>
      </Menu.Root>
    </div>
  );
}

function ScheduleInput({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  const timezone = getUserTimezoneOption()?.value || DEFAULT_TIMEZONE;
  const [date, setDate] = React.useState(() => toZonedTime(new Date(value), timezone));

  React.useEffect(() => {
    setDate(toZonedTime(new Date(value), timezone));
  }, [timezone, value]);

  const handleSelect = (nextDate: Date) => {
    setDate(nextDate);
    onChange(nextDate.toISOString());
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-secondary">Schedule For</p>

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 pr-px">
          <Menu.Root className="flex-1" placement="top-start">
            <Menu.Trigger className="block w-full">
              <div className="flex h-10 w-full items-center rounded-l-sm border border-primary/8 bg-background/64 px-3.5">
                <span className="truncate text-base font-medium text-primary">{format(date, 'EEE, MMM d')}</span>
              </div>
            </Menu.Trigger>

            <FloatingPortal>
              <Menu.Content className="w-[296px] rounded-lg p-0">
                {({ toggle }) => (
                  <Calendar
                    minDate={new Date()}
                    selected={date}
                    onSelectDate={(selectedDate = new Date()) => {
                      const nextDate = new Date(date);
                      nextDate.setFullYear(selectedDate.getFullYear());
                      nextDate.setMonth(selectedDate.getMonth());
                      nextDate.setDate(selectedDate.getDate());
                      handleSelect(nextDate);
                      toggle();
                    }}
                  />
                )}
              </Menu.Content>
            </FloatingPortal>
          </Menu.Root>

          <Menu.Root className="-ml-px w-[108px]" placement="top-start">
            <Menu.Trigger className="block w-full">
              <div className="flex h-10 w-full items-center rounded-r-sm border border-primary/8 bg-background/64 px-3.5">
                <span className="truncate text-base font-medium text-primary">{format(date, 'hh:mm a')}</span>
              </div>
            </Menu.Trigger>

            <FloatingPortal>
              <Menu.Content className="h-[200px] w-[108px] overflow-auto rounded-lg p-2 no-scrollbar">
                {({ toggle }) => (
                  <div>
                    {SCHEDULE_TIMES.map((time) => (
                      <Button
                        key={time.value}
                        type="button"
                        variant="flat"
                        className="w-full whitespace-nowrap hover:bg-quaternary!"
                        onClick={() => {
                          const [hours, minutes] = time.value.split(':').map(Number);
                          const nextDate = new Date(date);
                          nextDate.setHours(hours);
                          nextDate.setMinutes(minutes);
                          handleSelect(nextDate);
                          toggle();
                        }}
                      >
                        {time.label}
                      </Button>
                    ))}
                  </div>
                )}
              </Menu.Content>
            </FloatingPortal>
          </Menu.Root>
        </div>

        <button
          type="button"
          className="shrink-0 text-tertiary transition hover:text-primary"
          onClick={onClear}
          aria-label="Clear schedule"
        >
          <i aria-hidden="true" className="icon-x size-5" />
        </button>
      </div>
    </div>
  );
}

export function SendNewsletterModal({
  uid,
  spaceId,
  draftId,
  subject,
  body,
  adminsCount,
  availableSends,
  totalSends,
}: {
  uid: string;
  spaceId: string;
  draftId: string;
  subject: string;
  body: string;
  adminsCount: number;
  availableSends: number;
  totalSends: number;
}) {
  const router = useRouter();
  const listHref = `/s/manage/${uid}/newsletters`;

  const [mode, setMode] = React.useState<'send' | 'schedule'>('send');
  const [scheduleAt, setScheduleAt] = React.useState<string | undefined>();
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    () => new Set([createTypeKey(EmailRecipientType.SpaceSubscribers)]),
  );

  const { data: tagsData } = useQuery(GetSpaceTagsDocument, {
    variables: { space: spaceId },
    skip: !spaceId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: membersData } = useQuery(GetSpaceMembersDocument, {
    variables: { space: spaceId, limit: 1 },
    skip: !spaceId,
    fetchPolicy: 'cache-and-network',
  });

  const [sendNewsletter, { loading }] = useMutation(UpdateSpaceNewsletterDocument);

  const memberTags = React.useMemo(() => {
    const tags = useFragment(SpaceTagFragmentFragmentDoc, tagsData?.listSpaceTags || []);

    return tags.filter((tag) => tag.type === SpaceTagType.Member);
  }, [tagsData?.listSpaceTags]);

  const typeOptions = React.useMemo<RecipientTypeOption[]>(
    () => [
      {
        kind: 'type',
        key: createTypeKey(EmailRecipientType.SpaceSubscribers),
        label: 'All People',
        count: membersData?.listSpaceMembers.total,
        icon: 'icon-user-group-outline',
        value: EmailRecipientType.SpaceSubscribers,
      },
      {
        kind: 'type',
        key: createTypeKey(EmailRecipientType.SpaceAdmins),
        label: 'Admins',
        count: adminsCount,
        icon: 'icon-person-outline',
        value: EmailRecipientType.SpaceAdmins,
      },
      {
        kind: 'type',
        key: createTypeKey(EmailRecipientType.SpaceAmbassadors),
        label: 'Brand Ambassadors',
        icon: 'icon-person-check',
        value: EmailRecipientType.SpaceAmbassadors,
      },
      {
        kind: 'type',
        key: createTypeKey(EmailRecipientType.SpaceEventHosts),
        label: 'Event Hosts',
        icon: 'icon-crown',
        value: EmailRecipientType.SpaceEventHosts,
      },
      {
        kind: 'type',
        key: createTypeKey(EmailRecipientType.SpaceEventAttendees),
        label: 'Event Guests',
        icon: 'icon-person-pin-rounded',
        value: EmailRecipientType.SpaceEventAttendees,
      },
    ],
    [adminsCount, membersData?.listSpaceMembers.total],
  );

  const tagOptions = React.useMemo<RecipientTagOption[]>(
    () =>
      memberTags.map((tag) => ({
        kind: 'tag',
        key: createTagKey(tag._id),
        label: tag.tag,
        count: tag.targets?.length,
        color: tag.color,
        value: tag._id,
      })),
    [memberTags],
  );

  const recipientOptions = React.useMemo<RecipientOption[]>(
    () => [...typeOptions, ...tagOptions],
    [tagOptions, typeOptions],
  );

  const canSubmit = selectedKeys.size > 0 && (mode === 'send' || !!scheduleAt);

  const handleToggleRecipient = React.useCallback((key: string) => {
    setSelectedKeys((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleOpenSchedule = () => {
    setScheduleAt((previous) => previous || getDefaultScheduleAt());
    setMode('schedule');
  };

  const handleClearSchedule = () => {
    setScheduleAt(undefined);
    setMode('send');
  };

  const handleSend = async () => {
    const selectedTypes = typeOptions
      .filter((option) => selectedKeys.has(option.key))
      .map((option) => option.value);
    const selectedTagIds = tagOptions
      .filter((option) => selectedKeys.has(option.key))
      .map((option) => option.value);

    const recipientTypes = new Set<EmailRecipientType>(selectedTypes);
    let recipientFilters:
      | {
          space_members: {
            space_tags: string[];
            include_untagged: boolean;
          };
        }
      | undefined;

    if (!recipientTypes.has(EmailRecipientType.SpaceSubscribers) && selectedTagIds.length > 0) {
      if (memberTags.length > 0 && selectedTagIds.length === memberTags.length) {
        recipientTypes.add(EmailRecipientType.SpaceSubscribers);
      } else {
        recipientTypes.add(EmailRecipientType.SpaceTaggedPeople);
        recipientFilters = {
          space_members: {
            space_tags: selectedTagIds,
            include_untagged: false,
          },
        };
      }
    }

    const result = await sendNewsletter({
      variables: {
        input: {
          _id: draftId,
          draft: false,
          custom_subject_html: subject,
          custom_body_html: body,
          recipient_types: Array.from(recipientTypes),
          recipient_filters: recipientFilters,
          scheduled_at: mode === 'schedule' ? scheduleAt : undefined,
        },
      },
    });

    if (result.error) {
      toast.error(mode === 'schedule' ? 'Unable to schedule newsletter' : 'Unable to send newsletter');
      return;
    }

    toast.success(mode === 'schedule' ? 'Newsletter scheduled' : 'Newsletter sent');
    modal.close();
    router.push(listHref);
  };

  return (
    <div className="w-[340px] max-w-full">
      <div className="flex items-start justify-between p-4 pb-0">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/8 text-tertiary">
          <i aria-hidden="true" className="icon-email size-8" />
        </div>

        <Button
          type="button"
          icon="icon-x size-3.5"
          size="xs"
          variant="tertiary-alt"
          className="rounded-full"
          onClick={() => modal.close()}
          aria-label="Close"
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-lg font-medium text-primary">Send Newsletter</p>
          <p className="text-sm font-medium text-secondary">
            Choose who you&apos;d like to send your newsletter to and schedule it for sending.
          </p>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
            <MiniQuotaRing available={availableSends} total={totalSends} />
            <span>{formatCount(availableSends) || 0} Sends Available</span>
            <i aria-hidden="true" className="icon-chevron-right size-[18px] text-tertiary" />
          </div>
        </div>

        <RecipientDropdown options={recipientOptions} selectedKeys={selectedKeys} onToggle={handleToggleRecipient} />

        {mode === 'schedule' && scheduleAt && (
          <ScheduleInput value={scheduleAt} onChange={setScheduleAt} onClear={handleClearSchedule} />
        )}

        {mode === 'send' ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="base"
              variant="secondary"
              className="flex-1"
              loading={loading}
              disabled={!canSubmit}
              onClick={handleSend}
            >
              Send Now
            </Button>

            <Button
              type="button"
              size="base"
              variant="tertiary"
              icon="icon-clock"
              className="size-10 shrink-0 p-0"
              onClick={handleOpenSchedule}
              aria-label="Schedule newsletter"
            />
          </div>
        ) : (
          <Button
            type="button"
            size="base"
            variant="secondary"
            className="w-full"
            loading={loading}
            disabled={!canSubmit}
            onClick={handleSend}
          >
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}
