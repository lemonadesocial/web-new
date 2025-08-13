import { useForm, Controller } from 'react-hook-form';

import { ModalContent, Button, Input, Segment, DropdownTags, modal } from '$lib/components/core';
import { PoapDrop, UpdatePoapDropDocument, PoapClaimMode } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { toast } from '$lib/components/core';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import type { Option } from '$lib/components/core/input/dropdown';

interface EditCollectibleModalProps {
  poapDrop: PoapDrop;
  event: Event;
}

interface FormData {
  totalQuantity: number;
  selectedTicketTypes: Option[];
  claimableOn: 'registration' | 'check_in';
}

export function EditCollectibleModal({ poapDrop, event }: EditCollectibleModalProps) {
  const [updatePoapDrop, { loading: loadingUpdatePoapDrop }] = useMutation(UpdatePoapDropDocument, {
    onError(error) {
      toast.error(error.message);
    },
    onComplete(client, response) {
      client.writeFragment({ id: `PoapDrop:${poapDrop._id}`, data: response.updatePoapDrop });
      toast.success('Collectible updated successfully');
      modal.close();
    }
  });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      totalQuantity: poapDrop.amount,
      selectedTicketTypes: poapDrop.ticket_types?.map(id => ({
        key: id,
        value: event.event_ticket_types?.find(type => type._id === id)?.title || ''
      })) || [],
      claimableOn: poapDrop.claim_mode === 'registration' ? 'registration' : 'check_in'
    }
  });

  const ticketTypeOptions: Option[] = event.event_ticket_types?.map(type => ({
    key: type._id,
    value: type.title,
  })) || [];

  const handleTicketTypesChange = (options: Option[]) => {
    setValue('selectedTicketTypes', options);
  };

  const onSubmit = async (data: FormData) => {
    updatePoapDrop({
      variables: {
        drop: poapDrop._id,
        input: {
          amount: data.totalQuantity,
          ticket_types: data.selectedTicketTypes.map(option => option.key), 
          claim_mode: data.claimableOn === 'registration' ? PoapClaimMode.Registration : PoapClaimMode.CheckIn
        }
      }
    });
  };

  return (
    <ModalContent
      onClose={() => modal.close()}
      title="Claim Settings"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={generateUrl(poapDrop.image_expanded, 'PROFILE')} 
            alt="Preview" 
            className="size-[34px] rounded-sm object-cover" 
          />
          <p className="text-sm">{poapDrop.name}</p>
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
 
        <Controller
          name="selectedTicketTypes"
          control={control}
          render={({ field }) => (
            <DropdownTags
              label="Eligible Ticket Types"
              options={ticketTypeOptions}
              value={field.value}
              onSelect={handleTicketTypesChange}
            />
          )}
        />

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Claimable On</p>
          <Controller
            name="claimableOn"
            control={control}
            render={({ field }) => (
              <Segment
                selected={field.value}
                onSelect={(item) => field.onChange(item.value as 'registration' | 'check_in')}
                className="w-full"
                items={[
                  { label: 'Registration', value: 'registration' },
                  { label: 'Check In', value: 'check_in' }
                ]}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          variant="secondary"
          loading={loadingUpdatePoapDrop}
        >
          Save Changes
        </Button>
      </form>
    </ModalContent>
  );
}
