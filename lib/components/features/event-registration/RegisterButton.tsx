
import { Button } from "$lib/components/core";
// import { toast } from "$lib/components/core/toast";
import { RegistrationModal } from "./RegistrationModal";
import { approvalRequiredAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, requiredProfileFieldsAtom, registrationModal, useAtomValue } from "./store";
import { useSession } from "$lib/hooks/useSession";
import { useRedeemTickets } from "./hooks";

export function RegisterButton() {
  const session = useSession();

  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const event = useAtomValue(eventDataAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);
  const approvalRequired = useAtomValue(approvalRequiredAtom);

  const profileFieldsRequired = requiredProfileFields?.length;
  const applicationQuestionsRequired = event.application_questions?.length;
  const connectWalletRequired = event.rsvp_wallet_platforms?.length;
  const hasTerms = event.terms_text;

  const { redeemTickets, loadingRedeem } = useRedeemTickets();

  const disabled = purchaseItems.length ? !pricingInfo : true;
  const isFree = pricingInfo?.total === '0';

  const openRegistrationModal = () => {
    // toast.success('Coming soon!');
    // return;
    registrationModal.open(RegistrationModal, { skipBaseClassName: true });
  };

  if (event.approval_required && !session) return (
    <Button variant="secondary" disabled={disabled} onClick={openRegistrationModal}>
      Sign In
    </Button>
  );

  if (profileFieldsRequired || applicationQuestionsRequired || connectWalletRequired || hasTerms || !session) return (
    <Button variant="secondary" disabled={disabled} onClick={openRegistrationModal}>
      {approvalRequired ? 'Request to Join' : isFree ? 'Register' : 'Get Tickets'}
    </Button>
  );

  return (
    <Button
      variant="secondary"
      disabled={disabled}
      onClick={() => approvalRequired ? openRegistrationModal() : redeemTickets()}
      loading={loadingRedeem}
    >
      {approvalRequired ? (isFree ? 'One-click Apply' : 'Request to Join') : (isFree ? 'One-click Register' : 'Get Tickets')}
    </Button>
  );
}
