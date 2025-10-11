import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

import { Card } from '$lib/components/core';
import { PassportStep, usePassportContext } from '../provider';
import { truncateMiddle } from '$lib/utils/string';

export function PassportClaim() {
  const [state] = usePassportContext();
  const { address, isConnected } = useAppKitAccount();

  if (state.currentStep !== PassportStep.claim) return null;

  return (
    <div className="flex-1 flex flex-col gap-8 max-sm:justify-end max-sm:h-full">
      <div className="hidden md:flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Review & Claim</h3>
        <p className="text-tertiary">Review your passport details before claiming your on-chain identity.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <p>Passport Preview</p>

          <Card.Root>
            <Card.Content className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {state.photo ? (
                  <img
                    src={state.photo}
                    alt="Profile"
                    className="size-20 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <i className="icon-user size-10 text-tertiary" />
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium">Your Passport</p>
                  <p className="text-sm text-tertiary">Verified Identity NFT</p>
                </div>
              </div>

              {isConnected && address && (
                <div className="flex items-center justify-between p-3 rounded-md bg-background/50 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <i className="icon-wallet size-5 text-tertiary" />
                    <p className="text-sm">{truncateMiddle(address, 8, 6)}</p>
                  </div>
                  <i className="icon-verified size-5 text-success-400" />
                </div>
              )}
            </Card.Content>
          </Card.Root>
        </div>

        <div className="flex flex-col gap-3">
          <p>What Happens Next?</p>

          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-start">
              <div className="size-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">1</span>
              </div>
              <div>
                <p className="text-sm font-medium">Mint Your Passport</p>
                <p className="text-sm text-tertiary">Your passport NFT will be minted to your wallet</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="size-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">2</span>
              </div>
              <div>
                <p className="text-sm font-medium">Unlock Features</p>
                <p className="text-sm text-tertiary">Access exclusive content and platform benefits</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="size-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">3</span>
              </div>
              <div>
                <p className="text-sm font-medium">Build Your Reputation</p>
                <p className="text-sm text-tertiary">Earn achievements and grow within the community</p>
              </div>
            </div>
          </div>
        </div>

        <Card.Root className="border-accent-500/20 bg-accent-500/5">
          <Card.Content className="flex gap-3">
            <i className="icon-info size-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Important</p>
              <p className="text-tertiary">
                Your passport is a non-transferable (soulbound) NFT. It will be permanently linked to your wallet
                address.
              </p>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}
