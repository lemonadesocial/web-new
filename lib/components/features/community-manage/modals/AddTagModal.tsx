'use client';
import { Button, InputField, modal, ModalContent, toast } from '$lib/components/core';
import { GetSpaceTagsDocument, SpaceTagType, UpsertSpaceTagDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import clsx from 'clsx';
import React from 'react';

const COLORS_TAG = [
  '#D2D4D7',
  '#F98DBE',
  '#D27CFE',
  '#B596FF',
  '#76ADFF',
  '#76EAFF',
  '#77D86B',
  '#F3C977',
  '#FBA679',
  '#FF766D',
];

export default function AddTagModal({
  title,
  subtitle,
  spaceId,
  type,
  value = {
    tag: '',
    color: COLORS_TAG[0],
  },
}: {
  title: string;
  subtitle: string;
  spaceId: string;
  type: SpaceTagType;
  value?: {
    tag: string;
    color: string;
    id?: string;
  };
}) {
  const [tag, setTag] = React.useState(value.tag);
  const [color, setColor] = React.useState(value.color);

  const { refetch, loading: refetching } = useQuery(GetSpaceTagsDocument, {
    variables: { space: spaceId },
    skip: !spaceId,
  });

  const [upsert, { loading }] = useMutation(UpsertSpaceTagDocument);

  return (
    <ModalContent icon="icon-price-tag" onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-xl">{title}</p>
          <p className="text-sm text-tertiary">{subtitle}</p>
        </div>
        <InputField label="Name" value={tag} onChangeText={setTag} />

        <div className="space-y-1.5">
          <label className="text-sm text-secondary">Color</label>
          <div className="flex gap-1 overflow-auto no-scrollbar">
            {COLORS_TAG.map((c, idx) => (
              <div
                key={idx}
                className={clsx(
                  'size-[35px] aspect-square p-0.5 rounded-full cursor-pointer border-2',
                  c === color ? 'border-primary' : 'border-transparent',
                )}
                onClick={() => setColor(c)}
              >
                <div key={idx} className="w-full h-full rounded-full" style={{ backgroundColor: c }} />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="secondary"
          disabled={!tag}
          loading={loading || refetching}
          onClick={async () => {
            await upsert({ variables: { input: { color, tag, space: spaceId, type, _id: value.id } } });
            await refetch();
            toast.success('Create tag success!');
            modal.close();
          }}
        >
          {value.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </ModalContent>
  );
}
