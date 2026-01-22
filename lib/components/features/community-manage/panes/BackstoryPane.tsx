'use client';
import React from 'react';
import { Button, Textarea, modal, ModalContent } from '$lib/components/core';

interface Props {
  initialValue?: string;
  onSave: (value: string) => void;
}

export function BackstoryPane({ initialValue = '', onSave }: Props) {
  const [backstory, setBackstory] = React.useState(initialValue);

  const handleSave = () => {
    onSave(backstory);
    modal.close();
  };

  return (
    <div className="w-[480px] max-w-full">
      <div className="flex justify-between items-center px-5 py-3 border-b bg-card">
        <p className="text-lg">Backstory</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <Textarea
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            rows={5}
            variant="outlined"
            placeholder="This agent acts like a friendly host who knows everything about the community."
            className="w-full"
          />
          <p className="text-sm text-tertiary">
            Optional context that shapes how the agent thinks and responds.
          </p>
        </div>
        <Button variant="secondary" onClick={handleSave} className="w-full" disabled={!backstory}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
