'use client';
import { formatUnits } from 'viem';

import { useQuery } from '$lib/graphql/request';
import { GetEventTicketSalesDocument, Event } from '$lib/graphql/generated/backend/graphql';

export function PaymentOverview({ event }: { event: Event }) {
  const { data } = useQuery(GetEventTicketSalesDocument, {
    variables: { event: event._id },
  });

  const sales = data?.getEventTicketSales.sales;

  if (!sales?.length) return;

  return (
    <div className="space-y-8">
      <hr className="border-t" />
      <div className="space-y-5">
        <div>
          <div className="flex justify-between gap-2.5">
            <h1 className="text-xl font-semibold">Payments</h1>
            {/* claim funds */}
          </div>
          <p className="text-secondary">View all your ticket earnings. Track total sales, payouts, and revenue across fiat and crypto.</p>
        </div>

        <div className="rounded-md border-card-border bg-card divide-y divide-[var(--color-divider)]">
          {sales.map((sale, index) => (
            <div key={index} className="flex gap-2 items-center px-4 py-3">
              <span className="text-tertiary">{sale.currency.toUpperCase()}</span>
              <span>{formatUnits(sale.amount, sale.decimals)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
