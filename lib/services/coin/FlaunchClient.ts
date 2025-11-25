import { isAddress, JsonRpcProvider } from 'ethers';
import { createDrift, type Drift, type ReadContract, type Abi } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { Flaunch } from '$lib/abis/token-launch-pad/Flaunch';
import ZapContractABI from '$lib/abis/token-launch-pad/FlaunchZap.json';
import TreasuryManagerFactoryABI from '$lib/abis/token-launch-pad/TreasuryManagerFactory.json';
import MarketCappedPriceABI from '$lib/abis/token-launch-pad/MarketCappedPrice.json';

import FeeEscrowABI from '$lib/abis/token-launch-pad/FeeEscrow.json';

type FlaunchABI = typeof Flaunch;

export class FlaunchClient {
  private static instances: Map<string, FlaunchClient> = new Map();

  static getInstance(chain: Chain, memecoinAddress: string): FlaunchClient {
    const key = `${chain.chain_id}-${memecoinAddress}`;

    if (!FlaunchClient.instances.has(key)) {
      FlaunchClient.instances.set(key, new FlaunchClient(chain, memecoinAddress));
    }

    return FlaunchClient.instances.get(key)!;
  }

  private drift: Drift;
  private zapContract: ReadContract<Abi>;
  private flaunchContract: ReadContract<FlaunchABI> | null = null;
  private treasuryManagerFactoryContract: ReadContract<Abi> | null = null;
  private feeEscrowContract: ReadContract<Abi>;
  private marketCappedPriceContract: ReadContract<Abi>;
  private memecoinAddress: string;

  constructor(chain: Chain, memecoinAddress: string) {
    if (!chain.rpc_url) {
      throw new Error('Chain RPC URL is required');
    }
    if (!chain.launchpad_zap_contract_address) {
      throw new Error('Launchpad zap contract address is required');
    }
    if (!chain.launchpad_fee_escrow_contract_address) {
      throw new Error('Launchpad fee escrow contract address is required');
    }
    if (!chain.launchpad_market_capped_price_contract_address) {
      throw new Error('Launchpad market capped price contract address is required');
    }
    if (!chain.launchpad_market_utils_contract_address) {
      throw new Error('Launchpad market utils contract address is required');
    }

    this.memecoinAddress = memecoinAddress;

    const provider = new JsonRpcProvider(chain.rpc_url);

    this.drift = createDrift({
      adapter: ethersAdapter({ provider }),
    });

    this.zapContract = this.drift.contract({
      abi: ZapContractABI.abi as Abi,
      address: chain.launchpad_zap_contract_address,
    });

    this.feeEscrowContract = this.drift.contract({
      abi: FeeEscrowABI.abi as Abi,
      address: chain.launchpad_fee_escrow_contract_address,
    });

    this.marketCappedPriceContract = this.drift.contract({
      abi: MarketCappedPriceABI.abi as Abi,
      address: chain.launchpad_market_capped_price_contract_address,
    });
  }

  async getFlaunchAddress(): Promise<string> {
    const result = await this.zapContract.read('flaunchContract');
    if (!isAddress(result)) {
      throw new Error('Invalid flaunch contract address');
    }
    return result;
  }

  async getFlaunchContract(): Promise<ReadContract<FlaunchABI>> {
    if (this.flaunchContract) {
      return this.flaunchContract;
    }

    const address = await this.getFlaunchAddress();

    this.flaunchContract = this.drift.contract({
      abi: Flaunch,
      address: address,
    });

    return this.flaunchContract;
  }

  async getTokenId(): Promise<bigint> {
    const flaunchContract = await this.getFlaunchContract();

    const tokenId = await flaunchContract.read('tokenId', {
      _memecoin: this.memecoinAddress
    });

    return tokenId as bigint;
  }

  async getOwnerOf(): Promise<string> {
    const tokenId = await this.getTokenId();

    const flaunchContract = await this.getFlaunchContract();

    const owner = await flaunchContract.read('ownerOf', {
      id: tokenId
    });

    return owner as string;
  }

  async getTreasuryManagerFactory(): Promise<ReadContract<Abi>> {
    if (this.treasuryManagerFactoryContract) {
      return this.treasuryManagerFactoryContract;
    }

    const factoryAddress = await this.zapContract.read('treasuryManagerFactory');

    if (!isAddress(factoryAddress)) {
      throw new Error('Invalid treasury manager factory address');
    }

    this.treasuryManagerFactoryContract = this.drift.contract({
      abi: TreasuryManagerFactoryABI.abi as Abi,
      address: factoryAddress,
    });

    return this.treasuryManagerFactoryContract;
  }

  async getImplementationAddress(): Promise<string | null> {
    const owner = await this.getOwnerOf();
    const factoryContract = await this.getTreasuryManagerFactory();

    const implementation = await factoryContract.read('managerImplementation', {
      _manager: owner,
    });

    if (!isAddress(implementation)) return null;

    return implementation;
  }

  async getPoolId(): Promise<string> {
    const tokenId = await this.getTokenId();
    const flaunchContract = await this.getFlaunchContract();

    const poolId = await flaunchContract.read('poolId', {
      _tokenId: tokenId,
    });

    return poolId as string;
  }

  async getEarnedFees(): Promise<bigint> {
    const poolId = await this.getPoolId();

    const ethAmount = await this.feeEscrowContract.read('totalFeesAllocated', {
      _poolId: poolId,
    });

    const usdcAmount = await this.marketCappedPriceContract.read('getFlippedMarketCap', {
      ethAmount: ethAmount,
    });

    return usdcAmount as bigint;
  }

}
