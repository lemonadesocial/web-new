'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { merge } from 'lodash';
import {
  Button,
  Card,
  Divider,
  DropdownTags,
  InputField,
  modal,
  Spacer,
  TextEditor,
  toast,
  Toggle,
} from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { DateTimePicker } from '$lib/components/core/calendar';
import { ASSET_PREFIX } from '$lib/utils/constants';
import {
  CreateEventEmailSettingDocument,
  EmailRecipientType,
  EmailSetting,
  EmailTemplateType,
  Event,
  EventJoinRequestState,
  GetListEventEmailSettingsDocument,
  SendEventEmailSettingTestEmailsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useEvent } from './store';
import { useMutation, useQuery } from '$lib/graphql/request';
import { isMobile } from 'react-device-detect';
import { JOIN_REQUEST_STATE_MAP, RECIPIENT_TYPE_MAP } from '$lib/utils/email';
import { format } from 'date-fns';

export function EventBlasts() {
  const event = useEvent();

  if (!event) return null;

  const { data } = useQuery(GetListEventEmailSettingsDocument, {
    variables: {
      event: event._id,
      scheduled: true,
      sent: true,
    },
    skip: !event?._id,
    fetchPolicy: 'cache-and-network',
  });

  const emailScheduled = data?.listEventEmailSettings.filter((i) => !i.sent_at) as EmailSetting[];
  const emailSent = data?.listEventEmailSettings.filter((i) => i.sent_at) as EmailSetting[];

  const getRecipients = (item: EmailSetting) => {
    const list = item.recipient_types?.map((type) => RECIPIENT_TYPE_MAP.get(type)) || [];
    if (item.recipient_filters?.ticket_types?.length) list.push('Going');
    if (item.recipient_filters?.join_request_states) {
      const arr = item.recipient_filters?.join_request_states.map((state) => JOIN_REQUEST_STATE_MAP.get(state));
    }

    return list.join(', ');
  };

  return (
    <>
      <BlastsInput event={event} />
      <Spacer className="h-6" />

      {!!emailScheduled?.length && (
        <div>
          <p className="text-sm text-tertiary">Scheduled</p>
          <Spacer className="h-2" />
          <div className="flex flex-col gap-3">
            {emailScheduled.map((item) => (
              <Card.Root key={item._id}>
                <Card.Content className="flex items-center justify-between">
                  <div>
                    <p>{item.subject_preview}</p>
                    <p className="text-sm text-tertiary">Sending to: {getRecipients(item)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-warning-400">
                    <i className="icon-clock size-4" />
                    <p className="text-sm">{format(item.scheduled_at, 'MMM dd, h:mm a')}</p>
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
          <Spacer className="h-6" />
        </div>
      )}

      {!!emailSent?.length && (
        <div>
          <p className="text-sm text-tertiary">Sent</p>
          <Spacer className="h-2" />
          <div className="flex flex-col gap-3">
            {emailSent.map((item) => (
              <Card.Root key={item._id}>
                <Card.Content className="flex items-center justify-between">
                  <div>
                    <p>{item.subject_preview}</p>
                    <p className="text-sm text-tertiary">Sent: {getRecipients(item)}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-tertiary">{format(item.sent_at, 'MMM dd, h:mm a')}</p>
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
          <Spacer className="h-6" />
        </div>
      )}
      {!data?.listEventEmailSettings.length && (
        <div className="border-2 border-dashed rounded-md *:text-tertiary!">
          <ListItem icon="icon-email" title="Send Blasts" subtitle="Share updates with your guests via email." />
        </div>
      )}

      <Divider orientation="horizontal" className="my-8" />

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">System Messages</h3>

        <Card.Root>
          <Card.Content className="p-0 divide-(--color-divider) divide-y">
            <ListItem
              icon="icon-alarm"
              title="Event Reminders"
              subtitle="Reminders are sent automatically via email 1 day and 2h before the event."
              actions={[{ text: 'Manage', onClick: () => modal.open(EventReminderModal, { props: { event } }) }]}
            />

            <ListItem
              icon="icon-star-outline"
              title="Post-Event Feedback"
              subtitle="Schedule a feedback email to go out after the event."
              actions={[
                {
                  text: 'Schedule',
                  onClick: () => modal.open(ScheduleFeedbackModal, { props: { event }, dismissible: false }),
                },
              ]}
            />
          </Card.Content>
        </Card.Root>
      </section>
    </>
  );
}

function BlastsInput({ event }: { event: Event }) {
  const me = useMe();

  const defaultSubject = `New message in ${event.title}`;
  const [isFocus, setIsFocus] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const toggleFocus = () => setIsFocus((prev) => !prev);

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
    },
  });

  const handleSendEmail = () => {
    const ticket_types = event.event_ticket_types?.map((item) => item._id);

    createEmail({
      variables: {
        input: {
          event: event._id,
          custom_body_html: message,
          custom_subject_html: defaultSubject,
          type: EmailTemplateType.Custom,
          recipient_types: [EmailRecipientType.Registration],
          recipient_filters: {
            ticket_types,
          },
        },
      },
    });
  };

  return (
    <div className="transition-all flex border border-(--color-card-border) hover:border-card-hover focus-within:border-card-hover bg-(--color-card) rounded-sm px-4 py-3 gap-3">
      <img src={userAvatar(me)} className="size-7 aspect-square rounded-full" />
      <div className="mt-0.5 flex-1 flex flex-col gap-4">
        <div className="max-h-[150px] overflow-auto">
          <TextEditor
            onFocus={toggleFocus}
            onBlur={toggleFocus}
            content={message}
            onChange={(content) => setMessage(content)}
            containerClass="border-none pt-0 min-h-0"
            placeholder="Send a blast to your guests..."
          />
        </div>
        <AnimatePresence>
          {(isFocus || message) && (
            <motion.div
              className="flex justify-between"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.05 }}
            >
              <Button
                size="sm"
                iconLeft="icon-chevrons-up-down rotate-45"
                variant="flat"
                className="text-tertiary! hover:text-primary! px-0"
                onClick={() => modal.open(BlastAdvancedModal, { dismissible: false, props: { event, message } })}
              >
                Advanced
              </Button>

              <Button
                variant="secondary"
                size="sm"
                disabled={!message}
                loading={sendingEmail}
                onClick={handleSendEmail}
              >
                Send
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ListItem({
  icon,
  title,
  subtitle,
  actions = [],
}: {
  icon: string;
  title: string;
  subtitle: string;
  actions?: { text: string; onClick?: React.MouseEventHandler<HTMLButtonElement> }[];
}) {
  return (
    <div className="flex gap-3 px-4 py-3 items-center">
      <div className="w-7 h-7 rounded-sm bg-(--btn-tertiary) flex items-center justify-center">
        <i className={twMerge('text-tertiary size-4', icon)} />
      </div>

      <div className="flex items-center flex-1">
        <div className="flex-1">
          <p>{title}</p>
          <p className="text-tertiary text-sm">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {actions.map((item, idx) => (
            <Button size="sm" variant="tertiary-alt" onClick={item.onClick} key={idx}>
              {item.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function BlastAdvancedModal({ event, message }: { event: Event; message: string }) {
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
          type: EmailTemplateType.Custom,
          test_recipients: [me?.email!],
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

        <DropdownTags
          label="Recipients"
          options={recipients}
          onSelect={(values) => setSelectedReceipts(values as Record<string, string>[])}
        />

        <InputField label="Subject (Optional)" placeholder={defaultSubject} value={subject} onChangeText={setSubject} />

        <TextEditor
          label="Message"
          content={body}
          onChange={(content) => setBody(content)}
          containerClass="bg-background/64"
          placeholder="Share a message with your guests..."
        />

        {showSchedule && (
          <div className="flex justify-between items-center">
            <DateTimePicker
              minDate={new Date()}
              onSelect={(datetime) => setScheduleAt(datetime)}
              placement="top-start"
            />
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

function EventReminderModal({ event }: { event: Event }) {
  const [autoSend, setAutoSend] = React.useState(true);
  return (
    <Card.Root className="w-[480px] *:bg-overlay-primary border-none">
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
            checked={autoSend}
            onChange={(value) => {
              // FIXME: should call BE to update event reminders
              setAutoSend(value);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-tertiary">The following reminders are set up for this event:</p>
          <Card.Root>
            <Card.Content className="p-0">
              <div className="px-4 py-3">
                <p>{event.title} is starting tomorrow</p>
                <div className="flex gap-1.5 items-center">
                  <span>To: Going</span>
                  <div className="size-0.5 rounded-full bg-(--color-primary)" />
                  <span>Not Sent</span>
                </div>
              </div>
              <Divider />
              <div className="px-4 py-3">
                <p>{event.title} is starting tomorrow</p>
                <div className="flex gap-1.5 items-center">
                  <span>To: Going</span>
                  <div className="size-0.5 rounded-full bg-(--color-primary)" />
                  <span>Not Sent</span>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function ScheduleFeedbackModal({ event }: { event: Event }) {
  const me = useMe();

  const defaultSubject = `New message in ${event.title}`;
  const [subject, setSubject] = React.useState<string>();
  const [body, setBody] = React.useState<string>();
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
          test_recipients: [me?.email!],
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

  return (
    <Card.Root className="w-[480px] *:bg-overlay-primary border-none">
      <ModalHeader icon="icon-star-outline" />
      <Card.Content className="flex flex-col gap-4">
        <p className="text-lg">Event Reminders</p>
        <div>
          <p className="text-secondary text-sm">When should the feedback email be sent?</p>
          <Spacer className="h-1.5" />
          <DateTimePicker
            minDate={new Date()}
            onSelect={(datetime) => setScheduleAt(datetime)}
            placement="bottom-start"
          />
          <Spacer className="h-2" />
          <p className="text-secondary text-sm">Immediately after the event ends</p>
        </div>

        <InputField label="Subject" value={subject} onChangeText={(value) => setSubject(value)} />
        <TextEditor
          label="Message"
          content={subject}
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
