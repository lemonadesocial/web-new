import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatUnits, isAddress } from 'ethers';
import { useAtomValue } from "jotai";

import { Button, Chip, ErrorText, Input, LabeledInput, Menu, MenuItem, modal, ModalContent, toast } from "$lib/components/core";
import { listChainsAtom } from "$lib/jotai";
import { Chain, CreateEventTokenGateDocument, EventTokenGate, ListEventTokenGatesDocument, UpdateEventTokenGateDocument } from "$lib/graphql/generated/backend/graphql";
import { ContractType, getContractType, multiplyByPowerOf10 } from "$lib/utils/crypto";
import { useMutation } from "$lib/graphql/request";

type TokenDetailsForm = {
  chain: Chain;
  address: string;
  name?: string;
  decimals?: number;
  min?: string;
  max?: string;
}

type TokenDetailsModalProps = {
  event: Event;
  ticketType: string;
  tokenGate?: EventTokenGate;
  onCreate?: () => void;
  onUpdate?: () => void;
}

export function TokenDetailsModal({ event, ticketType, tokenGate, onCreate, onUpdate }: TokenDetailsModalProps) {
  const listChains = useAtomValue(listChainsAtom);
  const [type, setType] = useState<ContractType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState<boolean>(Boolean(tokenGate?.min_value || tokenGate?.max_value));

  const { watch, setValue, register, handleSubmit, formState: { errors } } = useForm<TokenDetailsForm>({
    defaultValues: tokenGate ? {
      chain: listChains.find(chain => chain.chain_id === tokenGate.network) || listChains[0],
      address: tokenGate.token_address,
      name: tokenGate.name,
      min: tokenGate.min_value ? tokenGate.is_nft ? tokenGate.min_value : formatUnits(tokenGate.min_value, tokenGate.decimals) : undefined,
      max: tokenGate.max_value || undefined,
      decimals: tokenGate.decimals
    } : {
      chain: listChains[0]
    }
  });

  const { chain, address, name } = watch();

  const [create, { loading: loadingCreate }] = useMutation(CreateEventTokenGateDocument, {
    onComplete(client) {
      client.refetchQuery({
        query: ListEventTokenGatesDocument,
        variables: {
          event: event,
          ticketTypes: [ticketType]
        }
      });

      modal.close();
      onCreate?.();
    },
    onError(error) {
      toast.error(error.message);
    }
  });

  const [update, { loading: loadingUpdate}] = useMutation(UpdateEventTokenGateDocument, {
    onComplete() {
      onUpdate?.();
      modal.close();
    },
    onError(error) {
      toast.error(error.message);
    }
  });

  async function onTokenDetailsChange(chain: Chain, address: string) {
    setType(null);

    if (!address || !isAddress(address)) return;

    setLoading(true);

    const { type, symbol, decimals } = await getContractType(address, chain.rpc_url);
    setType(type);
    setValue('name', symbol);
    setValue('decimals', decimals);

    setLoading(false);
  }

  useEffect(() => {
    onTokenDetailsChange(chain, address);
  }, [chain, address]);

  const toggleShowRestrictions = () => {
    setShowRestrictions(!showRestrictions);
    setValue('min', '');
    setValue('max', '');
  }

  const onSubmit = (values: TokenDetailsForm) => {
    const isNFT = type === ContractType.ERC721;
    const minValue = values.min ? (!isNFT && values.decimals ? multiplyByPowerOf10(values.min, values.decimals) : values.min) : undefined;
    const maxValue = values.max ?? undefined;

    const input = {
      decimals: values.decimals,
      name: values.name,
      network: values.chain.chain_id,
      token_address: values.address,
      is_nft: isNFT,
      max_value: maxValue,
      min_value: minValue,
      event: event,
      gated_ticket_types: [ticketType]
    };

    if (tokenGate) {
      update({ variables: {
        input: {
          _id: tokenGate._id,
          ...input
        }
      }});

      return;
    }
    
    create({ variables: { input }});
  }

  return (
    <ModalContent icon="icon-ticket-plus" onClose={() => modal.close()} className="w-[480px]">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <p>Token Details</p>
          <p className="text-sm text-secondary">Supports ERC-20 and ERC-721 tokens.</p>
        </div>

        <LabeledInput label="Select Network">
          <Menu.Root>
            <Menu.Trigger>
              <div className="flex rounded-sm bg-primary/8 py-2 px-3.5 gap-2.5 items-center">
                {chain.logo_url && <img src={chain.logo_url} className="size-5" />}
                <p className="flex-1">{chain.name}</p>
                <i aria-hidden="true" className="icon-chevron-down size-5 text-quaternary" />
              </div>
            </Menu.Trigger>

            <Menu.Content className="p-1 w-full max-h-[180px] overflow-y-auto no-scrollbar">
              {({ toggle }) => listChains.map((chain) => (
                <MenuItem
                  key={chain.chain_id}
                  title={chain.name}
                  iconLeft={chain.logo_url ? <img src={chain.logo_url} className="size-5" /> : undefined}
                  onClick={() => {
                    setValue('chain', chain);
                    toggle();
                  }}
                />
              ))}
            </Menu.Content>
          </Menu.Root>
        </LabeledInput>

        <div className="flex flex-col gap-2">
          <LabeledInput label="Contract Address">
            <Input
              placeholder="0x000000..."
              variant="outlined"
              {...register('address', {
                required: 'Please enter contract address',
                validate: value => isAddress(value) || 'Invalid contract address'
              })}
            />
            {errors.address?.message && <ErrorText message={errors.address.message} />}
          </LabeledInput>
          {
            loading && (
              <div className="flex">
                <i aria-hidden="true" className="icon-dot text-warning-300" />
                <p className="text-secondary text-sm">Retrieving contract data...</p>
              </div>
            )
          }
          {
            type === ContractType.ERC20 && (
              <div className="flex gap-2 items-center">
                <Chip variant="success" size="xxs" className="rounded-full">ERC-20</Chip>
                <p className="text-sm text-secondary">{name}</p>
              </div>
            )
          }
          {
            type === ContractType.ERC721 && (
              <div className="flex gap-2 items-center">
                <Chip variant="primary" size="xxs" className="rounded-full">ERC-721</Chip>
                <p className="text-sm text-secondary">{name}</p>
              </div>
            )
          }
        </div>

        {
          type === ContractType.ERC20 && (
            <div className="flex flex-col gap-4 w-min">
              {
                showRestrictions && (
                  <div className="space-y-2">
                    <p className="text-sm text-secondary">Min Token Balance</p>
                    <Input
                      variant="outlined"
                      className="w-[150px]"
                      placeholder="0"
                      {...register('min')}
                    />
                  </div>
                )
              }
              <Button variant="tertiary" size="sm" onClick={toggleShowRestrictions}>
                {showRestrictions ? 'Remove token balance restriction' : 'Add token balance restriction'}
              </Button>
            </div>
          )
        }

        {/* {
          type === ContractType.ERC721 && (
            <div className="flex flex-col gap-4 w-min">
              {
                showRestrictions && (
                  <div className="flex gap-2">
                    <div className="space-y-2">
                      <p className="text-sm text-secondary">Min Token Balance</p>
                      <Input
                        variant="outlined"
                        className="w-[150px]"
                        placeholder="0"
                        {...register('min')}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-secondary">Max Token Balance</p>
                      <Input
                        variant="outlined"
                        className="w-[150px]"
                        placeholder="0"
                        {...register('max')}
                      />
                    </div>
                  </div>
                )
              }
              <Button variant="tertiary" size="sm" onClick={toggleShowRestrictions}>
                {showRestrictions ? 'Remove token range restrictionn' : 'Remove token range restriction'}
              </Button>
            </div>
          )
        } */}

        <Button
          variant="secondary"
          className="w-full"
          type="submit"
          loading={loadingCreate || loadingUpdate}
          disabled={loading}
        >
          Confirm
        </Button>
      </form>
    </ModalContent>
  );
}
