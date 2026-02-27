import { createDrift, type Drift, type ReadContract, type ReadWriteContract } from '@gud/drift';
import { viemAdapter } from '@gud/drift-viem';
import { createPublicClient, http, type WalletClient } from 'viem';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { StakingManagerAbi } from '$lib/abis/token-launch-pad/StakingManager';
import { MarketUtils } from '$lib/abis/token-launch-pad/MarketUtils';
import { getGasOptionsByChainId, getViemChainConfig } from '$lib/utils/crypto';

type StakingManagerABI = typeof StakingManagerAbi;
type MarketUtilsABI = typeof MarketUtils;

export class StakingManagerClient {
  private static instances: Map<string, StakingManagerClient> = new Map();

  static getInstance(chain: Chain, address: string, walletClient?: WalletClient): StakingManagerClient {
    if (walletClient) return new StakingManagerClient(chain, address, walletClient);

    const key = `${chain.chain_id}-${address}`;

    if (!StakingManagerClient.instances.has(key)) {
      StakingManagerClient.instances.set(key, new StakingManagerClient(chain, address));
    }

    return StakingManagerClient.instances.get(key)!;
  }

  private drift: Drift;
  private chain: Chain;
  private contract: ReadContract<StakingManagerABI>;
  private marketUtilsContract: ReadContract<MarketUtilsABI> | null = null;

  constructor(chain: Chain, address: string, walletClient?: WalletClient) {
    if (!chain.rpc_url) {
      throw new Error('Chain RPC URL is required');
    }

    this.chain = chain;

    const viemChain = getViemChainConfig(chain);
    const publicClient = createPublicClient({
      chain: viemChain,
      transport: http(chain.rpc_url),
    });

    this.drift = createDrift({
      adapter: viemAdapter({ publicClient, walletClient }),
    });

    this.contract = this.drift.contract({
      abi: StakingManagerAbi,
      address: address as `0x${string}`,
    });

    if (chain.launchpad_market_utils_contract_address) {
      this.marketUtilsContract = this.drift.contract({
        abi: MarketUtils,
        address: chain.launchpad_market_utils_contract_address as `0x${string}`,
      });
    }
  }

  async getStakingToken(): Promise<string> {
    return this.contract.read('stakingToken');
  }

  async getOwnerShare(): Promise<bigint> {
    return this.contract.read('ownerShare');
  }

  async getCreatorShare(): Promise<bigint> {
    return this.contract.read('creatorShare');
  }

  async getManagerOwner(): Promise<string> {
    return this.contract.read('managerOwner');
  }

  async getTotalDeposited(): Promise<bigint> {
    return this.contract.read('totalDeposited');
  }

  async getMinStakeDuration(): Promise<bigint> {
    return this.contract.read('minStakeDuration');
  }

  async getPermissions(): Promise<string> {
    return this.contract.read('permissions');
  }

  async getStakingTokenMarketCap(tokenAmount: bigint): Promise<bigint> {
    if (!this.marketUtilsContract) {
      throw new Error('MarketUtils contract not available');
    }

    const stakingToken = await this.getStakingToken();

    const marketCap = await this.marketUtilsContract.read('marketCap', {
      memecoin: stakingToken as `0x${string}`,
      tokenAmount,
    });

    return marketCap;
  }

  async stake(amount: bigint): Promise<string> {
    const gasOptions = getGasOptionsByChainId(this.chain.chain_id);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('stake', { _amount: amount }, gasOptions);
  }

  async unstake(amount: bigint): Promise<string> {
    const gasOptions = getGasOptionsByChainId(this.chain.chain_id);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('unstake', { _amount: amount }, gasOptions);
  }

  async userPositions(user: string): Promise<{ amount: bigint; timelockedUntil: bigint; ethRewardsPerTokenSnapshotX128: bigint; ethOwed: bigint }> {
    return this.contract.read('userPositions', { user: user as `0x${string}` });
  }

  async balances(recipient: string): Promise<bigint> {
    return this.contract.read('balances', { _recipient: recipient as `0x${string}` });
  }

  async claim(): Promise<string> {
    const gasOptions = getGasOptionsByChainId(this.chain.chain_id);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('claim', {}, gasOptions);
  }
}

