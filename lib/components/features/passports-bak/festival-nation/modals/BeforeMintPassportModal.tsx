'use client';
import React from 'react';
import Link from 'next/link';

import { Button, Checkbox, modal, ModalContent } from '$lib/components/core';

export function BeforeMintPassportModal({ onContinue }: { onContinue: () => void }) {
  const [agree, setAgree] = React.useState(false);

  return (
    <ModalContent icon="icon-signature" onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Before You Mint</p>
          <p className="text-sm">Please review and agree to the terms.</p>
          <p className="text-sm">
            By minting your Festival Nation Passport, you agree to our Terms of Use and acknowledge that:
          </p>
          <ul className="list-disc pl-5.5 text-sm">
            <li className="text-secondary text-sm font-medium">
              Festival Nation Passport NFT is non-transferable & non-tradable (soul-bound).
            </li>
            <li className="text-secondary text-sm font-medium">Your Passport will be permanently recorded on-chain.</li>
            <li className="text-secondary text-sm font-medium">
              It will be publicly visible and tied to your wallet address.
            </li>
            <li className="text-secondary text-sm font-medium">All claims are final.</li>
          </ul>
          {/* 
          <div className="flex gap-1 items-center">
            <Link href="" target="_blank" className="text-accent-400 text-sm">
              View Full Terms of Use
            </Link>
            <i className="icon-arrow-outward size-[18px] text-quaternary" />
          </div> */}
        </div>

        <Checkbox
          containerClass="text-sm items-center [&_i]:size-5"
          id="term"
          value={agree}
          onChange={() => setAgree(!agree)}
        >
          I’ve read and agree to the Terms of Use.
        </Checkbox>

        <Button
          variant="secondary"
          disabled={!agree}
          onClick={() => {
            modal.close();
            onContinue();
          }}
        >
          Continue
        </Button>
      </div>
    </ModalContent>
  );
}
