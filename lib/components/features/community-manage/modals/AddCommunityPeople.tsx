import clsx from 'clsx';
import { uniqBy } from 'lodash';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, array, string } from 'yup';

import { Button, Card, FileInput, InputField, modal, ModalContent, Spacer } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { AddSpaceMembersDocument, SpaceRole, SpaceTagType } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { AddTags } from '$lib/components/features/community/ListingEvent';

type ContentKey = 'default' | 'import_csv' | 'manual' | 'import_csv.confirm' | 'manual.confirm';
const obj: Record<ContentKey, any> = {
  default: DefaultContent,
  import_csv: ImportCsvContent,
  manual: AddManualContent,
  'import_csv.confirm': ConfirmImport,
  'manual.confirm': ConfirmImport,
};

const schemaEmailAddresses = object().shape({
  people: array()
    .transform((originalValue) => {
      if (originalValue && originalValue.length > 0) {
        return originalValue.slice(0, originalValue.length - 1);
      }
      return originalValue;
    })
    .of(
      object().shape({
        email: string().email(),
        user_name: string(),
      }),
    ),
});

type FormPeopleValue = {
  view: ContentKey;
  people: { user_name?: string; email: string }[];
  tags: string[];
};

export function AddCommunityPeople({ spaceId, onCompleted }: { spaceId: string; onCompleted: () => void }) {
  const form = useForm<FormPeopleValue>({
    defaultValues: { view: 'default', people: [{ email: '', user_name: '' }], tags: [] },
    resolver: yupResolver(schemaEmailAddresses),
  });
  const view = form.watch('view');
  const Content = obj[view];

  const [addPeopleFn] = useMutation(AddSpaceMembersDocument, {});

  const onSubmit = async (values: FormPeopleValue) => {
    const users = values.people.filter((item) => item.email);
    await addPeopleFn({
      variables: { input: { role: SpaceRole.Subscriber, space: spaceId, users, tags: values.tags } },
    });
    onCompleted();
    modal.close();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Content form={form} spaceId={spaceId} />
    </form>
  );
}

interface CommonProps {
  form: UseFormReturn<FormPeopleValue, any, undefined>;
  spaceId: string;
}

function DefaultContent({ form }: CommonProps) {
  return (
    <ModalContent className="w-[480px]" icon="icon-user-group-outline-2" onClose={() => modal.close()}>
      <p className="text-lg">Add People</p>
      <p className="text-sm text-secondary">Import your subscribers into your community.</p>

      <Spacer className="h-4" />
      <div className="flex gap-2">
        <Card.Root className="flex-1" onClick={() => form.setValue('view', 'import_csv')}>
          <Card.Content className="py-3.5">
            <i aria-hidden="true" className="icon-csv size-8 text-tertiary" />
            <Spacer className="h-3" />
            <p>Import CSV</p>
            <p className="text-tertiary text-sm">Import from other services</p>
          </Card.Content>
        </Card.Root>

        <Card.Root className="flex-1" onClick={() => form.setValue('view', 'manual')}>
          <Card.Content className="py-3.5">
            <i aria-hidden="true" className="icon-edit-square size-8 text-tertiary" />
            <Spacer className="h-3" />
            <p>Enter Manually</p>
            <p className="text-tertiary text-sm">Paste in a list of emails</p>
          </Card.Content>
        </Card.Root>
      </div>
    </ModalContent>
  );
}

