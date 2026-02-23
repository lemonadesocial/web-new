'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useForm, Controller } from 'react-hook-form';

import { Button, Input, InputField, Menu, MenuItem, Segment, Toggle, toast, ErrorText, modal, drawer } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { chainsMapAtom, listChainsAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useAppKit, useAppKitAccount } from '$lib/utils/appkit';
import { CreateGroupParams, SECONDS_PER_MONTH } from '$lib/services/token-launch-pad';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { CreateGroupModal } from '$lib/components/features/community-manage/modals/CreateGroupModal';
import { formatWallet } from '$lib/utils/crypto';
import { useQuery } from '$lib/graphql/request';
import { PoolCreatedDocument, Order_By, PoolCreated } from '$lib/graphql/generated/coin/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { useTokenData } from '$lib/hooks/useCoin';

type ActivateLaunchpadForm = {
  coinAddress: string;
  ownerAddress: string;
  access: 'open' | 'closed';
  ownerFeeEnabled: boolean;
  ownerFee: number | null;
  coinCreatorsFee: number | null;
  membersFee: number | null;
  stakeDurationValue: number;
};

type CoinSelectionMode = 'select' | 'contract';

type SelectedCoin = {
  address: string;
  name: string;
  symbol: string;
  imageUrl?: string;
};

