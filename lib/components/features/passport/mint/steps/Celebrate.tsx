import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

import { Card, Button } from '$lib/components/core';
import { PassportStep, usePassportContext } from '../provider';

export function PassportCelebrate() {
  const [state] = usePassportContext();
  const { address } = useAppKitAccount();

  if (state.currentStep !== PassportStep.celebrate) return null;

  const shareText = encodeURIComponent(`Just claimed my Lemonade Passport 🎉 Join me on-chain!`);
  const shareUrl = encodeURIComponent(`${window.location.origin}/passport`);

  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center text-center px-4">
      <div className="flex flex-col gap-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="size-32 rounded-full bg-gradient-to-br from-accent-500 to-primary flex items-center justify-center animate-pulse">
              <i className="icon-celebration size-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 size-10 rounded-full bg-success-400 flex items-center justify-center border-4 border-background">
              <i className="icon-verified size-6 text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-3xl md:text-4xl font-semibold">Congratulations!</h3>
          <p className="text-lg text-tertiary">
            You've successfully claimed your Lemonade Passport
          </p>
        </div>

        {state.photo && (
          <Card.Root>
            <Card.Content className="flex flex-col items-center gap-4">
              <img 
                src={state.photo} 
                alt="Passport" 
                className="size-24 rounded-full object-cover border-4 border-primary/20"
              />
              <div>
                <p className="font-medium">Your Verified Identity</p>
                {state.mint.tokenId && (
                  <p className="text-sm text-tertiary">Token ID: #{state.mint.tokenId}</p>
                )}
              </div>
            </Card.Content>
          </Card.Root>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Share Your Achievement</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="tertiary"
              icon="icon-x-twitter"
              size="sm"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')}
            >
              Share on X
            </Button>
            <Button
              variant="tertiary"
              icon="icon-farcaster"
              size="sm"
              onClick={() => window.open(`https://warpcast.com/~/compose?text=${shareText}`, '_blank')}
            >
              Share on Farcaster
            </Button>
          </div>
        </div>

        <Card.Root className="border-primary/20 bg-primary/5">
          <Card.Content className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2">
              <i className="icon-sparkles size-5 text-accent-400" />
              <p className="font-medium">What's Next?</p>
            </div>
            <ul className="text-sm text-tertiary space-y-2">
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Explore exclusive features unlocked by your passport</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Join verified-only events and communities</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Start earning achievements and rewards</span>
              </li>
            </ul>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}

