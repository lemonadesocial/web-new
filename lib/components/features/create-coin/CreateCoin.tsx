'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Textarea, FileInput, Toggle, Input, Segment, NumberInput, modal } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { TokenReleaseScheduleModal } from './TokenReleaseScheduleModal';
import clsx from 'clsx';

type SplitFeeRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
};

type AllocationRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
  lockedSupply: number; // Percentage of allocation that is locked
  cliff: number; // months
  duration: number; // months
  interval: 'monthly' | 'daily';
};

type FormData = {
  image: File | null;
  ticker: string;
  coinName: string;
  description: string;
  tags: string[];
  sniperProtection: boolean;
  splitFeeRecipients: SplitFeeRecipient[];
  feeReceiverShare: number;
  startingMarketcap: number;
};

export function CreateCoin() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      image: null,
      ticker: '',
      coinName: '',
      description: '',
      tags: [],
      sniperProtection: false,
      splitFeeRecipients: [],
      feeReceiverShare: 80,
      startingMarketcap: 50000,
    }
  });

  const [currentAddress, setCurrentAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'community'>('users');
  const [launchMode, setLaunchMode] = useState<'fast' | 'advanced'>('fast');
  const [fairLaunchPercentage, setFairLaunchPercentage] = useState(10);
  const [allocationRecipients, setAllocationRecipients] = useState<AllocationRecipient[]>([]);
  const [currentAllocationAddress, setCurrentAllocationAddress] = useState('');
  const [isFairLaunchExpanded, setIsFairLaunchExpanded] = useState(false);
  const [isMarketcapExpanded, setIsMarketcapExpanded] = useState(false);

  const watchedImage = watch('image');
  const watchedFeeReceiverShare = watch('feeReceiverShare');
  const watchedStartingMarketcap = watch('startingMarketcap');

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

  const handleAddAllocationRecipient = () => {
    const newRecipient: AllocationRecipient = {
      address: currentAllocationAddress.trim(),
      percentage: 0,
      locked: false,
      lockedSupply: 50, // Default 50% of allocation is locked
      cliff: 6,
      duration: 12,
      interval: 'monthly'
    };
    setAllocationRecipients([...allocationRecipients, newRecipient]);
    setCurrentAllocationAddress('');
  };

  const handleUpdateAllocationAddress = (index: number, address: string) => {
    const newRecipients = [...allocationRecipients];
    newRecipients[index] = { ...newRecipients[index], address };
    setAllocationRecipients(newRecipients);
  };

  const handleUpdateAllocationPercentage = (index: number, percentage: number) => {
    const newRecipients = [...allocationRecipients];
    newRecipients[index] = { ...newRecipients[index], percentage };
    setAllocationRecipients(newRecipients);
  };

  const handleToggleAllocationLock = (index: number) => {
    const newRecipients = [...allocationRecipients];
    newRecipients[index] = { ...newRecipients[index], locked: !newRecipients[index].locked };
    setAllocationRecipients(newRecipients);
  };

  const handleRemoveAllocationRecipient = (index: number) => {
    setAllocationRecipients(allocationRecipients.filter((_, i) => i !== index));
  };

  const handleSplitAllocationEvenly = () => {
    const unlockedRecipients = allocationRecipients.filter(recipient => !recipient.locked);
    const lockedTotal = allocationRecipients
      .filter(recipient => recipient.locked)
      .reduce((sum, recipient) => sum + recipient.percentage, 0);

    if (unlockedRecipients.length > 0) {
      const remainingPercentage = 100 - lockedTotal;
      const evenSplit = remainingPercentage / unlockedRecipients.length;

      const newRecipients = allocationRecipients.map(recipient => {
        if (!recipient.locked) {
          return { ...recipient, percentage: Math.round(evenSplit * 100) / 100 };
        }
        return recipient;
      });

      setAllocationRecipients(newRecipients);
    }
  };

  const handleOpenTokenReleaseModal = (index: number) => {
    const recipient = allocationRecipients[index];
    modal.open(TokenReleaseScheduleModal, {
      props: {
        recipient,
        onConfirm: (data) => {
          const newRecipients = [...allocationRecipients];
          newRecipients[index] = {
            ...newRecipients[index],
            lockedSupply: data.lockedSupply,
            cliff: data.cliff,
            duration: data.duration,
            interval: data.interval
          };
          setAllocationRecipients(newRecipients);
        }
      }
    });
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // TODO: Handle form submission
  };

  const isAvandedMode = launchMode === 'advanced';

  return (
    <div className="max-w-[720px] mx-auto pb-10">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          aspect-ratio: 1/1;
          border-radius: 9999px;
          background: #FFF;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          aspect-ratio: 1/1;
          border-radius: 9999px;
          background: #FFF;
          cursor: pointer;
          border: none;
        }
      `}</style>
      <h1 className="text-3xl font-semibold pt-6 pb-8">Create Coin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-2 pr-3 bg-card border border-card-border rounded-md gap-3 flex items-center cursor-pointer"
            onClick={() => setLaunchMode('fast')}
          >
            <div className={clsx('flex size-9.5 items-center justify-center rounded-sm', launchMode === 'fast' ? 'bg-accent-400/16' : 'bg-primary/8')}>
              <i className={clsx('icon-flash size-5.5', launchMode === 'fast' ? 'text-accent-400' : 'text-secondary')} />
            </div>
            <div className="flex-1">
              <p>Fast</p>
              <p className="text-tertiary text-xs">Launch a token in seconds.</p>
            </div>
            {
              launchMode === 'fast' && <i className="icon-check text-accent-400 size-5.5" />
            }
          </div>

          <div
            className="p-2 pr-3 bg-card border border-card-border rounded-md gap-3 flex items-center cursor-pointer"
            onClick={() => setLaunchMode('advanced')}
          >
            <div className={clsx('flex size-9.5 items-center justify-center rounded-sm', launchMode === 'advanced' ? 'bg-accent-400/16' : 'bg-primary/8')}>
              <i className={clsx('icon-settings size-5.5', launchMode === 'advanced' ? 'text-accent-400' : 'text-secondary')} />
            </div>
            <div className="flex-1">
              <p>Advanced</p>
              <p className="text-tertiary text-xs">Make the most of your launch.</p>
            </div>
            {
              launchMode === 'advanced' && <i className="icon-check text-accent-400 size-5.5" />
            }
          </div>
        </div>

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

        <div className="border border-card-border bg-card rounded-md">
          {
            isAvandedMode && <>
              <div className="p-4 flex flex-col">
                <p className="text-lg">Trading Fees</p>
                <p className="mt-4 text-secondary text-sm">Choose your share of the coin's trading fees</p>
                <div className="flex-1">
                  <div className="relative mt-2 mb-1.5">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={watchedFeeReceiverShare}
                      onChange={(e) => setValue('feeReceiverShare', parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #9b87f5 0%, #9b87f5 ${watchedFeeReceiverShare}%, #f6d032 ${watchedFeeReceiverShare}%, #f6d032 100%)`
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block size-2 rounded-full bg-accent-400" />
                      <span className="text-accent-400 text-sm">Fee Receiver {watchedFeeReceiverShare}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block size-2 rounded-full bg-warning-300" />
                      <span className="text-warning-300 text-sm">Auto Buybacks {100 - watchedFeeReceiverShare}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-t border-t-divider" />
            </>
          }

          <div className="p-4 flex flex-col gap-4">
            <p className="text-lg">Split Fee</p>

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
        </div>

        {
          isAvandedMode && <>
            <div className="bg-card border border-card-border rounded-md">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsMarketcapExpanded(!isMarketcapExpanded)}
              >
                <p className="text-lg font-medium">Starting Marketcap</p>
                <i className={clsx('icon-chevron-down size-5.5 transition-transform', isMarketcapExpanded && 'rotate-180')} />
              </div>

              {isMarketcapExpanded && (
                <div className="space-y-4 p-4 pt-0">
                  <InputField
                    value={watchedStartingMarketcap.toLocaleString()}
                    onChangeText={(value) => {
                      const numValue = parseInt(value.replace(/,/g, '')) || 5000;
                      const clampedValue = Math.max(5000, Math.min(100000, numValue));
                      setValue('startingMarketcap', clampedValue);
                    }}
                    type="text"
                    label="Set Marketcap"
                  />

                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="range"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={watchedStartingMarketcap}
                        onChange={(e) => setValue('startingMarketcap', parseInt(e.target.value))}
                        className="w-full h-2 bg-quaternary rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((watchedStartingMarketcap - 5000) / (100000 - 5000)) * 100}%, rgba(255, 255, 255, 0.24) ${((watchedStartingMarketcap - 5000) / (100000 - 5000)) * 100}%, rgba(255, 255, 255, 0.24) 100%)`
                        }}
                      />
                      <div className="flex justify-between mt-1.5">
                        <p className="text-secondary text-sm">$5,000</p>
                        <p className="text-secondary text-sm">$100,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border border-card-border rounded-md">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsFairLaunchExpanded(!isFairLaunchExpanded)}
              >
                <p className="text-lg font-medium">
                  {
                    isFairLaunchExpanded ? 'Fair Launch' : 'Fair Launch & Initial Allocation'
                  }
                </p>
                <i className={clsx('icon-chevron-down size-5.5 transition-transform', isFairLaunchExpanded && 'rotate-180')} />
              </div>

              {isFairLaunchExpanded && (
                <div>
                  {/* Fair Launch Section */}
                  <div className="space-y-4 p-4 pt-0">
                    <InputField
                      value={fairLaunchPercentage.toString()}
                      onChangeText={(value) => {
                        const numValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
                        setFairLaunchPercentage(numValue);
                      }}
                      subfix="%"
                      type="number"
                      label="Fair Launch Supply"
                    />

                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={fairLaunchPercentage}
                          onChange={(e) => setFairLaunchPercentage(parseInt(e.target.value))}
                          className="w-full h-2 bg-quaternary rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${fairLaunchPercentage}%, rgba(255, 255, 255, 0.24)${fairLaunchPercentage}%, rgba(255, 255, 255, 0.24) 100%)`
                          }}
                        />
                        <div className="flex justify-between mt-3">
                          <p className="text-tertiary text-sm">0%</p>
                          <p className="text-tertiary text-sm">100%</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-tertiary text-sm">Portion of tokens released publicly at launch. Unsold tokens are burned.</p>
                  </div>

                  <hr className="border-t border-t-divider" />
                  {/* Initial Allocation Section */}
                  <div className="space-y-4 p-4">
                    <p className="text-lg">Initial Allocation</p>

                    {/* Initial state - single address input */}
                    {allocationRecipients.length === 0 && (
                      <div className="space-y-3">
                        <Input
                          value={currentAllocationAddress}
                          onChange={(e) => setCurrentAllocationAddress(e.target.value)}
                          placeholder="Wallet Address or ENS"
                          variant="outlined"
                        />
                      </div>
                    )}

                    {/* Recipients list - when there are recipients */}
                    {allocationRecipients.length > 0 && (
                      <div className="space-y-4">
                        {allocationRecipients.map((recipient, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={recipient.address}
                                onChange={(e) => handleUpdateAllocationAddress(index, e.target.value)}
                                placeholder="Wallet Address or ENS"
                                variant="outlined"
                                className="flex-1"
                              />
                              <InputField
                                value={recipient.percentage.toString()}
                                onChangeText={(value) => {
                                  const numValue = parseFloat(value) || 0;
                                  handleUpdateAllocationPercentage(index, numValue);
                                }}
                                subfix="%"
                                readOnly={recipient.locked}
                                type="number"
                              />
                              <Button
                                type="button"
                                variant="tertiary"
                                icon="icon-lock"
                                onClick={() => handleToggleAllocationLock(index)}
                                className={clsx(recipient.locked && 'bg-warning-400 text-primary')}
                              />
                               <Button
                                 type="button"
                                 variant="tertiary"
                                 icon="icon-tune"
                                 onClick={() => handleOpenTokenReleaseModal(index)}
                               />
                              <Button
                                type="button"
                                variant="tertiary"
                                icon="icon-delete"
                                onClick={() => handleRemoveAllocationRecipient(index)}
                              />
                            </div>
                             <p className="text-tertiary text-sm">
                               {recipient.lockedSupply}% locked · {recipient.cliff}m cliff · {recipient.duration}m vesting ({recipient.interval})
                             </p>
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
                        onClick={handleAddAllocationRecipient}
                        disabled={allocationRecipients.length === 0 && !currentAllocationAddress.trim()}
                      >
                        Add Another
                      </Button>

                      {allocationRecipients.length > 1 && (
                        <Button
                          type="button"
                          variant="tertiary"
                          size="sm"
                          iconLeft="icon-arrow-split"
                          onClick={handleSplitAllocationEvenly}
                        >
                          Split Evenly
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
           </>
         }
       </form>
     </div>
   );
 }
