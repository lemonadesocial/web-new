'use client';
import React from 'react';
import Link from 'next/link';

import { Button, Checkbox, modal, ModalContent } from '$lib/components/core';
import { PassportModalConfig } from '../types';

export function BeforeMintPassportModal({
  onContinue,
  config,
}: {
  onContinue: () => void;
  config: PassportModalConfig;
}) {
  const [agree, setAgree] = React.useState(false);

  return (
    <ModalContent icon="icon-signature" onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Before You Mint</p>
          <p className="text-sm">Please review and agree to the terms.</p>
          <p className="text-sm">{config.description}</p>
          <ul className="list-disc pl-5.5 text-sm">
            {config.li.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <div className="flex gap-1 items-center">
            <Link href={config.termLink || ''} target="_blank" className="text-accent-400 text-sm">
              View Full Terms of Use
            </Link>
            <i className="icon-arrow-outward size-[18px] text-quaternary" />
          </div>
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
