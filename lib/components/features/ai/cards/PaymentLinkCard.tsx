'use client';

import { useState, useEffect } from 'react';

import type { AtlasCheckoutInfo } from '$lib/types/atlas';

interface PaymentLinkCardProps {
  checkout: AtlasCheckoutInfo;
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function PaymentLinkCard({ checkout }: PaymentLinkCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return new Date(checkout.expires_at).getTime() - Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(checkout.expires_at).getTime() - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [checkout.expires_at]);

  const isExpired = timeLeft <= 0;

  return (
    <div className="rounded-md border border-card-border bg-overlay-secondary p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-primary text-sm font-medium">{checkout.event_title}</p>
        <span className="text-quaternary text-xs">
          {checkout.quantity}x {checkout.ticket_name}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-primary text-xl font-semibold">
          {checkout.currency} {checkout.amount.toFixed(2)}
        </span>
        {checkout.usdc_equivalent != null && (
          <span className="text-tertiary text-xs">{checkout.usdc_equivalent.toFixed(2)} USDC</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {checkout.payment_methods.map((method) => (
          <span
            key={method}
            className="px-2 py-0.5 rounded-full bg-overlay-secondary border border-card-border text-quaternary text-[10px] uppercase"
          >
            {method}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        {isExpired ? (
          <span className="text-danger-500 text-xs font-medium">Hold expired</span>
        ) : (
          <span className="text-tertiary text-xs">
            Expires in <span className="text-warning-300 font-medium">{formatTimeRemaining(timeLeft)}</span>
          </span>
        )}

        <a
          href={checkout.checkout_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={isExpired}
          className={
            isExpired
              ? 'px-4 py-1.5 rounded-md text-sm font-medium bg-overlay-secondary text-quaternary pointer-events-none'
              : 'px-4 py-1.5 rounded-md text-sm font-medium bg-accent-400 text-white hover:bg-accent-400/90 transition-colors'
          }
        >
          Pay Now
        </a>
      </div>
    </div>
  );
}
