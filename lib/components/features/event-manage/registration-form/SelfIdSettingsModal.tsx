import { useState } from 'react';
import { countries } from '@selfxyz/qrcode'

import { Button, Input, ModalContent, Toggle, modal, toast } from '$lib/components/core';
import { DropdownTags } from '$lib/components/core/input/dropdown';
import { UpdateEventSelfVerificationDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';

type SelfIdRequirement = 'Required';

interface SelfIdSettingsModalProps {
  requirement: SelfIdRequirement;
  eventId: string;
  onComplete: () => void;
}

export function SelfIdSettingsModal({ requirement, eventId, onComplete }: SelfIdSettingsModalProps) {
  const updateEvent = useUpdateEvent();
  const [allowedCountries, setAllowedCountries] = useState<{ key: string | number; value: string }[]>([]);
  const [minimumAge, setMinimumAge] = useState<'none' | '18' | '21' | '25' | 'custom'>('none');
  const [customAge, setCustomAge] = useState<number>(18);

  const [updateEventSelfVerification, { loading }] = useMutation(UpdateEventSelfVerificationDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
        toast.success('Self ID verification settings updated');
        onComplete();
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Self ID verification');
    },
  });

  const countryOptions = Object.entries(countries).map(([key, value]) => ({
    key: value,
    value: key.replace(/_/g, ' ').replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  }));

  const ageOptions = [
    { value: 'none', label: 'None' },
    { value: '18', label: '18' },
    { value: '21', label: '21' },
    { value: '25', label: '25' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleUpdate = () => {
    const excludedCountries = allowedCountries.length > 0 
      ? Object.values(countries)
          .filter(countryCode => !allowedCountries.some(ac => ac.key === countryCode))
      : undefined;


    const age = minimumAge === 'custom' ? customAge : minimumAge === 'none' ? undefined : parseInt(minimumAge);

    updateEventSelfVerification({
      variables: {
        id: eventId,
        self_verification: {
          enabled: true,
          config: {
            excludedCountries,
            minimumAge: age,
          },
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-self" className="min-w-[480px]">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Self ID Settings</p>
          <p className="text-secondary">
            Set eligibility requirements for your guests. Attendees will verify their details privately through the Self app before registering.
          </p>
        </div>
        <DropdownTags
          label="Allowed Countries"
          value={allowedCountries}
          onSelect={setAllowedCountries}
          options={countryOptions}
          placeholder="Select one or more"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Minimum Age</label>
          <div className="flex gap-2">
            {ageOptions.map((option) => (
              <Button
                key={option.value}
                variant={minimumAge === option.value ? 'secondary' : 'tertiary'}
                className="flex-1"
                onClick={() => setMinimumAge(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {minimumAge === 'custom' && (
            <Input
              type="number"
              placeholder="Enter minimum age"
              value={customAge}
              onChange={(e) => setCustomAge(parseInt(e.target.value) || 18)}
              min={18}
              max={100}
            />
          )}
        </div>

        <div className="text-sm text-secondary">
          <p>Please note: enabling these settings automatically makes Self ID verification required.</p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleUpdate}
          loading={loading}
        >
          Update
        </Button>
      </div>
    </ModalContent>
  );
}
