import React, { useState } from 'react';
import { countries } from '@selfxyz/qrcode';

import { Button, Input, ModalContent, modal, toast } from '$lib/components/core';
import { DropdownTags, Option } from '$lib/components/core/input/dropdown';
import { Event, UpdateEventSelfVerificationDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';
import { Controller, useForm } from 'react-hook-form';
import { match } from 'ts-pattern';

interface SelfIdSettingsModalProps {
  event: Event;
  onComplete?: () => void;
}

type MinimumAge = 'none' | '18' | '21' | '25' | 'custom';
type FormSelfIdData = {
  allowedCountries: Option[];
  minimumAge: MinimumAge;
  age: number;
};

const countryOptions = Object.entries(countries).map(([key, value]) => ({
  key: value,
  value: key.replace(/_/g, ' ').replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
}));

const ageOptions = [
  { value: 'none', label: 'None' },
  { value: '18', label: '18' },
  { value: '21', label: '21' },
  { value: '25', label: '25' },
  { value: 'custom', label: 'Custom' },
];

export function SelfIdSettingsModal({ event, onComplete }: SelfIdSettingsModalProps) {
  const updateEvent = useUpdateEvent();

  const { control, setValue, watch, handleSubmit } = useForm<FormSelfIdData>({
    defaultValues: {
      allowedCountries: [],
      minimumAge: 'none',
      age: 18,
    },
  });

  const minimumAge = watch('minimumAge');

  const selfConfig = event.self_verification?.config;

  const loadAllowContries = () => {
    const excludedSet = new Set(selfConfig?.excludedCountries ?? []);
    const allowedCountries = Object.entries(countries)
      .filter(([_, countryName]) => (excludedSet.size > 0 ? !excludedSet.has(countryName) : false))
      .map(([countryCode, countryName]) => ({
        key: countryName,
        value: countryCode
          .replace(/_/g, ' ')
          .replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
      })) as never[];
    setValue('allowedCountries', allowedCountries);
  };

  const loadMinimumAge = () => {
    let minimumAge = 'none';
    if (selfConfig?.minimumAge) {
      if (['18', '21', '25'].includes(selfConfig.minimumAge.toString())) {
        minimumAge = selfConfig.minimumAge.toString() as MinimumAge;
      } else {
        minimumAge = 'custom';
        setValue('age', selfConfig.minimumAge);
      }
    }
    setValue('minimumAge', minimumAge as MinimumAge);
  };

  const [updateEventSelfVerification, { loading }] = useMutation(UpdateEventSelfVerificationDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
        toast.success('Self ID verification settings updated');
        onComplete?.();
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update Self ID verification');
    },
  });

  React.useEffect(() => {
    loadAllowContries();
    loadMinimumAge();
  }, []);

  const handleUpdate = (values: FormSelfIdData) => {
    let excludedCountries = undefined;

    if (values.allowedCountries.length > 0) {
      excludedCountries = Object.values(countries).filter(
        (countryCode) => !values.allowedCountries.some((ac) => ac.key === countryCode),
      );
    }

    const age = match(minimumAge)
      .with('none', () => undefined)
      .with('custom', () => values.age)
      .otherwise(() => parseInt(minimumAge));

    updateEventSelfVerification({
      variables: {
        id: event._id,
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
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleUpdate)}>
        <div className="space-y-2">
          <p className="text-lg">Self ID Settings</p>
          <p className="text-secondary">
            Set eligibility requirements for your guests. Attendees will verify their details privately through the Self
            app before registering.
          </p>
        </div>
        <Controller
          name="allowedCountries"
          control={control}
          render={({ field }) => {
            return (
              <DropdownTags
                label="Allowed Countries"
                value={field.value}
                onSelect={(options) => {
                  setValue('allowedCountries', options);
                }}
                options={countryOptions}
                placeholder="Select one or more"
              />
            );
          }}
        />

        <Controller
          control={control}
          name="age"
          render={({ field }) => {
            return (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Minimum Age</label>
                <div className="flex gap-2">
                  {ageOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={minimumAge === option.value ? 'secondary' : 'tertiary'}
                      className="flex-1"
                      onClick={() => setValue('minimumAge', option.value as any)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {minimumAge === 'custom' && (
                  <Input
                    type="number"
                    placeholder="Enter minimum age"
                    value={field.value}
                    onChange={(e) => setValue('age', parseInt(e.target.value) || 18)}
                    min={18}
                    max={100}
                  />
                )}
              </div>
            );
          }}
        />

        <div className="text-sm text-secondary">
          <p>Please note: enabling these settings automatically makes Self ID verification required.</p>
        </div>

        <Button variant="secondary" className="w-full" type="submit" loading={loading}>
          Update
        </Button>
      </form>
    </ModalContent>
  );
}