function ImportCsvContent({ form }: CommonProps) {
  const people = form.watch('people');
  const list = people.filter((i) => i.email);

  const handleCsvChange = (files: File[]) => {
    const file = files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const lines = csvData.split('\n');
        const header = lines[0].split(',');
        const nameIndex = header.findIndex((h) => h.toLowerCase() === 'name'); // Find the index of the 'name' column, case-insensitive
        const dt = lines.slice(1).flatMap((line) => {
          const cells = line.split(',');
          const name = cells[nameIndex]?.trim();
          const emails = cells.flatMap((cell) => cell.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []); // Extract emails using regex
          return emails.map((email) => ({ user_name: name, email: email.trim() }));
        });

        const arr = uniqBy([...people, ...dt], 'email');
        form.setValue('people', arr);
      };
      reader.readAsText(file);
    }
  };

  return (
    <ModalContent className="w-[480px]" title="Add People" onBack={() => form.reset()} onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        {!list.length && (
          <a
            href={`${ASSET_PREFIX}/assets/templates/import-people-template.csv`}
            className="flex gap-1.5 items-center text-tertiary"
            download
          >
            <i aria-hidden="true" className="icon-download size-4" />
            <p className="text-sm">Download CSV Template</p>
          </a>
        )}

        <FileInput accept=".csv" multiple={false} allowDrop={true} onChange={handleCsvChange}>
          {(open, isDragOver) =>
            !list.length ? (
              <div
                className={clsx(
                  'flex flex-col items-center justify-center border border-dashed rounded-sm p-6 gap-4 cursor-pointer transition bg-card',
                  isDragOver && 'border-primary',
                )}
                onClick={open}
              >
                <>
                  <i aria-hidden="true" className="icon-csv size-6 text-tertiary" />
                  <div>
                    <p className="text-center">Import CSV File</p>
                    <div className="text-sm text-center">Drop file or click here to choose file.</div>
                  </div>
                </>
              </div>
            ) : (
              <div
                className={clsx(
                  'flex flex-col items-center justify-center border border-dashed rounded-sm px-6 py-3 cursor-pointer transition bg-card',
                )}
                onClick={open}
              >
                <p>Import Another CSV</p>
              </div>
            )
          }
        </FileInput>

        {!!list.length && (
          <Card.Root className="max-h-[456px] overflow-auto no-scrollbar">
            <Card.Content className="p-3 flex flex-col gap-1.5">
              {list.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <p>{item.user_name || 'Anonymous'}</p>
                    <p className="text-tertiary line-clamp-1">{item.email}</p>
                  </div>
                  <i
                    className="icon-x size-5 text-tertiary hover:text-primary cursor-pointer"
                    onClick={() =>
                      form.setValue(
                        'people',
                        people.filter((i) => i.email !== item.email),
                      )
                    }
                  />
                </div>
              ))}
            </Card.Content>
          </Card.Root>
        )}

        <Button
          variant="secondary"
          disabled={!people.length}
          onClick={() => form.setValue('view', 'import_csv.confirm')}
        >
          Preview
        </Button>
      </div>
    </ModalContent>
  );
}

function AddManualContent({ form }: CommonProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'people',
  });
  const people = form.watch('people');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...people[index],
    };
  });

  return (
    <ModalContent className="w-[480px]" title="Add People" onBack={() => form.reset()} onClose={() => modal.close()}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-secondary">
          Pro tip: You can paste multiple emails into a single input, separated by comma or space.
        </p>

        <Card.Root className="max-h-[484px] overflow-auto no-scrollbar bg-transparent">
          <Card.Content className="p-0 overflow-hidden divide-y divide-(--color-divider)">
            {controlledFields.map((item, idx) => {
              const canRemove = controlledFields.length > 1 && idx < controlledFields.length - 1;

              return (
                <div key={idx} className="flex divide-x divide-(--color-divider)">
                  <InputField
                    value={item.email}
                    onChange={(e) => {
                      form.setValue(`people.${idx}.email`, e.target.value);
                      if (e.target.value?.length >= 2 && idx === people.length - 1) {
                        append({ email: '', user_name: '' });
                      }
                    }}
                    className="[&_.control]:border-none! [&_.control]:rounded-none! w-full max-w-[160px] md:max-w-[202px]"
                    placeholder="Email Address"
                  />
                  <InputField
                    value={item.user_name}
                    onChange={(e) => form.setValue(`people.${idx}.user_name`, e.target.value)}
                    className="[&_.control]:border-none! [&_.control]:rounded-none! w-full"
                    placeholder="Full Name (Optional)"
                  />
                  {canRemove && (
                    <Button
                      icon="icon-x"
                      variant="flat"
                      className="hover:bg-(--input-bg)! bg-(--input-bg)! text-tertiary! hover:text-primary! rounded-none! border-none!"
                      onClick={() => remove(idx)}
                    />
                  )}
                </div>
              );
            })}
          </Card.Content>
        </Card.Root>

        <Button
          variant="secondary"
          disabled={!schemaEmailAddresses.isValidSync({ people: controlledFields })}
          onClick={() => form.setValue('view', 'manual.confirm')}
        >
          Preview
        </Button>
      </div>
    </ModalContent>
  );
}

function ConfirmImport({ form, spaceId }: CommonProps) {
  const [view, people] = form.watch(['view', 'people']);
  const list = people.filter((i) => i.email);

  return (
    <ModalContent
      className="w-[480px]"
      title="Confirm Import"
      onBack={() => form.setValue('view', view.split('.')[0] as ContentKey)}
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <Card.Root>
          <Card.Content className="py-3">
            <p className="text-sm text-tertiary">Importing {list.length} people</p>
            <p>
              {list
                .slice(0, 2)
                .map((i) => i.user_name || i.email)
                .join(', ')}
              {list.length > 2 && ` & ${list.length - 2} others`}
            </p>
          </Card.Content>
        </Card.Root>

        {spaceId && <AddTags spaceId={spaceId} type={SpaceTagType.Member} />}

        <Button variant="secondary" type="submit" disabled={!list.length} loading={form.formState.isSubmitting}>
          Start Import
        </Button>
        <div className="text-center text-xs text-tertiary">
          <p>You may only import people who have consented to receive emails.</p>
          <p>Violating this could risk an account suspension.</p>
        </div>
      </div>
    </ModalContent>
  );
}
