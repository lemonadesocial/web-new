
import { useAtomValue } from "jotai";
import { format } from "date-fns";
import { useMemo } from "react";

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

  const ticketGroups = useMemo(() => {
    if (!guestInfo?.purchased_tickets) return {};

    return guestInfo.purchased_tickets.reduce((acc, ticket) => {
      const typeId = ticket.type_expanded?._id;
      const typeTitle = ticket.type_expanded?.title || 'Unknown';

      if (!acc[typeId]) {
        acc[typeId] = {
          title: typeTitle,
          count: 0
        };
      }
      acc[typeId].count += 1;
      return acc;
    }, {} as Record<string, { title: string; count: number }>);
  }, [guestInfo?.purchased_tickets]);

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
          <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
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
          <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
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
                        purchasedTickets: guestInfo.purchased_tickets || [],
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
                {Object.values(ticketGroups).map((group, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <p className="text-tertiary whitespace-pre">{group.count} x</p>
                    <p>{group.title}</p>
                  </div>
                ))}
              </div>
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
