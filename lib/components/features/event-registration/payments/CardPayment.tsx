import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { GetStripeCardsDocument, StripeAccount, StripeCard } from "$lib/generated/backend/graphql";
import { Button, Menu, MenuItem, Skeleton, SkeletonBox } from "$lib/components/core";
import { CardForm } from "./CardForm";
import { useQuery } from "$lib/request";
import { useSession } from "$lib/hooks/useSession";

import { pricingInfoAtom, stripePaymentMethodAtom, useAtomValue, useSetAtom } from "../store";
import { useCardPayment } from "../hooks/useCardPayment";
import { SubmitForm } from "../SubmitForm";
import { CardIcon } from "./CardIcon";

export function CardPayment() {
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const session = useSession();
  const setStripePaymentMethod = useSetAtom(stripePaymentMethodAtom);

  const [showCardForm, setShowCardForm] = useState(!session?.user);
  const [card, setCard] = useState<StripeCard | null>(null);

  const { pay, loading: loadingPay } = useCardPayment();

  const { data: stripeCardsData, loading: loadingCards } = useQuery(GetStripeCardsDocument, {
    skip: !pricingInfo?.payment_accounts?.[0]?._id || !session?.user,
    onComplete(data) {
      const card = data.getStripeCards[0];
      if (!card) {
        setShowCardForm(true);
        return;
      }

      setShowCardForm(false);
      setCard(data.getStripeCards[0] as StripeCard);
      setStripePaymentMethod(data.getStripeCards[0].provider_id);
    },
  });

  if (loadingCards) return <Skeleton height="40px" />;

  return (
    <div className="space-y-1.5">
      <p className="text-secondary text-sm">Credit or Debit Card *</p>
      <div className="flex flex-col gap-4">
        {
          card && (
            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <div
                    className="w-full rounded-sm px-2.5 h-10 flex justify-between items-center gap-1.5 bg-primary/8"
                    onClick={() => toggle()}
                  >
                    <div className="flex items-center gap-2.5">
                      {
                        showCardForm ? <p className="text-tertiary">New Credit or Debit Card</p> : <>
                          <CardIcon cardBrand={card.brand} />
                          <p>{capitalize(card.brand)} •••• {card.last4}</p>
                        </>
                      }

                    </div>
                    <i className="icon-arrow-down size-5 text-quaternary" />
                  </div>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 min-w-[372px]">
                {({ toggle }) => (
                  <>
                    <div className="p-1">
                      <p className="text-tertiary text-sm py-1 px-2">Saved Cards</p>
                      {stripeCardsData?.getStripeCards.map(card => (
                        <MenuItem
                          key={card._id}
                          onClick={() => {
                            setCard(card);
                            setStripePaymentMethod(card.provider_id);
                            setShowCardForm(false);
                            toggle();
                          }}
                          iconLeft={<CardIcon cardBrand={card.brand} />}
                          title={`${capitalize(card.brand)} •••• ${card.last4}`}
                        />
                      ))}
                    </div>
                    <hr className="border-card-border" />
                    <div className="p-1">
                      <MenuItem
                        onClick={() => {
                          setShowCardForm(true);
                          toggle();
                        }}
                        iconLeft={<i className="icon-card min-w-6" />}
                        title="New Credit or Debit Card"
                      />
                    </div>
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          )
        }
        {
          showCardForm ? (
            <CardFormProvider />
          ) : (
            <SubmitForm onComplete={pay}>
              {(handleSubmit) => (
                <Button onClick={handleSubmit} loading={loadingPay}>Pay with Card</Button>
              )}
            </SubmitForm>
          )
        }
      </div>
    </div>
  );
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
      <CardForm />
    </Elements>
  );
}
