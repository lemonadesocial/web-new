import { useState } from "react";

import { PoapDrop } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { ListMyPoapClaimsDocument, GetMyTicketsDocument, GetEventCheckInStateDocument } from "$lib/graphql/generated/backend/graphql";
import { generateUrl } from "$lib/utils/cnd";
import { Button, Skeleton, toast, modal } from "$lib/components/core";
import { ClaimPoapDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { useMe } from "$lib/hooks/useMe";
import { appKit } from "$lib/utils/appkit";
import { ConnectWallet } from "$lib/components/features/modals/ConnectWallet";

interface CollectibleCardProps {
  poapDrop: PoapDrop;
  eventId: string;
}

export function CollectibleCard({ poapDrop, eventId }: CollectibleCardProps) {
  const me = useMe();
  const [localClaimCount, setLocalClaimCount] = useState(poapDrop.claim_count || 0);
  const [localHasClaimed, setLocalHasClaimed] = useState(false);

  const { data: claimsData, loading: loadingClaims } = useQuery(ListMyPoapClaimsDocument, {
    variables: { event: eventId }
  });

  const [claimPoap, { loading: claimLoading }] = useMutation(
    ClaimPoapDocument,
    {
      onError(error) {
        toast.error(error.message)
      },
      onComplete() {
        setLocalClaimCount(prev => prev + 1);
        setLocalHasClaimed(true);
      }
    },
  );

  const hasClaimed = localHasClaimed || claimsData?.listMyPoapClaims?.some(
    claim => claim.drop._id === poapDrop._id && claim.claimed_date
  ) || false;

  const outOfStock = localClaimCount === poapDrop.amount;

  const { data: ticketsData } = useQuery(GetMyTicketsDocument, {
    variables: { event: eventId, withPaymentInfo: true },
    skip: poapDrop.claim_mode !== 'registration' || hasClaimed || outOfStock || loadingClaims
  });

  const { data: checkInData } = useQuery(GetEventCheckInStateDocument, {
    variables: { id: eventId },
    skip: poapDrop.claim_mode !== 'check_in' || hasClaimed || outOfStock || loadingClaims
  });

  const isEligibleForRegistration = () => {
    if (!poapDrop.ticket_types || poapDrop.ticket_types.length === 0) return true;

    const userTicketTypes = ticketsData?.getMyTickets?.tickets?.map(ticket => ticket.type) || [];
    return poapDrop.ticket_types.some(ticketTypeId => userTicketTypes.includes(ticketTypeId));
  };

  const isEligibleForCheckIn = checkInData?.getEvent?.checkedin || false;

  const handleClaim = () => {
    if (me?.wallets_new?.ethereum?.[0]) {
      claimPoap({
        variables: {
          wallet: me.wallets_new.ethereum[0],
          drop: poapDrop._id
        },
      });
      return;
    }

    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.close();
          const address = appKit.getAddress();
          if (address) {
            claimPoap({
              variables: {
                wallet: address,
                drop: poapDrop._id
              },
            });
          }
        },
      },
    });
  };

  const getButtonState = () => {
    if (hasClaimed) return { text: 'Claimed', variant: 'secondary', disabled: true, action: undefined };

    if (outOfStock) return { text: 'Out of stock', variant: 'tertiary', disabled: true, action: undefined };

    if (poapDrop.claim_mode === 'registration' && !isEligibleForRegistration()) {
      return { text: 'Not Eligible', variant: 'tertiary', disabled: true, action: undefined };
    }

    if (poapDrop.claim_mode === 'check_in' && !isEligibleForCheckIn) {
      return { text: 'Check In to Unlock', variant: 'tertiary', disabled: true };
    }

    return { text: 'Claim', variant: 'secondary', action: handleClaim };
  };

  const progress = poapDrop.amount && poapDrop.amount > 0
    ? localClaimCount / poapDrop.amount
    : 0;

  const buttonState = getButtonState();

  return (
    <div className="bg-card-background border border-card-border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-center aspect-square">
        <img
          src={poapDrop.image_url || generateUrl(poapDrop.image_expanded)}
          alt={poapDrop.name}
          className="border border-card-border rounded-sm max-h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-lg truncate">{poapDrop.name}</p>
        <div className="w-4 h-4" />
      </div>
      <div>
        <CollectibleProgressBar progress={progress} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-tertiary">{localClaimCount} claimed</span>
          <span className="text-sm text-tertiary">{poapDrop.amount}</span>
        </div>
      </div>
      {loadingClaims ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <Button
          variant={buttonState.variant as any}
          size="sm"
          disabled={buttonState.disabled}
          className="w-full"
          onClick={buttonState.action}
          loading={claimLoading}
        >
          {buttonState.text}
        </Button>
      )}
    </div>
  );
}

type ProgressBarProps = {
  progress: number;
};

export function CollectibleProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="relative w-full h-[4px]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='199' height='5' viewBox='0 0 199 5' fill='none'><path d='M3.32812 2.66602H196.328' stroke='white' stroke-opacity='0.08' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='4 8'/></svg>\")",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
      }}
    >
      <div
        className="absolute top-0 left-0 h-[4px] rounded"
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          background: "white",
        }}
      />
    </div>
  );
}
