'use client';

import { Badge, InputField, modal, ModalContent } from '$lib/components/core';
import React from 'react';

export function AddTeam({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  const [addresses, setAddresses] = React.useState<string[]>([]);
  return (
    <ModalContent className="max-w-sm md:max-w-md w-full overflow-x-hidden" icon={icon} onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">{title}</p>
          <p className="text-sm text-secondary">{subtitle}</p>
        </div>

        <InputTags />
      </div>
    </ModalContent>
  );
}

function InputTags({ value = [] }: { value?: string[]; onAdd?: (value: string[]) => void }) {
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState(value);
  return (
    <fieldset className="input-field">
      <div className="control p-1! min-h-[40px] h-auto! flex flex-wrap gap-1! items-center">
        {tags.map((t) => (
          <Badge
            className="text-md"
            title={t}
            color="var(--color-secondary)"
            onClose={() => {
              setTags((prev) => prev.filter((i) => i !== t));
            }}
          />
        ))}
        <div className="w-full pl-2">
          <input
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const arr = [...tags, e.currentTarget.value];
                setText('');
                setTags(arr);
              }
            }}
          />
        </div>
      </div>
    </fieldset>
  );
}