export function ActivateLaunchpad() {
  const chainsMap = useAtomValue(chainsMapAtom);
  const listChains = useAtomValue(listChainsAtom);
  const availableChains = listChains.filter(chain => chain.launchpad_zap_contract_address);
  const [selectedChainId, setSelectedChainId] = useState<string>(availableChains[0]?.chain_id || '');
  const launchChain = chainsMap[selectedChainId];
  const { register, setValue, watch, control, handleSubmit, formState: { errors } } = useForm<ActivateLaunchpadForm>({
    defaultValues: {
      coinAddress: '',
      ownerAddress: '',
      access: 'open',
      ownerFeeEnabled: false,
      ownerFee: 0,
      coinCreatorsFee: 60,
      membersFee: 40,
      stakeDurationValue: 12,
    },
  });
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const access = watch('access');
  const ownerAddress = watch('ownerAddress');
  const ownerFeeEnabled = watch('ownerFeeEnabled');
  const ownerFee = watch('ownerFee');
  const coinCreatorsFee = watch('coinCreatorsFee');
  const membersFee = watch('membersFee');
  const [isEditingFees, setIsEditingFees] = useState(false);

  const [coinSelectionMode, setCoinSelectionMode] = useState<CoinSelectionMode>('select');
  const [selectedCoin, setSelectedCoin] = useState<SelectedCoin | null>(null);
  const [coinSearchQuery, setCoinSearchQuery] = useState('');
  const [tokenDataCache, setTokenDataCache] = useState<Record<string, { name: string; symbol: string; imageUrl?: string }>>({});

  const { data: userCoinsData, loading: isLoadingUserCoins } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [{ blockTimestamp: Order_By.Desc }],
        where: address ? {
          paramsCreator: { _eq: address.toLowerCase() },
          chainId: launchChain ? { _eq: Number(launchChain.chain_id) } : undefined,
        } : undefined,
        limit: 20,
      },
      skip: !address,
    },
    coinClient,
  );

  const userCoins = userCoinsData?.PoolCreated || [];

  const filteredCoins = useMemo(() => {
    if (!coinSearchQuery.trim()) return userCoins;
    const query = coinSearchQuery.toLowerCase();
    return userCoins.filter((coin: PoolCreated) => {
      const addressMatch = coin.memecoin.toLowerCase().includes(query);
      const cachedData = tokenDataCache[coin.memecoin.toLowerCase()];
      if (cachedData) {
        const symbolMatch = cachedData.symbol.toLowerCase().includes(query);
        const nameMatch = cachedData.name.toLowerCase().includes(query);
        return addressMatch || symbolMatch || nameMatch;
      }
      return addressMatch;
    });
  }, [userCoins, coinSearchQuery, tokenDataCache]);

  const handleSelectCoin = (coin: PoolCreated, tokenData: { name: string; symbol: string; imageUrl?: string } | null) => {
    const selected: SelectedCoin = {
      address: coin.memecoin,
      name: tokenData?.name || 'Unknown',
      symbol: tokenData?.symbol || 'N/A',
      imageUrl: tokenData?.imageUrl,
    };
    setSelectedCoin(selected);
    setValue('coinAddress', coin.memecoin);
    setCoinSelectionMode('select');
  };

  useEffect(() => {
    register('ownerAddress', { required: 'Community owner wallet is required' });
  }, [register]);

  useEffect(() => {
    if (address && !ownerAddress) {
      setValue('ownerAddress', address);
    }
  }, [address, ownerAddress, setValue]);

  const clamp = (value: number | null) => Math.max(0, Math.min(100, value ?? 0));
  const ownerWidth = clamp(ownerFee);
  const creatorsWidth = clamp(coinCreatorsFee);
  const membersWidth = clamp(membersFee);
  const widthTotal = ownerWidth + creatorsWidth + membersWidth || 1;
  const ownerDisplayWidth = ownerWidth ? (ownerWidth / widthTotal) * 100 : 0;
  const creatorsDisplayWidth = creatorsWidth ? (creatorsWidth / widthTotal) * 100 : 0;
  const membersDisplayWidth = membersWidth ? (membersWidth / widthTotal) * 100 : 0;

  const handleConnectOwner = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: async () => {
          modal.close();
        },
      },
    });
  };

  const handleActivate = handleSubmit((formData) => {
    if (!launchChain) {
      toast.error('Select a network before activating your launchpad');
      return;
    }

    const openCreateGroup = () => {
      const payload: CreateGroupParams = {
        groupERC20Token: formData.coinAddress,
        groupOwner: formData.ownerAddress,
        minEscrowDuration: 0,
        minStakeDuration: formData.stakeDurationValue * SECONDS_PER_MONTH,
        creatorSharePercentage: formData.coinCreatorsFee ?? 0,
        ownerSharePercentage: formData.ownerFeeEnabled ? (formData.ownerFee ?? 0) : 0,
        isOpen: formData.access === 'open',
      };

      modal.open(CreateGroupModal, {
        props: {
          params: payload,
          launchChain,
          onSuccess: () => {
            drawer.close();
          },
        },
      });
    };

    modal.open(ConnectWallet, {
      props: {
        chain: launchChain,
        onConnect: async () => {
          modal.close();
          openCreateGroup();
        },
      },
    });
  });

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>
      <Pane.Content className="p-4 flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="size-[56px] flex items-center justify-center bg-primary/8 rounded-full">
            <i aria-hidden="true" className="icon-rocket size-8 text-tertiary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Activate Launchpad</h1>
            <p className="text-secondary">Set up your community coin, membership rules & trading fee split.</p>
          </div>
          <div className="space-y-2">
            <p className="text-lg">Community Coin</p>
            <ul className="list-disc pl-5.5 text-sm">
              <li className="text-sm font-medium text-secondary">Community Coins can be any ERC20 including Flaunch, Zora, Clanker coins.</li>
              <li className="text-sm font-medium text-secondary">Communities earn ETH from all of their subcoin trading fees.</li>
              <li className="text-sm font-medium text-secondary">Holders of the Community Coin receive pro-rata ETH from all rewards generated by the Community.</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Network</p>
          <Menu.Root>
            <Menu.Trigger>
              <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer">
                {launchChain?.logo_url && (
                  <img src={launchChain.logo_url} alt={launchChain.name} className="size-5 rounded-full" />
                )}
                <p className="flex-1 text-left">{launchChain?.name || 'Select Network'}</p>
                <i aria-hidden="true" className="icon-chevron-down text-tertiary size-4" />
              </div>
            </Menu.Trigger>
            <Menu.Content className="p-1 w-full">
              {({ toggle }) => (
                <>
                  {availableChains.map(chain => (
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
                          <i aria-hidden="true" className="icon-check text-accent-400 size-4" />
                        )}
                      </div>
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Community Owner</p>
          {ownerAddress ? (
            <div className="flex gap-2.5 py-2 px-3 rounded-sm bg-primary/8">
              <i aria-hidden="true" className="icon-wallet size-5 aspect-square text-tertiary" />
              <p className="flex-1">{formatWallet(ownerAddress)}</p>
              <i
                className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
                onClick={() => open()}
              />
            </div>
          ) : (
            <Button variant="secondary" size="sm" iconLeft="icon-wallet" className="w-fit" onClick={handleConnectOwner}>
              Connect Wallet
            </Button>
          )}
          {errors.ownerAddress?.message && <ErrorText message={errors.ownerAddress.message} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Coin Contract Address</p>
          <input type="hidden" {...register('coinAddress', { required: 'Select or enter your community coin contract address to continue' })} />
          {coinSelectionMode === 'contract' ? (
            <Input
              placeholder="0x000000..."
              value={watch('coinAddress')}
              onChange={(e) => setValue('coinAddress', e.target.value)}
              variant="outlined"
              error={Boolean(errors.coinAddress)}
            />
          ) : (
            <Menu.Root placement="bottom-start">
              <Menu.Trigger className="w-full">
                {selectedCoin ? (
                  <div className="flex items-center gap-2.5 py-2 px-3.5 rounded-sm bg-primary/8 cursor-pointer">
                    {selectedCoin.imageUrl ? (
                      <img src={selectedCoin.imageUrl} alt={selectedCoin.name} className="size-5 rounded-xs object-cover border border-card-border" />
                    ) : (
                      <div className="size-5 rounded-xs bg-primary/8 border border-card-border flex items-center justify-center">
                        <i aria-hidden="true" className="icon-token size-4 text-tertiary" />
                      </div>
                    )}
                    <div className="flex gap-2 items-center flex-1">
                      <p>{selectedCoin.symbol}</p>
                      <p className="text-tertiary">{formatWallet(selectedCoin.address)}</p>
                    </div>
                    <i aria-hidden="true" className="icon-chevron-down text-tertiary size-4" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2 px-3 rounded-sm border border-card-border bg-card cursor-pointer">
                    <p className="flex-1 text-left text-tertiary">Select a coin</p>
                    <i aria-hidden="true" className="icon-chevron-down text-tertiary size-4" />
                  </div>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 w-full min-w-[320px]">
                {({ toggle }) => (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Search coins"
                      value={coinSearchQuery}
                      onChange={(e) => setCoinSearchQuery(e.target.value)}
                      className="w-full py-2 px-3 border-0 border-b border-card-border bg-card outline-none font-medium"
                    />
                    <div className="p-1">
                      <MenuItem
                        onClick={() => {
                          window.open('/create/coin', '_blank');
                          toggle();
                        }}
                        className="px-2 py-1.5"
                      >
                        <div className="flex items-center gap-2.5 w-full">
                          <i aria-hidden="true" className="icon-plus size-4 text-tertiary" />
                          <p className="flex-1 text-sm text-secondary">Create New Coin</p>
                          <i aria-hidden="true" className="icon-arrow-outward size-4 text-tertiary" />
                        </div>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setCoinSelectionMode('contract');
                          toggle();
                        }}
                        className="px-2 py-1.5"
                      >
                        <div className="flex items-center gap-2.5 w-full">
                          <i aria-hidden="true" className="icon-edit-square size-4 text-tertiary" />
                          <p className="flex-1 text-sm text-secondary">Add by Contract Address</p>
                        </div>
                      </MenuItem>
                    </div>
                    {filteredCoins.length > 0 && (
                      <div className="border-t border-card-border p-1">
                        <p className="px-2 py-1 text-sm text-tertiary">Your Coins</p>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredCoins.map((coin: PoolCreated) => (
                            <CoinListItem
                              key={coin.id}
                              coin={coin}
                              chain={launchChain}
                              onSelect={(tokenData) => {
                                handleSelectCoin(coin, tokenData);
                                toggle();
                              }}
                              onTokenDataLoad={(tokenData) => {
                                if (tokenData) {
                                  setTokenDataCache((prev) => ({
                                    ...prev,
                                    [coin.memecoin.toLowerCase()]: tokenData,
                                  }));
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {isLoadingUserCoins && (
                      <div className="flex items-center justify-center py-4">
                        <i aria-hidden="true" className="icon-loader animate-spin size-5 text-tertiary" />
                      </div>
                    )}
                  </div>
                )}
              </Menu.Content>
            </Menu.Root>
          )}
          {errors.coinAddress?.message && <ErrorText message={errors.coinAddress.message} />}
          <p className="text-sm text-tertiary mt-0.5">This coin can be staked to earn the Group's ETH rewards.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm">Access</p>
          <Segment
            selected={access}
            items={[
              { label: 'Open', value: 'open' },
              { label: 'Closed', value: 'closed' },
            ]}
            onSelect={(item) => {
              setValue('access', item.value as 'open' | 'closed');
            }}
          />
          <p className="text-sm text-tertiary mt-0.5">
            {access === 'open' ? 'Anyone can join and add subcoins.' : 'Only the creator can add subcoins.'}
          </p>
        </div>

        <hr className="border-t border-t-divider" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-lg">Trading Fees</p>
            <Button
              variant="tertiary"
              size="sm"
              iconLeft={!isEditingFees ? 'icon-edit-sharp' : undefined}
              onClick={() => setIsEditingFees(!isEditingFees)}
            >
              {isEditingFees ? 'Save' : 'Edit'}
            </Button>
          </div>

          <div className="rounded-md bg-card flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <i aria-hidden="true" className="icon-attach-money text-tertiary size-5" />
              <div>
                <p className="text-sm font-medium">Community Owner Fee</p>
                <p className="text-sm text-tertiary">As Community Owner you can take a fee on all activity</p>
              </div>
            </div>
            <Toggle
              id="owner-fee-toggle"
              checked={ownerFeeEnabled}
              onChange={(value) => {
                setValue('ownerFeeEnabled', value);
                if (!value) {
                  setValue('ownerFee', null);
                }
              }}
            />
          </div>

          {isEditingFees ? (
            <div className="space-y-3">
              {
                ownerFeeEnabled && (
                  <div className="space-y-1.5">
                    <p className="text-sm text-secondary">Community Owner</p>
                    <Controller
                      control={control}
                      name="ownerFee"
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            type="number"
                            variant="outlined"
                            value={field.value ?? ''}
                            onChange={(event) => {
                              const value = event.target.value;
                              field.onChange(value === '' ? null : Number(value) || null);
                            }}
                            min={0}
                            max={100}
                            style={{
                              MozAppearance: 'textfield',
                            }}
                            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-tertiary">%</span>
                        </div>
                      )}
                    />
                  </div>
                )
              }

              <div className="space-y-1.5">
                <p className="text-sm text-secondary">Coin Creators</p>
                <Controller
                  control={control}
                  name="coinCreatorsFee"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        type="number"
                        variant="outlined"
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? null : Number(value) || null);
                        }}
                        min={0}
                        max={100}
                        style={{
                          MozAppearance: 'textfield',
                        }}
                        className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-tertiary">%</span>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm text-secondary">Members</p>
                <Controller
                  control={control}
                  name="membersFee"
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        type="number"
                        variant="outlined"
                        value={field.value ?? ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          field.onChange(value === '' ? null : Number(value) || null);
                        }}
                        min={0}
                        max={100}
                        style={{
                          MozAppearance: 'textfield',
                        }}
                        className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-tertiary">%</span>
                    </div>
                  )}
                />
              </div>

              {(() => {
                const total = (ownerFee ?? 0) + (coinCreatorsFee ?? 0) + (membersFee ?? 0);
                const isValid = Math.abs(total - 100) < 0.01;

                if (!isValid) {
                  return (
                    <p className="text-error text-sm">
                      Total percentage must equal 100%.
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex w-full h-2 rounded-full overflow-hidden bg-card-border gap-0.5">
                {ownerDisplayWidth > 0 && (
                  <div
                    className="h-full bg-accent-400"
                    style={{ width: `${ownerDisplayWidth}%` }}
                  />
                )}
                {creatorsDisplayWidth > 0 && (
                  <div
                    className="h-full bg-alert-400"
                    style={{ width: `${creatorsDisplayWidth}%` }}
                  />
                )}
                {membersDisplayWidth > 0 && (
                  <div
                    className="h-full bg-warning-300"
                    style={{ width: `${membersDisplayWidth}%` }}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {ownerFee != null && ownerFee > 0 && (
                  <div className="flex items-center gap-1 text-secondary">
                    <span className="inline-block size-2 rounded-full bg-accent-400" />
                    <p className="text-accent-400 text-sm">Community Owner {ownerFee}%</p>
                  </div>
                )}
                <div className="flex items-center gap-1 text-secondary">
                  <span className="inline-block size-2 rounded-full bg-alert-400" />
                  <p className="text-alert-400 text-sm">Coin Creators {coinCreatorsFee}%</p>
                </div>
                <div className="flex items-center gap-1 text-secondary ">
                  <span className="inline-block size-2 rounded-full bg-warning-300" />
                  <p className="text-warning-300 text-sm">Members {membersFee}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="border-t border-t-divider" />

        <div className="flex flex-col gap-4">
          <p className="text-lg">Membership Settings</p>
          <div className="flex gap-4 justify-between">
            <div>
              <p>Minimum Stake Duration</p>
              <p className="text-sm text-tertiary">Choose how long the coins stay locked for</p>
            </div>
            <div className="flex items-center justify-end">
              <Controller
                control={control}
                name="stakeDurationValue"
                render={({ field }) => (
                  <InputField
                    type="number"
                    value={String(field.value)}
                    onChangeText={(value) => {
                      const nextValue = Math.max(1, Number(value) || 1);
                      field.onChange(nextValue);
                    }}
                    subfix="months"
                    className="w-40"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Pane.Content>

      <Pane.Footer className="p-4 border-t border-t-divider">
        <Button
          variant="secondary"
          onClick={handleActivate}
        >
          Activate Launchpad
        </Button>
      </Pane.Footer>
    </Pane.Root>
  );
}

type CoinListItemProps = {
  coin: PoolCreated;
  chain: Chain | undefined;
  onSelect: (tokenData: { name: string; symbol: string; imageUrl?: string } | null) => void;
  onTokenDataLoad?: (tokenData: { name: string; symbol: string; imageUrl?: string } | null) => void;
};

function CoinListItem({ coin, chain, onSelect, onTokenDataLoad }: CoinListItemProps) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, coin.memecoin, coin.tokenURI || undefined);

  useEffect(() => {
    if (tokenData && onTokenDataLoad) {
      onTokenDataLoad({
        name: tokenData.name,
        symbol: tokenData.symbol,
        imageUrl: tokenData.metadata?.imageUrl,
      });
    }
  }, [tokenData, onTokenDataLoad]);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-primary/8"
      onClick={() => onSelect(tokenData ? {
        name: tokenData.name,
        symbol: tokenData.symbol,
        imageUrl: tokenData.metadata?.imageUrl,
      } : null)}
    >
      {isLoadingTokenData ? (
        <div className="size-4 rounded-sm bg-primary/8 border border-card-border animate-pulse" />
      ) : tokenData?.metadata?.imageUrl ? (
        <img src={tokenData.metadata.imageUrl} alt={tokenData.name} className="size-4 rounded-sm object-cover border border-card-border" />
      ) : (
        <div className="size-4 rounded-sm bg-primary/8 border border-card-border flex items-center justify-center">
          <i aria-hidden="true" className="icon-token size-3 text-tertiary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {isLoadingTokenData ? (
          <>
            <div className="h-4 w-16 bg-primary/8 rounded animate-pulse" />
            <div className="h-3 w-32 bg-primary/8 rounded mt-1 animate-pulse" />
          </>
        ) : (
          <>
            <p className="text-sm text-secondary truncate">{tokenData?.symbol || 'Unknown'}</p>
            <p className="text-sm text-tertiary truncate">{coin.memecoin}</p>
          </>
        )}
      </div>
    </div>
  );
}
