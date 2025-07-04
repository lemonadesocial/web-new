import { intersection, partition } from "lodash";
import { useMe } from "$lib/hooks/useMe";
import { communityAvatar } from "$lib/utils/community";
import { useSession } from "$lib/hooks/useSession";

import { Avatar, Button, Segment } from "$lib/components/core";
import {
  currenciesAtom,
  currencyAtom,
  eventDataAtom,
  hasSingleFreeTicketAtom,
  purchaseItemsAtom,
  registrationModal,
  requiredProfileFieldsAtom,
  selectedPaymentAccountAtom,
  ticketTypesAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
  pricingInfoAtom
} from "../store";
import { useRedeemTickets } from "../hooks/useRedeemTickets";
import { BuyerInfoForm } from "../forms/BuyerInfoForm";
import { ApplicationForm } from "../forms/ApplicationForm";
import { UserForm } from "../forms/UserInfoForm";
import { CardPayment } from "../payments/CardPayment";
import { SubmitForm } from "../SubmitForm";
import { OrderSummary } from "../OrderSummary";
import { CryptoPayment } from "../payments/CryptoPayment";
import { useBuyTickets } from "../hooks/useBuyTickets";
import { BlockchainPlatform } from "$lib/graphql/generated/backend/graphql";
import { SignedOutWalletForm } from "../forms/SignedOutWalletForm";
import { SignedInWalletForm } from "../forms/SignedInWalletForm";
import { TermsForm } from "../forms/TermsForm";

export function RegistrationModal() {
  const me = useMe();
  const session = useSession();

  const pricing = useAtomValue(pricingInfoAtom);
  const requiredProfileFields = useAtomValue(requiredProfileFieldsAtom);
  const event = useAtomValue(eventDataAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useAtom(selectedPaymentAccountAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const setCurrency = useSetAtom(currencyAtom);
  const currencies = useAtomValue(currenciesAtom);

  const { redeemTickets, loadingRedeem } = useRedeemTickets();
  const { pay, loading: loadingBuyTickets } = useBuyTickets();

  const selectedTicketTypes = ticketTypes.filter(ticket => purchaseItems.some(item => item.id === ticket._id));
  const ticketPaymentAccounts = selectedTicketTypes.map(ticket => ticket.prices.flatMap(price => price.payment_accounts_expanded || []));
  const paymentAccountsSet = intersection(...ticketPaymentAccounts);
  const [stripeAccounts, cryptoAccounts] = partition(paymentAccountsSet, account => account.provider === 'stripe');
  const ethereumWalletCondition = event.rsvp_wallet_platforms?.find(platform => platform.platform === BlockchainPlatform.Ethereum);

  const showPaymentSwitch = stripeAccounts.length && cryptoAccounts.length;

  const isFree = pricing?.total === '0';

  return (
    <div className='h-dvh overflow-auto w-screen bg-background/80 [backdrop-filter:var(--backdrop-filter)] flex flex-col-reverse justify-end md:justify-center md:flex-row md:pt-24 md:gap-12'>
      <div className="absolute top-4 right-4">
        <Button
          variant="tertiary-alt"
          icon="icon-x"
          className="rounded-full"
          onClick={() => registrationModal.close()}
          size="sm"
        >
          Close
        </Button>
      </div>
      <div className='flex flex-col gap-8 overflow-auto md:overflow-visible md:w-[372] p-4 md:p-0'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            <h3 className='font-semibold text-[24px]'>Your Info</h3>
            {
              me && (
                <div className='flex gap-3'>
                  <Avatar src={communityAvatar(me)} size="xl" />
                  <div>
                    <p className='font-medium'>{me.name}</p>
                    <p className='text-secondary text-[14px]'>{me.email}</p>
                  </div>
                </div>
              )
            }
          </div>
          {
            !session && <BuyerInfoForm />
          }
          {
            ethereumWalletCondition && (
              session ? <SignedInWalletForm required={!!ethereumWalletCondition.required} /> : <SignedOutWalletForm required={!!ethereumWalletCondition.required} />
            )
          }
          {
            !!requiredProfileFields?.length && <UserForm />
          }
          {
            !!event.application_questions?.length && <ApplicationForm />
          }
          {
            !!event.terms_text && <TermsForm />
          }
        </div>
        {
          isFree ? (
            <SubmitForm
              onComplete={() => {
                if (pricing?.discount !== '0') {
                  pay();
                  return;
                }

                redeemTickets();
              }}
            >
              {(handleSubmit) => (
                <Button onClick={handleSubmit} loading={loadingRedeem || loadingBuyTickets}>Register</Button>
              )}
            </SubmitForm>
          ) : (
            <div className='space-y-4'>
              <h3 className='font-semibold text-[24px]'>Payment</h3>
              {
                !!showPaymentSwitch && (
                  <Segment
                    className="w-full"
                    onSelect={(item) => {
                      const account = item.value === 'card' ? stripeAccounts[0] : cryptoAccounts[0];
                      setSelectedPaymentAccount(account);
                      setCurrency(intersection(currencies, account.account_info.currencies)[0]);
                    }}
                    selected={selectedPaymentAccount?.provider === 'stripe' ? 'card' : 'wallet'}
                    items={[
                      { label: 'Card', value: 'card' },
                      { label: 'Wallet', value: 'wallet' },
                    ]}
                  />)
              }
              {
                selectedPaymentAccount?.provider === 'stripe' && <CardPayment />
              }
              {
                selectedPaymentAccount?.type === 'solana' && 'Solana Payment'
              }
              {
                selectedPaymentAccount?.type && ['ethereum', 'ethereum_relay', 'ethereum_stake'].includes(selectedPaymentAccount.type) && <CryptoPayment accounts={cryptoAccounts} />
              }
            </div>
          )
        }
        <div className="min-h-4" />
      </div>
      {
        !hasSingleFreeTicket && <OrderSummary />
      }
    </div>
  );
}
