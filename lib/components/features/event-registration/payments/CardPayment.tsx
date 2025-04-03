import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { StripeAccount } from "$lib/generated/backend/graphql";
import { SkeletonBox } from "$lib/components/core";

import { pricingInfoAtom, useAtomValue } from "../store";
import { CardInput } from "./CardInput";

export function CardPayment() {
  return <>
    Coming Soon
  </>;
}

export function CardFormProvider() {
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    (async () => {
      const accountInfo = pricingInfo?.payment_accounts?.find(account => account.provider === 'stripe')?.account_info;

      if (!accountInfo) return;

      const key = (accountInfo as StripeAccount).publishable_key;
      const stripe = await loadStripe(key);
      setStripe(stripe);
    })();
  }, [pricingInfo]);

  if (!stripe) return <SkeletonBox />;

  return (
    <Elements stripe={stripe}>
      <CardInput />
    </Elements>
  );
}
