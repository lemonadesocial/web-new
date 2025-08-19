import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';

import { ModalContent, modal, Button, Input, FileInput, LabeledInput, Textarea, Segment } from '$lib/components/core';
import { Event, PoapClaimMode } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { CreatePoapDropDocument } from '$lib/graphql/generated/backend/graphql';
import { uploadFiles } from '$lib/utils/file';
import { toast } from '$lib/components/core/toast';
import { ListPoapDropsDocument } from '$lib/graphql/generated/backend/graphql';
import { TicketTypeSelector } from '../overview/TicketTypeSelector';

interface CreateNewCollectibleModalProps {
  event: Event;
}

interface FormData {
  name: string;
  description: string;
  image: File | null;
  totalQuantity: number | undefined;
  claimableOn: 'registration' | 'checkin';
  selectedTicketTypes: string[];
}

export function CreateNewCollectibleModal({ event }: CreateNewCollectibleModalProps) {
  const [showClaimSettings, setShowClaimSettings] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [createPoapDrop, { loading: createPoapLoading }] = useMutation(CreatePoapDropDocument, {
    onComplete: (client, response) => {
      if (response?.createPoapDrop) {
        const existingData = client.readQuery(ListPoapDropsDocument, { event: event._id });
        if (existingData?.listPoapDrops) {
          client.writeQuery({
            query: ListPoapDropsDocument,
            variables: { event: event._id },
            data: {
              ...existingData,
              listPoapDrops: [...existingData.listPoapDrops, response.createPoapDrop]
            }
          });
        }
        toast.success(`Collectible submitted! Guests will be able to claim it once it's live—usually within ~20 seconds.`);
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create collectible');
    }
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
      totalQuantity: undefined,
      claimableOn: 'registration',
      selectedTicketTypes: []
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  const handleNext = () => {
    setShowClaimSettings(true);
  };

  const handleBack = () => {
    setShowClaimSettings(false);
  };

  const onSubmit = async (data: FormData) => {
    if (!data.totalQuantity) {
      toast.error('Please provide a total quantity for the collectible');
      return;
    }

    setImageUploadLoading(true);
    try {
      const uploadedFiles = await uploadFiles([data.image!], 'event');
      const imageId = uploadedFiles[0]?._id;

      if (!imageId) {
        toast.error('Failed to upload image');
        return;
      }

      const claimMode = data.claimableOn === 'registration' ? PoapClaimMode.Registration : PoapClaimMode.CheckIn;
      const ticketTypeIds = data.selectedTicketTypes;
      const isProd = process.env.APP_ENV === 'production';

      createPoapDrop({
        variables: {
          input: {
            name: isProd ? data.name.trim() : `TEST ${data.name.trim()}`,
            description: data.description.trim(),
            image: imageId,
            event: event._id,
            amount: data.totalQuantity,
            claim_mode: claimMode,
            ticket_types: ticketTypeIds.length > 0 ? ticketTypeIds : undefined,
            private: isProd ? false : true
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleTicketTypesChange = (ticketIds: string[]) => {
    setValue('selectedTicketTypes', ticketIds);
  };

  if (showClaimSettings) {
    return (
      <ModalContent
        onClose={() => modal.close()}
        onBack={handleBack}
        title="Claim Settings"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={watchedValues.image ? URL.createObjectURL(watchedValues.image) : ''} alt="Preview" className="size-[34px] rounded-sm object-cover" />
            <p className="text-sm">{watchedValues.name}</p>
          </div>

          <hr className="border-t border-t-divider -mx-4" />

          <div className='flex justify-between items-center'>
            <p className='text-sm text-secondary'>Total Quantity</p>
            <Controller
              name="totalQuantity"
              control={control}
              rules={{ required: 'Total quantity is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  variant="outlined"
                  className='w-[96px]'
                  type='number'
                  error={!!errors.totalQuantity}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-secondary">Eligible Ticket Types</p>
            <Controller
              name="selectedTicketTypes"
              control={control}
              render={({ field }) => (
                <TicketTypeSelector
                  value={field.value || []}
                  onChange={handleTicketTypesChange}
                  ticketTypes={event.event_ticket_types || []}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm text-secondary">Claimable On</p>
            <Controller
              name="claimableOn"
              control={control}
              render={({ field }) => (
                <Segment
                  selected={field.value}
                  onSelect={(item) => field.onChange(item.value as 'registration' | 'checkin')}
                  className="w-full"
                  items={[
                    { label: 'Registration', value: 'registration' },
                    { label: 'Check In', value: 'checkin' }
                  ]}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="secondary"
            loading={createPoapLoading || imageUploadLoading}
          >
            Save
          </Button>
        </form>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      icon="icon-diamond"
      onClose={() => modal.close()}
    >
      <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Create New Collectible</p>
          <p className="text-sm text-secondary">Design and issue a unique collectible for your event attendees.</p>
          <div className="flex items-center gap-1">
            <span className="text-tertiary text-sm">Powered by</span>
            <i className="icon-poap size-4.5" />
          </div>
        </div>

        <div className="flex gap-3">
          <Controller
            name="image"
            control={control}
            rules={{ required: 'Image is required' }}
            render={({ field }) => (
              <FileInput
                onChange={(files) => {
                  const file = files[0] || null;
                  field.onChange(file);
                  if (file) {
                    trigger('image');
                  }
                }}
                accept="image/*"
                multiple={false}
              >
                {(open) => (
                  <div className={clsx('relative', !!errors.image && 'border border-error rounded-md')}>
                    {field.value ? (
                      <img src={URL.createObjectURL(field.value)} alt="Preview" className="size-16 rounded-md object-cover" />
                    ) : (
                      <div className="size-16 rounded-md bg-primary/8" />
                    )}
                    <Button
                      icon="icon-upload-sharp"
                      size="xs"
                      variant="secondary"
                      className="rounded-full absolute right-0 bottom-0"
                      onClick={open}
                      disabled={imageUploadLoading}
                    />
                  </div>
                )}
              </FileInput>
            )}
          />

          <div className="flex-1">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <LabeledInput label="Name">
                  <Input
                    {...field}
                    variant="outlined"
                    error={!!errors.name}
                  />
                </LabeledInput>
              )}
            />
          </div>
        </div>

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <LabeledInput label="Description">
              <Textarea
                {...field}
                placeholder="Briefly describe this collectible."
                variant="outlined"
                rows={3}
                error={!!errors.description}
              />
            </LabeledInput>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          variant="secondary"
        >
          Next
        </Button>
      </form>
    </ModalContent>
  );
}
