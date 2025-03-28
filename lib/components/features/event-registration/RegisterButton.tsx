import { Button } from "$lib/components/core";
import { pricingInfoAtom, purchaseItemsAtom, useAtomValue } from "./store";

export function RegisterButton() {
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);

  const disabled = purchaseItems.length ? !pricingInfo : true;

  return <Button variant="secondary" disabled={disabled}>Register</Button>;
}
