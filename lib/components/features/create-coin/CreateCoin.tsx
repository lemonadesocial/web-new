'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { JsonRpcProvider } from 'ethers';
import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import clsx from 'clsx';

import { appKit } from '$lib/utils/appkit';
import { Button, Textarea, FileInput, Toggle, Input, Segment, modal, toast, Menu, MenuItem } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { Timezone } from '$lib/components/core/calendar/datetime-picker';
import { Calendar } from '$lib/components/core/calendar';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { chainsMapAtom, listChainsAtom } from '$lib/jotai';
import { TOTAL_SUPPLY, getLaunchTokenParams, SECONDS_PER_DAY, DAYS_PER_MONTH } from '$lib/services/token-launch-pad';
import { formatError } from '$lib/utils/crypto';
import type { LaunchTokenParams } from '$lib/services/token-launch-pad';
import { getUserTimezoneOption, type TimezoneOption } from '$lib/utils/timezone';

import { TokenReleaseScheduleModal } from './TokenReleaseScheduleModal';
import { CreateCoinModal } from './CreateCoinModal';
import { CoinDistributionBar } from './CoinDistributionBar';
import { AddressInput } from './AddressInput';
import { CommunitySearch, type CommunityData } from './CommunitySearch';
import { SplitBreakdown } from './SplitBreakdown';

type SplitFeeRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
};

type AllocationRecipient = {
  address: string;
  percentage: number;
  locked: boolean;
  cliff: number;
  duration: number;
  interval: 'monthly' | 'daily';
};

export type LaunchpadSocials = {
  twitter?: string;
  telegram?: string;
  discord?: string;
  warpcast?: string;
  website?: string;
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
  fairLaunchPercentage: number;
  allocationRecipients: AllocationRecipient[];
  socialTwitter: string;
  socialTelegram: string;
  socialDiscord: string;
  socialWarpcast: string;
  socialWebsite: string;
  launchDate: string | undefined;
  timezone: string;
};

function normalizeRecipientPercentages(allocationRecipients: AllocationRecipient[]) {
  const vestingPercentage = allocationRecipients.reduce((sum, recipient) => sum + recipient.percentage, 0);
  if (vestingPercentage === 0 || allocationRecipients.length === 0) return [];

  let total = 0;
  const rawPercentages = allocationRecipients.map(r => (r.percentage / vestingPercentage) * 100);
  const normalized = rawPercentages.map((p, i) =>
    i === allocationRecipients.length - 1
      ? Math.round((100 - total) * 100) / 100
      : (() => { const val = Math.round(p * 100) / 100; total += val; return val; })()
  );

  return allocationRecipients.map((recipient, i) => {
    const unitInDays = recipient.interval === 'monthly' ? DAYS_PER_MONTH : 1;
    return {
      cliff: recipient.cliff * unitInDays * SECONDS_PER_DAY,
      duration: recipient.duration * unitInDays * SECONDS_PER_DAY,
      period: unitInDays * SECONDS_PER_DAY,
      beneficiary: recipient.address,
      percentage: normalized[i],
    };
  });
}

function getLaunchAtTimestamp(launchDate: string | undefined, timezone: string | undefined): number | undefined {
  if (!launchDate || !timezone) {
    return undefined;
  }

  const date = new Date(launchDate);
  const dateTimeString = format(date, "yyyy-MM-dd'T'HH:mm:ss");
  const zonedDate = toDate(dateTimeString, { timeZone: timezone });

  return Math.floor(zonedDate.getTime() / 1000);
}

