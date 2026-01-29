import { getDefaultStore } from 'jotai';
import { JsonRpcProvider } from 'ethers';
import { createDrift, type Drift, type ReadContract } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';

import { chainsMapAtom } from '$lib/jotai';
import { MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { RedEnvelopeAbi } from '$lib/abis/RedEnvelope';
import { ERC20 } from '$lib/abis/ERC20';

type RedEnvelopeABI = typeof RedEnvelopeAbi;
type ERC20ABI = typeof ERC20;

export type Pricing = {
  count: bigint;
  price: bigint;
  preDiscountPrice: bigint;
};

export const RED_ENVELOPE_ADDRESS = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  ? '0x7EeFEBbDcF2F291C48283fE01edf6D2dB85cE0DB' : '0x141Bf1878845d5396Bb5CBf8565E583Ac56453A9';

export class RedEnvelopeClient {
  private static instance: RedEnvelopeClient | null = null;

  static getInstance(): RedEnvelopeClient {
    if (!RedEnvelopeClient.instance) {
      RedEnvelopeClient.instance = new RedEnvelopeClient();
    }

    return RedEnvelopeClient.instance;
  }

  private drift: Drift;
  private provider: JsonRpcProvider;
  private contract: ReadContract<RedEnvelopeABI>;
  private currencyAddress: string | null = null;
  private currencyContract: ReadContract<ERC20ABI> | null = null;

  constructor() {
    const chainsMap = getDefaultStore().get(chainsMapAtom);
    const chain = chainsMap[MEGAETH_CHAIN_ID];

    if (!chain) {
      throw new Error(`Chain with ID ${MEGAETH_CHAIN_ID} not found`);
    }

    if (!chain.rpc_url) {
      throw new Error('Chain RPC URL is required');
    }

    this.provider = new JsonRpcProvider(chain.rpc_url);
    this.drift = createDrift({
      adapter: ethersAdapter({ provider: this.provider }),
    });

    this.contract = this.drift.contract({
      abi: RedEnvelopeAbi,
      address: RED_ENVELOPE_ADDRESS,
    });
  }

  async getAllPricing(): Promise<readonly Pricing[]> {
    return this.contract.read('getAllPricing');
  }

  async getCurrency(): Promise<string> {
    if (!this.currencyAddress) {
      this.currencyAddress = (await this.contract.read('currency')) as string;
    }
    return this.currencyAddress;
  }

  private async getContract(): Promise<ReadContract<ERC20ABI>> {
    if (!this.currencyContract) {
      const currencyAddress = await this.getCurrency();
      this.currencyContract = this.drift.contract({
        abi: ERC20,
        address: currencyAddress,
      });
    }
    return this.currencyContract;
  }

  async getCurrencyDecimals(): Promise<number> {
    const contract = await this.getContract();
    const decimals = await contract.read('decimals');
    return Number(decimals);
  }

  async getCurrencySymbol(): Promise<string> {
    const contract = await this.getContract();
    return contract.read('symbol') as Promise<string>;
  }
}
