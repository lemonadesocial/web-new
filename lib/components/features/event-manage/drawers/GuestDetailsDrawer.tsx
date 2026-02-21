
import { useAtomValue } from "jotai";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { partition, groupBy, sortBy } from "lodash";

import { Avatar, Button, drawer, modal, Skeleton } from "$lib/components/core";
import { EventGuestPayment, GetEventGuestDetailedInfoDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { randomUserImage } from "$lib/utils/user";
import { formatWallet } from "$lib/utils/crypto";
import { chainsMapAtom } from "$lib/jotai";

import { CardIcon } from "../../event-registration/payments/CardIcon";
import { useEventRequest } from "../hooks";
import { ModifyTicketsModal } from "../modals/ModifyTicketsModal";

export function GuestDetailsDrawer({ email, event }: { email: string; event: string }) {
  const { data, loading, refetch } = useQuery(GetEventGuestDetailedInfoDocument, {
    variables: { event, email },
  });

  const guestInfo = data?.getEventGuestDetailedInfo;
  const { approve, decline, loading: requestLoading } = useEventRequest(event, () => {
    refetch();
  });

  const [activeTickets, cancelledTickets] = useMemo(() => {
    if (!guestInfo?.purchased_tickets) return [[], []];

    return partition(guestInfo.purchased_tickets, ticket => !ticket.cancelled_by);
  }, [guestInfo?.purchased_tickets]);

  const activeTicketGroups = useMemo(() => {
    if (!activeTickets.length) return {};

    const grouped = groupBy(activeTickets, ticket => ticket.type_expanded?._id);

    return Object.entries(grouped).reduce((acc, [typeId, tickets]) => {
      acc[typeId] = {
        title: tickets[0]?.type_expanded?.title || 'Unknown',
        count: tickets.length
      };

      return acc;
    }, {} as Record<string, { title: string; count: number }>);
  }, [activeTickets]);

  const cancelledTicketGroups = useMemo(() => {
    if (!cancelledTickets.length) return {};

    const grouped = groupBy(cancelledTickets, ticket => ticket.type_expanded?._id);

    return Object.entries(grouped).reduce((acc, [typeId, tickets]) => {
      acc[typeId] = {
        title: tickets[0]?.type_expanded?.title || 'Unknown',
        count: tickets.length
      };

      return acc;
    }, {} as Record<string, { title: string; count: number }>);
  }, [cancelledTickets]);

  const formatTicketDescription = (tickets: Array<{ type_expanded?: { _id?: string; title: string } | null }>) => {
    const grouped = groupBy(tickets, ticket => (ticket.type_expanded as any)?._id);
    const descriptions = Object.values(grouped).map(group => {
      const count = group.length;
      const title = group[0]?.type_expanded?.title || 'Unknown';
      return count > 1 ? `${count}× ${title}` : title;
    });
    return descriptions.join(', ');
  };

  const timelineItems = useMemo(() => {
    if (!guestInfo) return [];

    console.log(guestInfo.join_request)

    const items: Array<{
      type: 'cancelled' | 'replaced' | 'approved' | 'requested' | 'invited';
      title: string;
      description?: React.ReactNode;
      date: string;
      dateValue: string;
      actor?: string;
      icon: string;
      iconBg: string;
    }> = [];

    cancelledTickets.forEach((ticket) => {
      const ticketDate = new Date(ticket.cancelled_at);

      items.push({
        type: 'cancelled',
        title: 'Tickets Canceled',
        description: formatTicketDescription([ticket]),
        date: format(ticketDate, 'MMM d, yyyy, h:mm a'),
        dateValue: ticket.cancelled_at,
        actor: ticket.cancelled_by_expanded?.display_name || ticket.cancelled_by_expanded?.name,
        icon: 'icon-remove-ticket text-error',
        iconBg: 'bg-error/16',
      });
    });

    if (guestInfo.ticket?.upgrade_history) {
      guestInfo.ticket.upgrade_history.forEach((upgrade) => {
        items.push({
          type: 'replaced',
          title: 'Ticket Replaced',
          description: <div className="flex items-center gap-0.5">
            <p className="text-tertiary text-sm">{upgrade.from_type_expanded?.title || 'Unknown'}</p>
            <i className="icon-chevron-right size-4 text-quaternary" />
            <p className="text-tertiary text-sm">{upgrade.to_type_expanded?.title || 'Unknown'}</p>
          </div>,
          date: format(new Date(upgrade.updated_at), 'MMM d, yyyy, h:mm a'),
          dateValue: upgrade.updated_at,
          actor: upgrade.updated_by_expanded?.display_name || upgrade.updated_by_expanded?.name,
          icon: 'icon-ticket-assign',
          iconBg: 'bg-primary/8',
        });
      });
    }

    if (guestInfo.join_request) {
      if (guestInfo.join_request.state === 'approved' && guestInfo.join_request.decided_at) {
        items.push({
          type: 'approved',
          title: 'Approved',
          date: format(new Date(guestInfo.join_request.decided_at), 'MMM d, yyyy, h:mm a'),
          dateValue: guestInfo.join_request.decided_at,
          actor: guestInfo.join_request.decided_by_expanded?.display_name || guestInfo.join_request.decided_by_expanded?.name,
          icon: 'icon-ticket text-success-500',
          iconBg: 'bg-success-500/16',
        });
      }

      if (guestInfo.join_request.created_at) {
        items.push({
          type: 'requested',
          title: 'Requested to Join',
          date: format(new Date(guestInfo.join_request.created_at), 'MMM d, yyyy, h:mm a'),
          dateValue: guestInfo.join_request.created_at,
          icon: 'icon-clock text-warning-300',
          iconBg: 'bg-warning-300/16',
        });
      }
    }

    if (guestInfo.invitation?.created_at) {
      const inviters = guestInfo.invitation.inviters_expanded || [];
      const inviterNames = inviters.map(inviter => inviter.display_name || inviter.name).filter(Boolean);
      const actor = inviterNames.length > 0 ? inviterNames.join(', ') : undefined;

      items.push({
        type: 'invited',
        title: 'Invited',
        description: '',
        date: format(new Date(guestInfo.invitation.created_at), 'MMM d, yyyy, h:mm a'),
        dateValue: guestInfo.invitation.created_at,
        actor,
        icon: 'icon-user-plus text-alert-400',
        iconBg: 'bg-alert-400/16',
      });
    }

    return sortBy(items, item => new Date(item.dateValue).getTime()).reverse();
  }, [guestInfo, cancelledTickets]);

  const handleApprove = () => {
    if (guestInfo?.join_request?._id) {
      approve([guestInfo.join_request._id]);
    }
  };

  const handleDecline = () => {
    if (guestInfo?.join_request?._id) {
      decline([guestInfo.join_request._id]);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
          <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} aria-label="Close drawer" />
          <p>Guest Details</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          <div className="flex gap-3 items-center">
            <Skeleton animate className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton animate className="h-5 w-40 rounded-full" />
              <Skeleton animate className="h-4 w-48 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton animate className="h-20 w-full rounded-lg" />
            <Skeleton animate className="h-16 w-full rounded-lg" />
            <Skeleton animate className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!guestInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
          <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} aria-label="Close drawer" />
          <p>Guest Details</p>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          <p className="text-secondary">Guest information not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
        <p>Guest Details</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <Avatar src={guestInfo.user.image_avatar || randomUserImage(guestInfo.user.email?.toString())} className="size-8" />
            <div>
              <p>{guestInfo.user.display_name || guestInfo.user.name}</p>
              <p className="text-sm text-secondary">{guestInfo.user.email}</p>
            </div>
          </div>
          {
            guestInfo.user.description && (
              <p className="text-secondary text-sm">{guestInfo.user.description}</p>
            )
          }
          {
            guestInfo.ticket && (
              <div className="flex gap-3">
                <div>
                  <p className="text-tertiary text-sm">Registration Time</p>
                  <p>{format(new Date(guestInfo.ticket.created_at), 'MMM d \'at\' h:mm a')}</p>
                </div>
                <div className="w-1 h-[44px] border-l border-l-divider" />
                <div>
                  <p className="text-tertiary text-sm">Ticket</p>
                  <p>{guestInfo.ticket?.type_expanded?.title}</p>
                </div>
              </div>
            )
          }
        </div>

        {
          !!guestInfo.payments?.length && <>
            <hr className="border-t border-t-divider" />
            <div className="space-y-4">
              <p className="text-lg">{guestInfo.payments.length} {guestInfo.payments.length === 1 ? 'Payment' : 'Payments'}</p>
              <div className="rounded-md border border-card-border bg-card divide-y divide-divider">
                {guestInfo.payments.map((payment) => (
                  <PaymentItem key={payment._id} payment={payment as unknown as EventGuestPayment} />
                ))}
              </div>
            </div>
          </>
        }

        {
          !!guestInfo.purchased_tickets?.length && <>
            <hr className="border-t border-t-divider" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg">
                  {guestInfo.purchased_tickets.length} {guestInfo.purchased_tickets.length === 1 ? 'Ticket' : 'Tickets'}
                </p>
                <Button
                  size="sm"
                  variant="tertiary"
                  iconLeft="icon-edit-sharp"
                  onClick={() => {
                    modal.open(ModifyTicketsModal, {
                      props: {
                        purchasedTickets: activeTickets,
                        event,
                        onComplete: () => {
                          refetch();
                        },
                      },
                    });
                  }}
                >
                  Edit
                </Button>
              </div>
              <div>
                {Object.values(activeTicketGroups).map((group, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <p className="text-tertiary whitespace-pre">{group.count} x</p>
                    <p>{group.title}</p>
                  </div>
                ))}
              </div>
              {
                !!cancelledTickets.length && (
                  <div className="space-y-2">
                    <p className="text-tertiary text-sm">
                      {cancelledTickets.length} {cancelledTickets.length === 1 ? 'Cancelled Ticket' : 'Cancelled Tickets'}
                    </p>
                    <div>
                      {Object.values(cancelledTicketGroups).map((group, index) => (
                        <div key={index} className="flex items-start gap-1.5">
                          <p className="text-tertiary whitespace-pre">{group.count} x</p>
                          <p className="text-tertiary line-through">{group.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
            </div>
          </>
        }

        {
          !!guestInfo.application?.length && <>
            <hr className="border-t border-t-divider" />
            <div className="space-y-4">
              <p className="text-lg">Registration Form</p>
              <div className="space-y-3">
                {
                  guestInfo.application.map((answer) => (
                    <div key={answer.question}>
                      <p className="text-tertiary text-sm">{answer.question}</p>
                      <p>{answer.answers ? answer.answers.join(', ') : answer.answer}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        }

        {
          timelineItems.length > 0 && (
            <>
              <hr className="border-t border-t-divider" />
              <div className="space-y-4">
                <p className="text-lg">Timeline</p>
                <div className="relative">
                  {timelineItems.map((item, index, array) => (
                    <TimelineItem
                      key={`${item.type}-${item.dateValue}-${index}`}
                      icon={item.icon}
                      iconBg={item.iconBg}
                      title={item.title}
                      description={item.description}
                      date={item.actor ? `${item.date} · ${item.actor}` : item.date}
                      isLast={index === array.length - 1}
                    />
                  ))}
                </div>
              </div>
            </>
          )
        }
      </div>
      {
        guestInfo.join_request?.state === 'pending' && (
          <div className="px-4 py-3 border-t border-t-divider flex-shrink-0 flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDecline}
              disabled={requestLoading}
            >
              Decline
            </Button>
            <Button
              variant="success"
              className="flex-1"
              onClick={handleApprove}
              disabled={requestLoading}
            >
              Approve
            </Button>
          </div>
        )
      }
    </div>
  );
}

function TimelineItem({
  icon,
  iconBg,
  title,
  description,
  date,
  isLast,
}: {
  icon: string;
  iconBg: string;
  title: string;
  description: React.ReactNode;
  date: string;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      <div className="relative flex-shrink-0 w-7 pb-4">
        <div className={`size-7 rounded-full flex items-center justify-center ${iconBg} relative z-10`}>
          <i className={`${icon} size-3.5`} />
        </div>
        {!isLast && (
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-[1px] bottom-0 bg-primary/8" />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-3">
        <p>{title}</p>
        {typeof description === 'string' ? (
          <p className="text-tertiary text-sm">{description}</p>
        ) : description}
        <p className="text-tertiary text-sm">{date}</p>
      </div>
    </div>
  );
}

function PaymentItem({ payment }: { payment: EventGuestPayment }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[payment.crypto_payment_info?.network as string];

  return (
    <div className="flex items-start justify-between gap-3 px-3.5 py-2.5">
      <div className="space-y-[2px]">
        <p>{payment.formatted_total_amount} {payment.currency}</p>
        {
          (payment.crypto_payment_info?.tx_hash || payment.stripe_payment_info) && (
            <div className="flex gap-1.5 items-center">
              {
                payment.crypto_payment_info
                  ? <i className="icon-wallet size-4 text-tertiary" />
                  : <CardIcon cardBrand={payment.stripe_payment_info?.card?.brand as string} />
              }
              {
                payment.transfer_params?.from && <p className="text-tertiary text-sm">{formatWallet(payment.transfer_params?.from)}</p>
              }
              {
                payment.stripe_payment_info?.card?.last4 && <p className="text-tertiary text-sm">•••• {payment.stripe_payment_info?.card?.last4}</p>
              }
            </div>
          )
        }
      </div>

      {
        (payment.crypto_payment_info?.tx_hash || payment.stripe_payment_info) && <>
          {
            payment.crypto_payment_info ? (
              <div
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => {
                  window.open(`${chain.block_explorer_url}/tx/${payment.crypto_payment_info?.tx_hash}`, '_blank');
                }}
              >
                {
                  chain.logo_url && <img src={chain.logo_url} alt={chain.name} className="size-4" />
                }
                <p className="text-tertiary text-sm">
                  {
                    payment.crypto_payment_info.tx_hash?.replace(/^(.{7})(.*)(.{4})$/, '$1...$3')
                  }
                </p>
                <i className="icon-arrow-outward size-4 text-tertiary" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <i className="icon-stripe size-4 text-tertiary" />
                <p className="text-tertiary text-sm">
                  {
                    payment.stripe_payment_info?.payment_intent?.replace(/^(.{7})(.*)(.{4})$/, '$1...$3')
                  }
                </p>
              </div>
            )
          }
        </>
      }
    </div>
  );
}
