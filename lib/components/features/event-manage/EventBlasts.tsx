'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

import { Button, Card, Divider, modal, Spacer, TextEditor, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import {
  CreateEventEmailSettingDocument,
  EmailRecipientType,
  EmailSetting,
  EmailTemplateType,
  Event,
  GetListEventEmailSettingsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { getEmailBlastsRecipients } from '$lib/utils/event';

import { useEvent } from './store';
import { BlastAdvancedModal, EventReminderModal, ScheduleFeedbackModal } from './modals/EventBlastsModal';

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

  const emailScheduled = data?.listEventEmailSettings.filter((i) => !i.sent_at && !i.disabled) as EmailSetting[];
  const emailSent = data?.listEventEmailSettings.filter((i) => i.sent_at && !i.disabled) as EmailSetting[];
  const reminderEmails = data?.listEventEmailSettings.filter(
    (i) => i.type === EmailTemplateType.Reminder,
  ) as EmailSetting[];

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
                <Card.Content className="flex items-center gap-3">
                  <img src={userAvatar(item.owner_expanded)} className="size-7 aspect-square rounded-full" />
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p>{item.subject_preview}</p>
                      <p className="text-sm text-tertiary">Sending to: {getEmailBlastsRecipients(item)}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-warning-400">
                      <i className="icon-clock size-4" />
                      <p className="text-sm">{format(item.scheduled_at, 'MMM dd, h:mm a')}</p>
                    </div>
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
                <Card.Content className="flex items-center gap-3">
                  <img src={userAvatar(item.owner_expanded)} className="size-7 aspect-square rounded-full" />

                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p>{item.subject_preview}</p>
                      <p className="text-sm text-tertiary">Sent: {getEmailBlastsRecipients(item)}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-tertiary">{format(item.sent_at, 'MMM dd, h:mm a')}</p>
                    </div>
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
              actions={[
                !!reminderEmails?.length
                  ? {
                      text: 'Manage',
                      onClick: () =>
                        modal.open(EventReminderModal, {
                          props: {
                            event,
                            reminderEmails,
                          },
                        }),
                    }
                  : undefined,
              ]}
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
      setMessage('');
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
  actions?: Array<{ text: string; onClick?: React.MouseEventHandler<HTMLButtonElement> } | undefined>;
}) {
  return (
    <div className="flex gap-3 px-4 py-3 items-center">
      <div className="w-7 h-7 rounded-sm bg-(--btn-tertiary) flex items-center justify-center">
        <i className={twMerge('text-tertiary size-4', icon)} />
      </div>

      <div className="flex items-center flex-1 gap-3">
        <div className="flex-1">
          <p>{title}</p>
          <p className="text-tertiary text-sm">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {actions.map((item, idx) => {
            if (!item) return null;
            return (
              <Button size="sm" variant="tertiary-alt" onClick={item.onClick} key={idx}>
                {item.text}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
