import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { StripeCardNumberElementOptions } from '@stripe/stripe-js';

const elementOptions: StripeCardNumberElementOptions  = {
  style: {
    base: {
      color: '#FFF',
      fontSize: '16px',
      fontWeight: '500',
      '::placeholder': { color: 'rgba(255, 255, 255, 0.24)' },
    },
  },
  classes: {
    base: 'w-full',
  },
};

export const CardInput: React.FC = () => {
  const [focusedElement, setFocusedElement] = useState<'card' | 'expiry' | 'cvc' | null>(null);
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);
  const [cardBrand, setCardBrand] = useState<string | undefined>(undefined);

  const handleFocus = (element: 'card' | 'expiry' | 'cvc') => () => setFocusedElement(element);
  const handleBlur = () => setFocusedElement(null);

  const handleCardChange = (event: any) => {
    setIsCardNumberComplete(event.complete);
    if (event.brand) {
      setCardBrand(event.brand);
    }
  };

  const [xPosition, cardNumberWidth] = useMemo(() => {
    const slideAmount = 120;

    if (focusedElement === 'card') {
      return [0, 236];
    } else if (focusedElement === 'expiry' || focusedElement === 'cvc') {
      return [-slideAmount, 312];
    } else {
      return isCardNumberComplete ? [-slideAmount, 312] : [0, 236];
    }
  }, [focusedElement, isCardNumberComplete]);

  return (
    <div
      className="w-full bg-primary/8 h-10 px-2.5 rounded-sm relative flex gap-2.5 items-center"
    >
      {
        cardBrand ? <div className="size-6 flex items-center">
          {
            cardBrand === 'visa' && <img src="/assets/images/cards/visa.svg" width={20} alt="visa" />
          }
          {
            cardBrand === 'mastercard' && <img src="/assets/images/cards/mastercard.svg" width={20} alt="mastercard" />
          }
          {
            cardBrand === 'unknown' && <img src="/assets/images/cards/card-active.svg" width={20} alt="card-active" />
          }
        </div> : <i className="icon-card min-w-6" />
      }

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-2.5 items-center" /* Added left padding to make room for the icon */
          animate={{ x: xPosition }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={`h-10 flex items-center flex-shrink-0`} style={{ width: cardNumberWidth }}>
            <CardNumberElement
              onFocus={handleFocus('card')}
              onBlur={handleBlur}
              onChange={handleCardChange}
              options={elementOptions}
            />
          </div>

          <div className="w-[72px] h-10 flex items-center flex-shrink-0">
            <CardExpiryElement
              onFocus={handleFocus('expiry')}
              onBlur={handleBlur}
              options={elementOptions}
            />
          </div>

          <div className="w-[40px] h-10 flex items-center flex-shrink-0">
            <CardCvcElement
              onFocus={handleFocus('cvc')}
              onBlur={handleBlur}
              options={elementOptions}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