export function CreateCoin() {
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      image: null,
      ticker: '',
      coinName: '',
      description: '',
      tags: [],
      sniperProtection: false,
      splitFeeRecipients: [],
      feeReceiverShare: 80,
      startingMarketcap: 5000,
      fairLaunchPercentage: 10,
      allocationRecipients: [{ address: '', percentage: 0, locked: false, cliff: 6, duration: 12, interval: 'monthly' }],
      socialTwitter: '',
      socialTelegram: '',
      socialDiscord: '',
      socialWarpcast: '',
      socialWebsite: '',
      launchDate: undefined,
      timezone: getUserTimezoneOption()?.value || '',
    },
    mode: 'onChange'
  });

  const chainsMap = useAtomValue(chainsMapAtom);
  const listChains = useAtomValue(listChainsAtom);
  const availableChains = listChains.filter(chain => chain.launchpad_zap_contract_address);
  const [selectedChainId, setSelectedChainId] = useState<string>(availableChains[0]?.chain_id || '');
  const launchChain = chainsMap[selectedChainId];

  useEffect(() => {
    register('ticker', { required: 'Ticker is required' });
    register('coinName', { required: 'Coin name is required' });
    register('description', { required: 'Description is required' });
    register('image', { required: 'Image is required' });
  }, []);

  const [currentAddress, setCurrentAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'community'>('users');
  const [launchMode, setLaunchMode] = useState<'fast' | 'advanced'>('fast');
  const { allocationRecipients } = watch();
  const setAllocationRecipients = (recipients: AllocationRecipient[]) => setValue('allocationRecipients', recipients);
  const [isCoinDistributionExpanded, setIsCoinDistributionExpanded] = useState(false);
  const [isMarketcapExpanded, setIsMarketcapExpanded] = useState(false);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [timezoneOption, setTimezoneOption] = useState<TimezoneOption | undefined>(getUserTimezoneOption());
  const [isLoading, setisLoading] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);

  const watchedImage = watch('image');
  const watchedFeeReceiverShare = watch('feeReceiverShare');
  const watchedStartingMarketcap = watch('startingMarketcap');
  const watchedCoinDistributionPercentage = watch('fairLaunchPercentage');

  const handleCommunitySearchSuccess = (data: CommunityData) => {
    setCommunityData(data);
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue('image', file);
      trigger('image');
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
      address: '',
      percentage: 0,
      locked: false,
      cliff: 6,
      duration: 12,
      interval: 'monthly'
    };
    setAllocationRecipients([...allocationRecipients, newRecipient]);
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

  const handleRemoveAllocationRecipient = (index: number) => {
    setAllocationRecipients(allocationRecipients.filter((_, i) => i !== index));
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
            cliff: data.cliff,
            duration: data.duration,
            interval: data.interval
          };
          setAllocationRecipients(newRecipients);
        }
      }
    });
  };

  const handleTokenCreation = async (data: FormData) => {
    try {
      if (!data.image) {
        throw new Error('No image provided');
      }

      const address = appKit.getAddress();

      if (!address) {
        throw new Error('No address found');
      }

      setisLoading(true);

      const formData = new FormData();
      formData.append('file', data.image);
      formData.append('coinName', data.coinName);
      formData.append('ticker', data.ticker);
      formData.append('description', data.description);

      const response = await fetch('/api/token-metadata', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      const tokenUri = result.tokenUri;

      const vestingPercentage = allocationRecipients.reduce((sum, recipient) => sum + recipient.percentage, 0);
      const vestingRecipients = normalizeRecipientPercentages(allocationRecipients);

      const launchAt = getLaunchAtTimestamp(data.launchDate, data.timezone);

      const params: LaunchTokenParams = {
        name: data.coinName,
        symbol: data.ticker,
        tokenUri,
        initialTokenFairLaunch: (BigInt(data.fairLaunchPercentage) * TOTAL_SUPPLY) / BigInt(100),
        fairLaunchDuration: 300,
        premineAmount: BigInt(0),
        creator: address,
        creatorFeeAllocation: data.feeReceiverShare,
        usdcMarketCap: BigInt(data.startingMarketcap) * BigInt(1_000_000),
        feeSplit: data.splitFeeRecipients.map(recipient => ({
          recipient: recipient.address,
          percentage: recipient.percentage,
        })),
        vesting: vestingPercentage > 0 ? {
          amount: BigInt(vestingPercentage) * TOTAL_SUPPLY / BigInt(100),
          recipients: vestingRecipients,
        } : undefined,
        launchAt,
      };

      const rpcProvider = new JsonRpcProvider(launchChain.rpc_url);

      const txParams = await getLaunchTokenParams(
        launchChain.launchpad_zap_contract_address!,
        launchChain.launchpad_treasury_address_fee_split_manager_implementation_contract_address!,
        rpcProvider,
        params,
      );

      setisLoading(false);

      const socials: LaunchpadSocials = {
        twitter: data.socialTwitter.trim() || undefined,
        telegram: data.socialTelegram.trim() || undefined,
        discord: data.socialDiscord.trim() || undefined,
        warpcast: data.socialWarpcast.trim() || undefined,
        website: data.socialWebsite.trim() || undefined,
      };

      modal.open(CreateCoinModal, {
        props: {
          txParams,
          groupAddress: communityData?.groupAddress,
          launchChain,
          socials,
        }
      });
    } catch (error) {
      toast.error(formatError(error));
    } finally {
      setisLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: async () => {
          modal.close();
          await handleTokenCreation(data);
        },
        chain: launchChain,
      },
    });
  };

  const isAvandedMode = launchMode === 'advanced';

  return (
    <div className="max-w-[720px] mx-auto pb-10 px-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

        <div className="rounded-md border border-card-border bg-card flex flex-col gap-4">
          <div className="p-4 space-y-1.5 border-b border-b-divider flex flex-col">
            <p className="text-sm">Network</p>
            <Menu.Root>
              <Menu.Trigger>
                <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer">
                  {launchChain?.logo_url && (
                    <img src={launchChain.logo_url} alt={launchChain.name} className="size-5 rounded-full" />
                  )}
                  <p className="flex-1 text-left">{launchChain?.name || 'Select Network'}</p>
                  <i className="icon-chevron-down text-tertiary size-4" />
                </div>
              </Menu.Trigger>
              <Menu.Content className="p-1 w-full">
                {({ toggle }) => (
                  <>
                    {availableChains.map((chain) => (
                      <MenuItem
                        key={chain.chain_id}
                        onClick={() => {
                          setSelectedChainId(chain.chain_id);
                          toggle();
                        }}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          {chain.logo_url && (
                            <img src={chain.logo_url} alt={chain.name} className="size-4 rounded-full" />
                          )}
                          <p className="text-sm text-secondary flex-1">{chain.name}</p>
                          {selectedChainId === chain.chain_id && (
                            <i className="icon-check text-accent-400 size-4" />
                          )}
                        </div>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          </div>
          <div className="p-4 flex flex-col gap-4">

            <div className="space-y-1.5">
              <div className={clsx("flex items-center gap-3 py-2 px-3 rounded-sm border bg-card", errors.image ? "border-error" : "border-card-border")}>
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
              {errors.image && (
                <p className="text-error text-sm">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <InputField
                  label="Ticker"
                  value={watch('ticker')}
                  onChangeText={(value) => {
                    setValue('ticker', value);
                    trigger('ticker');
                  }}
                  error={!!errors.ticker}
                />
                {errors.ticker && (
                  <p className="text-error text-sm">{errors.ticker.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <InputField
                  label="Coin Name"
                  value={watch('coinName')}
                  onChangeText={(value) => {
                    setValue('coinName', value);
                    trigger('coinName');
                  }}
                  error={!!errors.coinName}
                />
                {errors.coinName && (
                  <p className="text-error text-sm">{errors.coinName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="block text-secondary text-sm">
                  Coin Description
                </p>
                <Textarea
                  value={watch('description')}
                  onChange={(e) => {
                    setValue('description', e.target.value);
                    trigger('description');
                  }}
                  placeholder="What's the token used for?"
                  variant="outlined"
                  rows={3}
                  className={errors.description ? 'border-error' : ''}
                />
                {errors.description && (
                  <p className="text-error text-sm">{errors.description.message}</p>
                )}
              </div>
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

              {
                communityData && <>
                  <SplitBreakdown
                    communityData={communityData}
                    feeReceiverShare={watchedFeeReceiverShare}
                  />
                  <hr className="border-t border-t-divider" />
                </>
              }
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
                    <AddressInput
                      value={currentAddress}
                      onChange={(address) => setCurrentAddress(address)}
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
                        <AddressInput
                          value={recipient.address}
                          onChange={(address) => handleUpdateAddress(index, address)}
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
            ) : <CommunitySearch onSuccess={handleCommunitySearchSuccess} />}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-md">
          <div className="flex items-center justify-between p-4">
            <p className="text-lg font-medium">Socials</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
            <div className="flex items-center gap-4">
              <i className="icon-x size-5 text-tertiary" />
              <div className="flex-1">
                <InputField
                  value={watch('socialTwitter')}
                  onChangeText={(value) => setValue('socialTwitter', value)}
                  prefix="x.com/"
                  placeholder="johndoe"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <i className="icon-telegram size-5 text-tertiary" />
              <div className="flex-1">
                <InputField
                  value={watch('socialTelegram')}
                  onChangeText={(value) => setValue('socialTelegram', value)}
                  placeholder="in/johndoe"
                  prefix="t.me/"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <i className="icon-chat size-5 text-tertiary" />
              <div className="flex-1">
                <InputField
                  value={watch('socialDiscord')}
                  onChangeText={(value) => setValue('socialDiscord', value)}
                  prefix="discord.gg/"
                  placeholder="its_johndoe"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <i className="icon-warpcast size-5 text-tertiary" />
              <div className="flex-1">
                <InputField
                  value={watch('socialWarpcast')}
                  onChangeText={(value) => setValue('socialWarpcast', value)}
                  prefix="warpcast.com/"
                  placeholder="john.builds"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <i className="icon-globe size-5 text-tertiary" />
              <div className="flex-1">
                <InputField
                  value={watch('socialWebsite')}
                  onChangeText={(value) => setValue('socialWebsite', value)}
                  placeholder="johndoe.xyz"
                />
              </div>
            </div>
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
                <div className={clsx('p-2 rounded-full bg-primary/8 flex items-center justify-center transition-transform', isMarketcapExpanded && 'rotate-180')}>
                  <i className="icon-chevron-down size-4 text-tertiary" />
                </div>
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
                onClick={() => setIsCoinDistributionExpanded(!isCoinDistributionExpanded)}
              >
                <p className="text-lg font-medium">
                  Core Distribution
                </p>
                <div className={clsx('p-2 rounded-full bg-primary/8 flex items-center justify-center transition-transform', isCoinDistributionExpanded && 'rotate-180')}>
                  <i className="icon-chevron-down size-4 text-tertiary" />
                </div>
              </div>

              {isCoinDistributionExpanded && <>
                <CoinDistributionBar
                  fairLaunchPercentage={watchedCoinDistributionPercentage}
                  initialAllocationPercentage={allocationRecipients.reduce((sum, recipient) => sum + recipient.percentage, 0)}
                />
                <div>
                  {/* Fair Launch Section */}
                  <div className="space-y-4 p-4 border-t border-t-divider">
                    <p className="text-lg">Fair Launch</p>
                    <InputField
                      value={watchedCoinDistributionPercentage.toString()}
                      onChangeText={(value) => {
                        const numValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
                        setValue('fairLaunchPercentage', numValue);
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
                          value={watchedCoinDistributionPercentage}
                          onChange={(e) => setValue('fairLaunchPercentage', parseInt(e.target.value))}
                          className="w-full h-2 bg-quaternary rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${watchedCoinDistributionPercentage}%, rgba(255, 255, 255, 0.24)${watchedCoinDistributionPercentage}%, rgba(255, 255, 255, 0.24) 100%)`
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

                  {/* Initial Allocation Section */}
                  <div className="space-y-4 p-4 border-t border-t-divider">
                    <p className="text-lg">Initial Allocation</p>

                    <div className="space-y-4">
                      {allocationRecipients.map((recipient, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-2 flex-col md:flex-row">
                            <Input
                              value={recipient.address}
                              onChange={(e) => handleUpdateAllocationAddress(index, e.target.value)}
                              placeholder="Wallet Address"
                              variant="outlined"
                              className="flex-1 min-h-10"
                            />
                            <div className="flex gap-2">
                              <InputField
                                value={recipient.percentage.toString()}
                                onChangeText={(value) => {
                                  const numValue = parseFloat(value) || 0;
                                  handleUpdateAllocationPercentage(index, numValue);
                                }}
                                subfix="%"
                                type="number"
                              />
                              <Button
                                type="button"
                                variant="tertiary"
                                icon="icon-tune"
                                onClick={() => handleOpenTokenReleaseModal(index)}
                              />
                              {allocationRecipients.length > 1 && (
                                <Button
                                  type="button"
                                  variant="tertiary"
                                  icon="icon-delete"
                                  onClick={() => handleRemoveAllocationRecipient(index)}
                                />
                              )}
                            </div>
                          </div>
                          {recipient.address && (
                            <p className="text-tertiary text-sm">
                              {recipient.cliff}m cliff · {recipient.duration}m vesting ({recipient.interval})
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      iconLeft="icon-plus"
                      onClick={handleAddAllocationRecipient}
                    >
                      Add Another
                    </Button>

                    <p className="text-tertiary text-sm">
                      {(() => {
                        const initialAllocationTotal = allocationRecipients.reduce((sum, recipient) => sum + recipient.percentage, 0);
                        const liquidityPoolPercentage = 100 - watchedCoinDistributionPercentage - initialAllocationTotal;
                        return `Remaining ${liquidityPoolPercentage.toFixed(1)}% will be allocated to the liquidity pool.`;
                      })()}
                    </p>
                  </div>
                </div>
              </>}
            </div>

            <div className="bg-card border border-card-border rounded-md">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              >
                <p className="text-lg font-medium">Schedule</p>
                <div className={clsx('p-2 rounded-full bg-primary/8 flex items-center justify-center transition-transform', isScheduleExpanded && 'rotate-180')}>
                  <i className="icon-chevron-down size-4 text-tertiary" />
                </div>
              </div>

              {isScheduleExpanded && (
                <div className="space-y-4 p-4 pt-0">
                  <p className="text-secondary text-sm">Select Date & Time</p>

                  <div className="flex flex-col md:flex-row gap-3">
                    <Menu.Root placement="top-start" className="flex-1">
                      <Menu.Trigger>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer hover:bg-primary/8 transition-colors">
                          <i className="icon-calendar size-5 text-tertiary" />
                          <span className="text-primary flex-1 text-left">
                            {watch('launchDate') ? format(new Date(watch('launchDate')!), 'EEE, dd MMM') : 'Select date'}
                          </span>
                          <i className="icon-chevron-down size-4 text-tertiary" />
                        </div>
                      </Menu.Trigger>
                      <Menu.Content className="w-[296px] p-0 rounded-lg">
                        {({ toggle }) => {
                          const launchDate = watch('launchDate');
                          return (
                            <Calendar
                              minDate={new Date()}
                              selected={launchDate ? new Date(launchDate) : undefined}
                              onSelectDate={(date = new Date()) => {
                                const datetime = launchDate ? new Date(launchDate) : new Date();
                                datetime.setFullYear(date.getFullYear());
                                datetime.setMonth(date.getMonth());
                                datetime.setDate(date.getDate());
                                setValue('launchDate', datetime.toISOString());
                                toggle();
                              }}
                            />
                          );
                        }}
                      </Menu.Content>
                    </Menu.Root>

                    <Menu.Root placement="top-start" className="flex-1">
                      <Menu.Trigger>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer hover:bg-primary/8 transition-colors">
                          <i className="icon-clock size-5 text-tertiary" />
                          <span className="text-primary flex-1 text-left">
                            {watch('launchDate') ? format(new Date(watch('launchDate')!), 'hh:mm a') : 'Select time'}
                          </span>
                          <i className="icon-chevron-down size-4 text-tertiary" />
                        </div>
                      </Menu.Trigger>
                      <Menu.Content className="w-[100px] no-scrollbar rounded-lg overflow-auto h-[200px] p-2">
                        {({ toggle }) => {
                          const launchDate = watch('launchDate');
                          const times = Array.from({ length: 24 }, (_, hour) => {
                            return [0, 30].map((minute) => {
                              const period = hour < 12 ? 'AM' : 'PM';
                              const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
                              const formattedMinutes = minute.toString().padStart(2, '0');
                              return {
                                value: `${hour.toString().padStart(2, '0')}:${formattedMinutes}`,
                                label: `${formattedHour}:${formattedMinutes} ${period}`,
                              };
                            });
                          }).flat();

                          return (
                            <div>
                              {times.map((t, i) => (
                                <Button
                                  key={i}
                                  variant="flat"
                                  className="hover:bg-quaternary! w-full whitespace-nowrap"
                                  onClick={() => {
                                    const [hours, minutes] = t.value.split(':').map(Number);
                                    const datetime = launchDate ? new Date(launchDate) : new Date();
                                    datetime.setHours(hours);
                                    datetime.setMinutes(minutes);
                                    setValue('launchDate', datetime.toISOString());
                                    toggle();
                                  }}
                                >
                                  {t.label}
                                </Button>
                              ))}
                            </div>
                          );
                        }}
                      </Menu.Content>
                    </Menu.Root>

                    <Timezone
                      placement="top-start"
                      className="flex-1"
                      value={timezoneOption}
                      onSelect={(zone) => {
                        setTimezoneOption(zone);
                        setValue('timezone', zone.value);
                      }}
                      trigger={() => (
                        <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer hover:bg-primary/8 transition-colors">
                          <i className="icon-globe size-5 text-tertiary" />
                          <span className="text-primary flex-1 text-left">
                            {timezoneOption?.short || timezoneOption?.value || 'Select timezone'}
                          </span>
                          <i className="icon-chevron-down size-4 text-tertiary" />
                        </div>
                      )}
                    />
                  </div>

                  <p className="text-tertiary text-xs">
                    The starting market cap is fixed in ETH, but its USD value will fluctuate based on ETH&apos;s price at launch.
                  </p>
                </div>
              )}
            </div>
          </>
        }

        <Button
          type="submit"
          variant="secondary"
          loading={isLoading}
        >
          Create Coin
        </Button>
      </form>
    </div>
  );
}
