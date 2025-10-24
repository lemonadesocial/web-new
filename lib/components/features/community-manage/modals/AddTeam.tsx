'use client';

import { Badge, Button, InputField, modal, ModalContent } from '$lib/components/core';
import { AddSpaceMembersDocument, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import React from 'react';

export function AddTeam({
  spaceId,
  icon,
  title,
  btnText,
  subtitle,
  role,
  onCompleted,
}: {
  spaceId: string;
  icon: string;
  title: string;
  subtitle: string;
  btnText: string;
  role: SpaceRole.Admin | SpaceRole.Ambassador;
  onCompleted?: () => void;
}) {
  const [addresses, setAddresses] = React.useState<string[]>([]);

  const [addTeam, { loading }] = useMutation(AddSpaceMembersDocument, {
    onComplete: (client, income) => {
      modal.close();
      onCompleted?.();
    },
  });

  return (
    <ModalContent className="max-w-sm md:max-w-md w-full overflow-x-hidden" icon={icon} onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">{title}</p>
          <p className="text-sm text-secondary">{subtitle}</p>
        </div>

        <InputTags onChange={setAddresses} />

        <Button
          variant="secondary"
          loading={loading}
          disabled={!addresses.length}
          onClick={() =>
            addTeam({
              variables: {
                input: { space: spaceId, users: addresses.map((email) => ({ email, user_name: '' })), role },
              },
            })
          }
        >
          {btnText}
        </Button>
      </div>
    </ModalContent>
  );
}

function InputTags({ value = [], onChange }: { value?: string[]; onChange?: (value: string[]) => void }) {
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
              const arr = tags.filter((i) => i !== t);
              setTags(arr);
              onChange?.(arr);
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
                onChange?.(arr);
              }
            }}
          />
        </div>
      </div>
    </fieldset>
  );
}
