import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

// Stripe element styling
const elementOptions = {
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
  // State to track which element is focused
  const [focusedElement, setFocusedElement] = useState<'card' | 'expiry' | 'cvc' | null>(null);
  // State to track if the card number is complete
  const [isCardNumberComplete, setIsCardNumberComplete] = useState(false);

  // Focus and blur handlers
  const handleFocus = (element: 'card' | 'expiry' | 'cvc') => () => setFocusedElement(element);
  const handleBlur = () => setFocusedElement(null);

  // Card number change handler to detect completion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardChange = (event: any) => {
    setIsCardNumberComplete(event.complete);
  };

  // Container width and slide amount
  // const containerWidth = 400; // pixels
  const slideAmount = (3 / 4) * 150; // Slide left by 3/4 of container width

  // Determine the x-position based on focus and completion state
  let xPosition = 0;
  if (focusedElement === 'card') {
    // Always show full card number when focused
    xPosition = 0;
  } else if (focusedElement === 'expiry' || focusedElement === 'cvc') {
    // Slide to show CVC when expiry or CVC is focused
    xPosition = -slideAmount;
  } else {
    // Nothing focused: slide if complete, stay at 0 if incomplete
    xPosition = isCardNumberComplete ? -slideAmount : 0;
  }

  return (
    <div
      className="w-full overflow-hidden bg-primary/8 h-10 px-2.5 rounded-sm"
    >
      <motion.div
        className="flex gap-2.5 items-center"
        animate={{ x: xPosition }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Card Number */}
        <div className="w-[150px] h-10 flex items-center flex-shrink-0">
          <CardNumberElement
            onFocus={handleFocus('card')}
            onBlur={handleBlur}
            onChange={handleCardChange}
            options={elementOptions}
          />
        </div>

        {/* Expiry Date */}
        <div className="w-[100px] h-10 flex items-center flex-shrink-0">
          <CardExpiryElement
            onFocus={handleFocus('expiry')}
            onBlur={handleBlur}
            options={elementOptions}
          />
        </div>

        {/* CVC */}
        <div className="w-[80px] h-10 flex items-center flex-shrink-0">
          <CardCvcElement
            onFocus={handleFocus('cvc')}
            onBlur={handleBlur}
            options={elementOptions}
          />
        </div>
      </motion.div>
    </div>
  );
};
