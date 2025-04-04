import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { StripeCardNumberElementChangeEvent, StripeCardNumberElementOptions, StripeElementChangeEvent, StripeElementType } from '@stripe/stripe-js';

import { Button, toast } from '$lib/components/core';
import { useSession } from '$lib/hooks/useSession';

import { registrationModal, stripePaymentMethodAtom, useSetAtom } from '../store';
import { useCardPayment } from '../hooks/useCardPayment';
import { SubmitForm } from '../SubmitForm';
import { CardIcon } from './CardIcon';
import { PaymentProcessingModal } from '../modals/PaymentProcessingModal';

type ElementState = {
  [key: string]: StripeElementChangeEvent | null;
};

const elementOptions: StripeCardNumberElementOptions = {
  style: {
    base: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: '500',
      '::placeholder': { color: 'rgba(255, 255, 255, 0.24)' },
    },
    invalid: {
      color: '#ff637e',
    },
  },
  classes: {
    base: 'w-full',
  },
};

export const CardForm: React.FC = () => {
  const stripe = useStripe()!;
  const elements = useElements()!;

  const setStripePaymentMethod = useSetAtom(stripePaymentMethodAtom);
  const session = useSession();

  const { pay, loading: loadingPay } = useCardPayment();

  const [focusedElement, setFocusedElement] = useState<StripeElementType | null>(null);
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | undefined>(undefined);
  const [elementState, setElementState] = useState<ElementState>({
    cardNumber: null,
    cardExpiry: null,
    cardCvc: null,
  });

  const [loadingCreatePaymentMethod, setLoadingCreatePaymentMethod] = useState(false);

  const handleFocus = (element: StripeElementType) => () => setFocusedElement(element);
  const handleBlur = () => setFocusedElement(null);
  const handleChange = (event: StripeElementChangeEvent) => {
    setElementState(prev => ({
      ...prev,
      [event.elementType]: event
    }));
  };

  const handleCardChange = (event: StripeCardNumberElementChangeEvent) => {
    setIsCardNumberComplete(event.complete);
    if (event.brand) {
      setCardBrand(event.brand);
    }
  };

  const [xPosition, cardNumberWidth] = useMemo(() => {
    const slideAmount = 120;

    if (focusedElement === 'cardNumber') {
      return [0, 236];
    } else if (focusedElement === 'cardExpiry' || focusedElement === 'cardCvc') {
      return [-slideAmount, 312];
    } else {
      return isCardNumberComplete ? [-slideAmount, 312] : [0, 236];
    }
  }, [focusedElement, isCardNumberComplete]);

  return <>
    <div
      className="w-full bg-primary/8 h-10 px-2.5 rounded-sm relative flex gap-2.5 items-center"
    >
      <CardIcon cardBrand={cardBrand} />

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-2.5 items-center"
          animate={{ x: xPosition }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={`h-10 flex items-center flex-shrink-0`} style={{ width: cardNumberWidth }}>
            <CardNumberElement
              onFocus={handleFocus('cardNumber')}
              onBlur={handleBlur}
              onChange={(e) => {
                handleCardChange(e);
                handleChange(e);
              }}
              options={elementOptions}
            />
          </div>

          <div className="w-[72px] h-10 flex items-center flex-shrink-0">
            <CardExpiryElement
              onFocus={handleFocus('cardExpiry')}
              onBlur={handleBlur}
              onChange={handleChange}
              options={elementOptions}
            />
          </div>

          <div className="w-[40px] h-10 flex items-center flex-shrink-0">
            <CardCvcElement
              onFocus={handleFocus('cardCvc')}
              onBlur={handleBlur}
              onChange={handleChange}
              options={elementOptions}
            />
          </div>
        </motion.div>
      </div>
    </div>
    <SubmitForm
      onComplete={async () => {
        const requiredElements = ['cardNumber', 'cardExpiry', 'cardCvc'];
        const isComplete = requiredElements.every(
          elementType => elementState[elementType]?.complete === true
        );
        if (!isComplete) {
          toast.error('Please fill card with valid information');
          return;
        }

        setLoadingCreatePaymentMethod(true);
        const card = elements.getElement(CardNumberElement);
        const paymentMethodData = await stripe.createPaymentMethod({
          type: 'card',
          card: card!,
        });

        if (!paymentMethodData.paymentMethod?.id) {
          toast.error('Failed to create payment method');
          return;
        }

        setStripePaymentMethod(paymentMethodData.paymentMethod.id);
        setLoadingCreatePaymentMethod(false);

        // if (session) {
        //   createCard
        //   return;
        // }

        pay();
      }}
    >
      {(handleSubmit) => (
        <Button
          onClick={handleSubmit}
          loading={loadingCreatePaymentMethod || loadingPay}
        >
          Pay with Card
        </Button>
      )}
    </SubmitForm>
  </>;
};
