'use client';
import { Button, Card } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';

export function Payouts({ space }: { space: Space }) {
  return (
    <div className="p-4 md:p-12 flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Payouts</h3>
        <p className="text-tertiary">Connect and manage your payout methods to receive earnings from your community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StripCard />

        <Card.Root>
          <Card.Content className="flex flex-col justify-between gap-4">
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-tertiary">All Time</p>
                <p className="text-xl">$17,825</p>
              </div>

              <div>
                <p className="text-sm text-tertiary">Last Month</p>
                <p className="text-xl">$264</p>
              </div>

              <div>
                <p className="text-sm text-tertiary">Tickets Sold</p>
                <p className="text-xl">1,227</p>
              </div>

              <div>
                <p className="text-sm text-tertiary">Platform Fees</p>
                <p className="text-xl">2%</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-tertiary text-sm text-center">Waive the Platform Fee with Lemonade Pro.</p>
              <Button>Upgrade to Lemonade Pro</Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}

function StripCard() {
  return (
    <Card.Root>
      <Card.Header className="bg-transparent flex gap-4 py-3 border-b">
        <i className="icon-stripe-alt size-10" />
        <div>
          <p>Stripe Account</p>
          <div className="text-success-500 flex gap-1 items-center">
            <div className="size-2 rounded-full bg-success-500"></div>
            <p className="text-sm">Active</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4 pt-3">
        <div className="space-y-2 text-secondary">
          <p>Your Stripe account is active and accepting payments.</p>
          <p>Stripe is reporting the following requirements for verification:</p>
          <ul className="list-disc pl-4">
            <li>
              <p>Interv 1RIQWvLbhPLotAOBNPoK1xvE - Business Model Verification.form</p>
            </li>
            <li>
              <p>Other</p>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="tertiary-alt" iconRight="icon-arrow-outward" className="flex-1">
            Open Stripe
          </Button>
          <Button icon="icon-more-vert" variant="tertiary-alt"></Button>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
