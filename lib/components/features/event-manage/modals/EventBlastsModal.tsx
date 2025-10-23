'use client';
import React from 'react';
import { formatDistance, formatDistanceStrict, isBefore, isEqual } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import { useMe } from '$lib/hooks/useMe';
import {
  CreateEventEmailSettingDocument,
  EmailRecipientType,
  EmailSetting,
  EmailTemplateType,
  Event,
  EventJoinRequestState,
  GetListEventEmailSettingsDocument,
  SendEventEmailSettingTestEmailsDocument,
  ToggleEventEmailSettingsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import {
  Button,
  Card,
  Divider,
  DropdownTags,
  InputField,
  modal,
  Option,
  Spacer,
  TextEditor,
  toast,
  Toggle,
} from '$lib/components/core';
import { DateTimePicker } from '$lib/components/core/calendar';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { getEmailBlastsRecipients } from '$lib/utils/event';
import { convertFromUtcToTimezone } from '$lib/utils/date';

function ModalHeader({ icon }: { icon: string }) {
  return (
    <Card.Header className="flex justify-between items-start">
      <div className="rounded-full bg-(--btn-tertiary) text-tertiary flex items-center justify-center size-14">
        <i className={twMerge('size-8', icon)} />
      </div>
      <Button
        variant="tertiary-alt"
        size="xs"
        icon="icon-x size-3.5"
        className="rounded-full"
        onClick={() => modal.close()}
      />
    </Card.Header>
  );
}

export function BlastAdvancedModal({ event, message }: { event: Event; message: string }) {
  const me = useMe();
  const [recipients, setRecipients] = React.useState<{ key: string; value: string }[]>([]);
  const [selectReceipts, setSelectedReceipts] = React.useState<Record<string, string>[]>([]);

  const defaultSubject = `New message in ${event.title}`;
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState(message);
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [scheduleAt, setScheduleAt] = React.useState<string>();

  const [createEmail, { loading: sendingEmail }] = useMutation(CreateEventEmailSettingDocument, {
    onComplete: (client, res) => {
      toast.success('Email created successfully');
      const variables = {
        event: event._id,
        scheduled: true,
        sent: true,
      };
      const data = client.readQuery(GetListEventEmailSettingsDocument, variables);
      const list = (data?.listEventEmailSettings as EmailSetting[]) || [];
      const email = res.createEventEmailSetting as EmailSetting;
      client.writeQuery<any, any>({
        query: GetListEventEmailSettingsDocument,
        variables,
        data: {
          listEventEmailSettings: [...list, email],
        },
      });
      modal.close();
    },
  });

  const [sendTest, { loading: sendingTest }] = useMutation(SendEventEmailSettingTestEmailsDocument, {
    onComplete: () => {
      toast.success('Email send successfully');
    },
  });

  const handleSendPreview = () => {
    sendTest({
      variables: {
        input: {
          event: event._id,
          custom_body_html: body,
          custom_subject_html: subject || defaultSubject,
          type: EmailTemplateType.Custom,
          test_recipients: me?.email ? [me.email] : [],
        },
      },
    });
  };

  const handleSendEmail = () => {
    const join_request_states = selectReceipts
      .filter((i) => i.key in EventJoinRequestState)
      .map((i) => i.key) as EventJoinRequestState[];
    const recipient_types = selectReceipts
      .filter((i) => i.key in EmailRecipientType)
      .map((i) => i.key) as EmailRecipientType[];

    let ticket_types = selectReceipts
      .filter((i) => !(i.key in EmailRecipientType && i.key in EmailRecipientType))
      .map((i) => i.key) as string[];

    if (ticket_types.includes('all_tickets')) {
      ticket_types = event.event_ticket_types?.map((i) => i._id) as string[];
    }

    createEmail({
      variables: {
        input: {
          event: event._id,
          custom_body_html: body,
          custom_subject_html: subject,
          recipient_types,
          type: EmailTemplateType.Custom,
          scheduled_at: scheduleAt,
          recipient_filters: {
            join_request_states,
            ticket_types,
          },
        },
      },
    });
  };

  React.useEffect(() => {
    if (event) {
      let list = [{ key: 'all_tickets', value: 'Going All' }];
      event.event_ticket_types?.map((item) => list.push({ key: item._id, value: `Going - ${item.title}` }));
      list = [
        ...list,
        { key: EventJoinRequestState.Pending, value: 'Pending' },
        { key: EmailRecipientType.Invited, value: 'Invited' },
        { key: EmailRecipientType.TicketIssued, value: 'Issued' },
        { key: EmailRecipientType.TicketCancelled, value: 'Cancel' },
      ];
      setRecipients(list);
      setSelectedReceipts([list[0]]);
    }
  }, [event]);

  return (
    <Card.Root className="w-sm max-w-full md:w-[480px] *:bg-overlay-primary border-none">
      <ModalHeader icon="icon-email" />
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Send Blast</p>
          <p className="text-sm">Guests will receive the blast via email.</p>
        </div>

        {!!recipients.length && (
          <DropdownTags
            label="Recipients"
            value={selectReceipts as Option[]}
            options={recipients}
            onSelect={(values) => setSelectedReceipts(values as Record<string, string>[])}
          />
        )}

        <InputField label="Subject (Optional)" placeholder={defaultSubject} value={subject} onChangeText={setSubject} />

        <TextEditor
          label="Message"
          content={body}
          onChange={(content) => setBody(content)}
          containerClass="bg-background/64 max-h-[200px] overflow-auto"
          placeholder="Share a message with your guests..."
        />

        {showSchedule && (
          <div className="flex justify-between items-center">
            <DateTimePicker value={scheduleAt} onSelect={(datetime) => setScheduleAt(datetime)} placement="top-start" />
            <Button
              icon="icon-x"
              size="sm"
              variant="flat"
              onClick={() => {
                setScheduleAt(undefined);
                setShowSchedule(false);
              }}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            className="px-0 text-tertiary! hover:text-primary!"
            variant="flat"
            size="sm"
            loading={sendingTest}
            onClick={handleSendPreview}
          >
            Send Preview
          </Button>

          <div className="flex gap-2">
            {!showSchedule && (
              <Button
                variant="tertiary-alt"
                size="sm"
                onClick={() => {
                  setScheduleAt(new Date().toISOString());
                  setShowSchedule(true);
                }}
              >
                Schedule
              </Button>
            )}

            <Button
              variant="secondary"
              iconLeft={showSchedule ? 'icon-clock' : ''}
              size="sm"
              loading={sendingEmail}
              onClick={handleSendEmail}
            >
              {showSchedule ? 'Schedule' : 'Send'}
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

export function EventReminderModal({ event, reminderEmails = [] }: { event: Event; reminderEmails?: EmailSetting[] }) {
  const [autoSend, setAutoSend] = React.useState(reminderEmails[0]?.disabled);

  const [toggleEmailSettings, { client }] = useMutation(ToggleEventEmailSettingsDocument);

  const handleToggleReminder = async (toggle: boolean) => {
    try {
      const ids = reminderEmails.map((i) => i._id);

      const { data, error } = await toggleEmailSettings({ variables: { event: event._id, ids, disabled: toggle } });

      if (error) {
        toast.error('Cannot toggle reminder emails!');
        return;
      }

      if (data?.toggleEventEmailSettings) {
        reminderEmails.forEach((item) =>
          client.writeFragment({ id: `EmailSetting:${item._id}`, data: { ...item, disabled: toggle } }),
        );

        toast.success(`${!toggle ? 'Enabled' : 'Disabled'} send event reminder emails.`);
      }
    } catch (_error) {
      toast.error('Cannot toggle reminder emails!');
    }
  };

  const availabled = reminderEmails.filter((item) => !item.sent_at).length > 0;

  return (
    <Card.Root className="w-sm max-w-full md:w-[480px] *:bg-overlay-primary border-none">
      <ModalHeader icon="icon-bell" />
      <Card.Content className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Event Reminders</p>
          <p className="text-sm">If enabled, we send reminders to guests 1 day and 2 hours before the event.</p>
        </div>

        <div className="flex justify-between items-center">
          <p>Send Automatic Reminders</p>
          <Toggle
            id="event_reminder_toggle"
            disabled={!availabled}
            checked={!!autoSend}
            onChange={(value) => {
              setAutoSend(value);
              handleToggleReminder(!value);
            }}
          />
        </div>

        {availabled && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-tertiary">The following reminders are set up for this event:</p>
            <Card.Root>
              <Card.Content className="p-0">
                {reminderEmails.map((item) => {
                  if (item.sent_at) return null;

                  return (
                    <React.Fragment key={item._id}>
                      <div className="px-4 py-3">
                        <p>
                          {event.title} is starting {formatDistance(new Date(), item.scheduled_at)}
                        </p>
                        <div className="flex gap-1.5 items-center">
                          <span>To: {getEmailBlastsRecipients(item)}</span>
                          <div className="size-0.5 rounded-full bg-(--color-primary)" />
                          <span>{item.sent_at ? 'Sent' : 'Not Sent'}</span>
                        </div>
                      </div>
                      <Divider />
                    </React.Fragment>
                  );
                })}
              </Card.Content>
            </Card.Root>
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
}

export function ScheduleFeedbackModal({ event }: { event: Event }) {
  const me = useMe();
  const eventEndDate = convertFromUtcToTimezone(event.end, event.timezone).toISOString();

  const defaultSubject = `New message in ${event.title}`;
  const [subject, setSubject] = React.useState<string>(`Thanks for joining ${event.title}`);
  const [body, setBody] = React.useState<string>();
  const [scheduleAt, setScheduleAt] = React.useState<string>(eventEndDate);

  const [createEmail, { loading: sendingEmail }] = useMutation(CreateEventEmailSettingDocument, {
    onComplete: (client, res) => {
      toast.success('Email created successfully');
      const variables = {
        event: event._id,
        scheduled: true,
        sent: true,
      };
      const data = client.readQuery(GetListEventEmailSettingsDocument, variables);
      const list = data?.listEventEmailSettings as EmailSetting[];
      const email = res.createEventEmailSetting as EmailSetting;
      client.writeQuery<any, any>({
        query: GetListEventEmailSettingsDocument,
        variables,
        data: {
          listEventEmailSettings: [...list, email],
        },
      });

      modal.close();
    },
  });

  const [sendTest, { loading: sendingTest }] = useMutation(SendEventEmailSettingTestEmailsDocument, {
    onComplete: () => {
      toast.success('Email send successfully');
    },
  });

  const handleSendPreview = () => {
    sendTest({
      variables: {
        input: {
          event: event._id,
          custom_body_html: body,
          custom_subject_html: subject || defaultSubject,
          type: EmailTemplateType.Feedback,
          test_recipients: me?.email ? [me.email] : [],
        },
      },
    });
  };

  const handleSendEmail = () => {
    createEmail({
      variables: {
        input: {
          event: event._id,
          custom_body_html: body,
          custom_subject_html: subject,
          recipient_types: [EmailRecipientType.Registration],
          type: EmailTemplateType.Feedback,
          scheduled_at: scheduleAt,
        },
      },
    });
  };

  const getFormatTime = (date: Date) => {
    if (isBefore(eventEndDate, date) || isEqual(eventEndDate, date)) return '';
    return formatDistanceStrict(eventEndDate, date);
  };

  return (
    <Card.Root className="w-sm max-w-full md:w-[480px] *:bg-overlay-primary border-none">
      <ModalHeader icon="icon-star-outline" />
      <Card.Content className="flex flex-col gap-4">
        <p className="text-lg">Schedule Feedback Email</p>
        <div>
          <p className="text-secondary text-sm">When should the feedback email be sent?</p>
          <Spacer className="h-1.5" />
          <DateTimePicker
            value={scheduleAt}
            minDate={new Date(eventEndDate)}
            onSelect={(datetime) => setScheduleAt(datetime)}
            placement="bottom-start"
          />
          <Spacer className="h-2" />
          <p className="text-secondary text-sm">
            {getFormatTime(new Date(scheduleAt)) || 'Immediately'} after the event ends
          </p>
        </div>

        <InputField label="Subject" value={subject} onChangeText={(value) => setSubject(value)} />
        <TextEditor
          label="Message"
          content={body}
          containerClass="bg-background/64"
          onChange={(content) => setBody(content)}
        />

        <div className="flex flex-col gap-1.5">
          <p className="text-secondary text-sm">What did you think of {event.title}?</p>

          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => i + 1)
              .reverse()
              .map((i) => (
                <div
                  key={i}
                  className="bg-(--btn-tertiary) rounded-sm size-9 aspect-square flex items-center justify-center"
                >
                  <img src={`${ASSET_PREFIX}/assets/images/rate-${i}.png`} width={20} height={20} />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            className="px-0 text-tertiary! hover:text-primary!"
            variant="flat"
            size="sm"
            loading={sendingTest}
            onClick={handleSendPreview}
          >
            Send Preview
          </Button>
          <Button variant="secondary" iconLeft="icon-clock" size="sm" loading={sendingEmail} onClick={handleSendEmail}>
            Schedule Feedback Email
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
