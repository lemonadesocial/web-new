'use client';
import React from 'react';
import { Button, Input, modal } from '$lib/components/core';

interface Props {
  initialValue?: string;
  onSave: (value: string) => void;
}

export function OpenAIKeyPane({ initialValue = '', onSave }: Props) {
  const [key, setKey] = React.useState(initialValue);

  const handleSave = () => {
    onSave(key);
    modal.close();
  };

  return (
    <div className="w-[480px] max-w-full">
      <div className="flex justify-between items-center px-5 py-3 border-b bg-card">
        <p className="text-lg">OpenAI Key</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} />
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-secondary">
          By default, your agent uses Lemonade&apos;s managed AI setup. Use your own OpenAI key for full control over usage and limits.
        </p>
        <div className="space-y-1.5">
          <p className="text-sm text-secondary">OpenAI API Key</p>
          <Input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            variant="outlined"
            placeholder="sk-..."
            className="w-full"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-secondary">What happens when you use your own key:</p>
          <ul className="text-sm space-y-2 list-disc list-inside font-medium">
            <li>AI usage for this agent is billed to your OpenAI account</li>
            <li>Rate limits depend on your OpenAI plan</li>
            <li>Lemonade will not cap or monitor usage for this agent</li>
          </ul>
        </div>
        <Button variant="secondary" onClick={handleSave} className="w-full">
          Save Key
        </Button>
      </div>
    </div>
  );
}
