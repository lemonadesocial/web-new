
import { Button } from "$lib/components/core";
import { RegistrationModal } from "./modals/RegistrationModal";
import { approvalRequiredAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, requiredProfileFieldsAtom, registrationModal, useAtomValue, hasSingleFreeTicketAtom } from "./store";
import { useSession } from "$lib/hooks/useSession";
import { useSignIn } from '$lib/hooks/useSignIn';
import { useRedeemTickets } from "./hooks/useRedeemTickets";

export function RegisterButton() {
  const session = useSession();
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const event = useAtomValue(eventDataAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);
  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);

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
    registrationModal.open(RegistrationModal, { dismissible: false, skipBaseClassName: true });
  };

  if (selfRequired && !session) return (
    <Button variant="secondary" disabled={disabled} onClick={() => signIn()}>
      Sign In To Register
    </Button>
  );

  if (profileFieldsRequired || applicationQuestionsRequired || connectWalletRequired || hasTerms || !session || selfRequired) return (
    <Button variant="secondary" disabled={disabled} onClick={openRegistrationModal}>
      {approvalRequired ? 'Request to Join' : hasSingleFreeTicket ? 'Register' : 'Get Tickets'}
    </Button>
  );

  return (
    <Button
      variant="secondary"
      disabled={disabled}
      onClick={() => isFree ? redeemTickets() : openRegistrationModal()}
      loading={loadingRedeem}
    >
      {approvalRequired ? (hasSingleFreeTicket ? 'One-click Apply' : 'Request to Join') : (hasSingleFreeTicket ? 'One-click Register' : 'Get Tickets')}
    </Button>
  );
}
