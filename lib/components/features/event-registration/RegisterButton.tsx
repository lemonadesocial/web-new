import { Button } from "$lib/components/core";
import { approvalRequiredAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, requiredProfileFieldsAtom, useAtomValue } from "./store";

export function RegisterButton() {
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const event = useAtomValue(eventDataAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);
  const approvalRequired = useAtomValue(approvalRequiredAtom);

  const profileFieldsRequired = requiredProfileFields?.length;
  const applicationQuestionsRequired = event.application_questions?.length;
  const connectWalletRequired = event.rsvp_wallet_platforms?.length;
  const hasTerms = event.terms_text;

  const disabled = purchaseItems.length ? !pricingInfo : true;
  const isFree = pricingInfo?.total === '0';

  if (profileFieldsRequired || applicationQuestionsRequired || connectWalletRequired || hasTerms) return (
    <Button variant="secondary" disabled={disabled}>
      {approvalRequired ? 'Request to Join' : isFree ? 'Register' : 'Get Tickets'}
    </Button>
  );

  return (
    <Button variant="secondary" disabled={disabled}>
      {approvalRequired ? (isFree ? 'One-click Apply' : 'Request to Join') : (isFree ? 'One-click Register' : 'Get Tickets')}
    </Button>
  );
}
