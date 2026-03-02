import { Button } from '$lib/components/core';
import { RegistrationModal } from './modals/RegistrationModal';
import {
  approvalRequiredAtom,
  eventDataAtom,
  pricingInfoAtom,
  purchaseItemsAtom,
  requiredProfileFieldsAtom,
  registrationModal,
  useAtomValue,
  hasSingleFreeTicketAtom,
  ticketTypesAtom,
} from './store';
import { useSession } from '$lib/hooks/useSession';
import { useRedeemTickets } from './hooks/useRedeemTickets';
import { UpgradeTicketTypeModal } from './modals/UpgradeTicketTypeModal';
import { useSignIn } from '$lib/hooks/useSignIn';

export function RegisterButton() {
  const session = useSession();
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const event = useAtomValue(eventDataAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);
  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);

  const profileFieldsRequired = requiredProfileFields?.length;
  const applicationQuestionsRequired = event.application_questions?.length;
  const connectWalletRequired = event.rsvp_wallet_platforms?.length;
  const hasTerms = event.terms_text;
  const selfRequired = event.self_verification?.enabled && event.self_verification?.config;

  const signIn = useSignIn();
  const { redeemTickets, loadingRedeem } = useRedeemTickets();

  const disabled = purchaseItems.length ? !pricingInfo : true;
  const isFree = pricingInfo?.total === '0';

  const openRegistrationModal = () => {
    const purchaseItemIds = purchaseItems.map((i) => i.id);
    const hasRecommended = ticketTypes
      .filter((item) => purchaseItemIds.includes(item._id))
      .some((i) => !!i.recommended_upgrade_ticket_types?.length);

    if (hasRecommended) {
      registrationModal.open(UpgradeTicketTypeModal, {
        dismissible: false,
        props: {
          onClose: () => {
            registrationModal.close();
            setTimeout(() => {
              registrationModal.open(RegistrationModal, { dismissible: false, skipBaseClassName: true });
            }, 200);
          },
        },
      });
    } else {
      registrationModal.open(RegistrationModal, { dismissible: false, skipBaseClassName: true });
    }
  };

  const getTicketText = (purchaseItems.length && purchaseItems.length > 1) ? 'Get Tickets' : 'Get Ticket';

  if (selfRequired && !session) return (
    <Button variant="secondary" disabled={disabled} onClick={() => signIn()}>
      Sign In To Register
    </Button>
  );

  if (profileFieldsRequired || applicationQuestionsRequired || connectWalletRequired || hasTerms || !session || selfRequired) return (
    <Button variant="secondary" disabled={disabled} onClick={openRegistrationModal}>
      {approvalRequired ? 'Request to Join' : hasSingleFreeTicket ? 'Register' : getTicketText}
    </Button>
  );

  return (
    <Button
      variant="secondary"
      disabled={disabled}
      onClick={() => (isFree ? redeemTickets() : openRegistrationModal())}
      loading={loadingRedeem}
    >
      {approvalRequired
        ? hasSingleFreeTicket
          ? 'One-click Apply'
          : 'Request to Join'
        : hasSingleFreeTicket
          ? 'One-click Register'
          : getTicketText}
    </Button>
  );
}
