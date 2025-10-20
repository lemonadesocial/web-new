import { Button, InputField, modal, ModalContent, TextAreaField, toast } from '$lib/components/core';
import { Space, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { values } from 'lodash';
import { Controller, useForm } from 'react-hook-form';

export function TitleDescModal({ space }: { space?: Space }) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: space?.title,
      description: space?.description,
    },
  });

  const [update] = useMutation(UpdateSpaceDocument, {
    onComplete: (client, income) => {
      toast.success('Update success.');
      client.writeFragment({ id: `Space:${space?._id}`, data: { ...space, ...income.updateSpace } });
      modal.close();
    },
  });

  const onSubmit = async (input: Partial<Space>) => {
    await update({ variables: { id: space?._id, input } });
  };

  return (
    <ModalContent className="w-sm" onClose={() => modal.close()}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <InputField label="Title" value={field.value} onChange={field.onChange} />}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextAreaField
              label="Description"
              className="[&_textarea]:no-scrollbar h-44! pr-0!"
              value={field.value}
              placeholder="Add a short description"
              onChange={field.onChange}
            />
          )}
        />

        <Button variant="tertiary-alt" type="submit" loading={isSubmitting}>
          Save
        </Button>
      </form>
    </ModalContent>
  );
}
