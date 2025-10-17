'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Textarea, FileInput, Toggle, Input, Segment, NumberInput } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import clsx from 'clsx';

type SplitFeeRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
};

type FormData = {
  image: File | null;
  ticker: string;
  coinName: string;
  description: string;
  tags: string[];
  sniperProtection: boolean;
  splitFeeRecipients: SplitFeeRecipient[];
};

export function CreateFreeCoin() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      image: null,
      ticker: '',
      coinName: '',
      description: '',
      tags: [],
      sniperProtection: false,
      splitFeeRecipients: [],
    }
  });

  const [currentAddress, setCurrentAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'community'>('users');

  const watchedImage = watch('image');

  const handleAddTag = () => {
    // TODO: Implement tag addition logic
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue('image', file);
      console.log('Uploaded file:', file);
    }
  };

  const handleAddAddress = () => {
    const currentRecipients = watch('splitFeeRecipients');
    
    if (currentRecipients.length === 0) {
      // First click - create TWO recipients: one with address + one empty
      const firstRecipient: SplitFeeRecipient = {
        address: currentAddress.trim(),
        percentage: 0,
        locked: false,
      };
      const secondRecipient: SplitFeeRecipient = {
        address: '',
        percentage: 0,
        locked: false,
      };
      setValue('splitFeeRecipients', [firstRecipient, secondRecipient]);
      setCurrentAddress('');
    } else {
      // Additional clicks - just add one empty recipient
      const newRecipient: SplitFeeRecipient = {
        address: '',
        percentage: 0,
        locked: false,
      };
      setValue('splitFeeRecipients', [...currentRecipients, newRecipient]);
    }
  };

  const handleUpdateAddress = (index: number, address: string) => {
    const currentRecipients = watch('splitFeeRecipients');
    const newRecipients = [...currentRecipients];
    newRecipients[index] = { ...newRecipients[index], address };
    setValue('splitFeeRecipients', newRecipients);
  };

  const handleUpdatePercentage = (index: number, percentage: number | undefined) => {
    if (percentage !== undefined) {
      const currentRecipients = watch('splitFeeRecipients');
      const newRecipients = [...currentRecipients];
      newRecipients[index] = { ...newRecipients[index], percentage };
      setValue('splitFeeRecipients', newRecipients);
    }
  };

  const handleToggleLock = (index: number) => {
    const currentRecipients = watch('splitFeeRecipients');
    const newRecipients = [...currentRecipients];
    newRecipients[index] = { ...newRecipients[index], locked: !newRecipients[index].locked };
    setValue('splitFeeRecipients', newRecipients);
  };

  const handleRemoveRecipient = (index: number) => {
    const currentRecipients = watch('splitFeeRecipients');
    const newRecipients = currentRecipients.filter((_, i) => i !== index);
    setValue('splitFeeRecipients', newRecipients);
  };

  const handleSplitEvenly = () => {
    const currentRecipients = watch('splitFeeRecipients');
    const unlockedRecipients = currentRecipients.filter(recipient => !recipient.locked);
    const lockedTotal = currentRecipients
      .filter(recipient => recipient.locked)
      .reduce((sum, recipient) => sum + recipient.percentage, 0);

    if (unlockedRecipients.length > 0) {
      const remainingPercentage = 100 - lockedTotal;
      const evenSplit = remainingPercentage / unlockedRecipients.length;

      const newRecipients = currentRecipients.map(recipient => {
        if (!recipient.locked) {
          return { ...recipient, percentage: Math.round(evenSplit * 100) / 100 };
        }
        return recipient;
      });

      setValue('splitFeeRecipients', newRecipients);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // TODO: Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="p-4 rounded-md border border-card-border bg-card flex flex-col gap-4">
        <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card">
          <div className="flex size-9.5 items-center justify-center rounded-sm bg-primary/8 border border-card-border overflow-hidden">
            {watchedImage ? (
              <img
                src={URL.createObjectURL(watchedImage)}
                alt="Coin preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <i className="icon-image text-tertiary size-5.5" />
            )}
          </div>
          <div className="flex-1">
            <p>Add Image</p>
            <p className="text-tertiary text-sm">Choose an image below 5MB.</p>
          </div>
          <FileInput
            onChange={handleImageUpload}
            accept="image/*"
            multiple={false}
          >
            {(open) => (
              <Button
                variant="tertiary"
                size="sm"
                iconLeft="icon-upload-sharp"
                onClick={open}
              >
                Upload Image
              </Button>
            )}
          </FileInput>
        </div>

        <div className="space-y-4">
          <InputField
            label="Ticker"
            value={watch('ticker')}
            onChangeText={(value) => setValue('ticker', value)}
            error={!!errors.ticker}
          />

          <InputField
            label="Coin Name"
            value={watch('coinName')}
            onChangeText={(value) => setValue('coinName', value)}
            error={!!errors.coinName}
          />

          <div>
            <label className="block text-secondary text-sm font-medium mb-2">Coin Description</label>
            <Textarea
              value={watch('description')}
              onChange={(e) => setValue('description', e.target.value)}
              placeholder="What's the token used for?"
              variant="outlined"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 py-2 px-3 rounded-md border border-card-border bg-card">
        <div className="flex size-9.5 items-center justify-center rounded-sm bg-primary/8 border border-card-border">
          <i className="icon-image text-tertiary size-5.5" />
        </div>
        <div className="flex-1">
          <p>Sniper Protection</p>
          <p className="text-tertiary text-sm">Require users to complete a CAPTCHA when buying in Fair Launch.</p>
        </div>
        <Toggle
          id="sniperProtection"
          checked={watch('sniperProtection')}
          onChange={(value) => setValue('sniperProtection', value)}
        />
      </div>

      {/* Split Fee */}
      <div className="p-4 rounded-md border border-card-border bg-card flex flex-col gap-4">
        <h3 className="text-lg">Split Fee</h3>

        <Segment
          items={[
            { label: 'Users', value: 'users', iconLeft: 'icon-user' },
            { label: 'Community', value: 'community', iconLeft: 'icon-users' },
          ]}
          selected={activeTab}
          onSelect={(item) => setActiveTab(item.value as 'users' | 'community')}
        />

        {activeTab === 'users' ? (
          <>
            {/* Initial state - single address input */}
            {watch('splitFeeRecipients').length === 0 && (
              <div className="space-y-3">
                <Input
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  placeholder="Wallet Address or ENS"
                  variant="outlined"
                />
              </div>
            )}

            {/* Recipients list - when there are recipients */}
            {watch('splitFeeRecipients').length > 0 && (
              <div className="space-y-3">
                {watch('splitFeeRecipients').map((recipient, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Input
                      value={recipient.address}
                      onChange={(e) => handleUpdateAddress(index, e.target.value)}
                      placeholder="Wallet Address or ENS"
                      variant="outlined"
                    />

                    <InputField
                      value={recipient.percentage.toString()}
                      onChangeText={(value) => {
                        const numValue = parseFloat(value) || 0;
                        handleUpdatePercentage(index, numValue);
                      }}
                      subfix="%"
                      readOnly={recipient.locked}
                      type="number"
                    />

                    <Button
                      type="button"
                      variant="tertiary"
                      icon="icon-lock"
                      onClick={() => handleToggleLock(index)}
                      className={clsx({ 'bg-warning-400! text-primary!': recipient.locked })}
                    />

                    <Button
                      type="button"
                      variant="tertiary"
                      icon="icon-delete"
                      onClick={() => handleRemoveRecipient(index)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                iconLeft="icon-plus"
                onClick={handleAddAddress}
                disabled={watch('splitFeeRecipients').length === 0 && !currentAddress.trim()}
              >
                Add Another
              </Button>

              {watch('splitFeeRecipients').length > 1 && (
                <Button
                  type="button"
                  variant="tertiary"
                  size="sm"
                  iconLeft="icon-arrow-split"
                  onClick={handleSplitEvenly}
                >
                  Split Evenly
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Community Tab - Coming Soon */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/8 border border-card-border mb-4">
              <i className="icon-users text-tertiary size-8" />
            </div>
            <h4 className="text-white text-lg font-medium mb-2">Coming Soon</h4>
            <p className="text-tertiary text-sm">Community split fee feature is under development.</p>
          </div>
        )}
      </div>
    </form>
  );
}
