import { JsonRpcProvider, type Signer } from 'ethers';
import { createDrift, type Drift, type ReadContract, type ReadWriteContract } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { StakingManagerAbi } from '$lib/abis/token-launch-pad/StakingManager';
import { MarketUtils } from '$lib/abis/token-launch-pad/MarketUtils';
import { getGasOptions } from '$lib/utils/crypto';

type StakingManagerABI = typeof StakingManagerAbi;
type MarketUtilsABI = typeof MarketUtils;

export class StakingManagerClient {
  private static instances: Map<string, StakingManagerClient> = new Map();

  static getInstance(chain: Chain, address: string, signer?: Signer): StakingManagerClient {
    if (signer) return new StakingManagerClient(chain, address, signer);

    const key = `${chain.chain_id}-${address}`;

    if (!StakingManagerClient.instances.has(key)) {
      StakingManagerClient.instances.set(key, new StakingManagerClient(chain, address));
    }

    // Safe: we just set the key above if it didn't exist
    return StakingManagerClient.instances.get(key) as StakingManagerClient;
  }

  private drift: Drift;
  private provider: JsonRpcProvider;
  private contract: ReadContract<StakingManagerABI>;
  private marketUtilsContract: ReadContract<MarketUtilsABI> | null = null;

  constructor(chain: Chain, address: string, signer?: Signer) {
    if (!chain.rpc_url) {
      throw new Error('Chain RPC URL is required');
    }

    this.provider = new JsonRpcProvider(chain.rpc_url);
    const adapterConfig = signer ? { provider: this.provider, signer } : { provider: this.provider };

    this.drift = createDrift({
      adapter: ethersAdapter(adapterConfig),
    });

    this.contract = this.drift.contract({
      abi: StakingManagerAbi,
      address,
    });

    if (chain.launchpad_market_utils_contract_address) {
      this.marketUtilsContract = this.drift.contract({
        abi: MarketUtils,
        address: chain.launchpad_market_utils_contract_address,
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
      memecoin: stakingToken,
      tokenAmount,
    });

    return marketCap;
  }

  async stake(amount: bigint): Promise<string> {
    const gasOptions = await getGasOptions(this.provider);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('stake', { _amount: amount }, gasOptions);
  }

  async unstake(amount: bigint): Promise<string> {
    const gasOptions = await getGasOptions(this.provider);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('unstake', { _amount: amount }, gasOptions);
  }

  async userPositions(user: string): Promise<{ amount: bigint; timelockedUntil: bigint; ethRewardsPerTokenSnapshotX128: bigint; ethOwed: bigint }> {
    return this.contract.read('userPositions', { user });
  }

  async balances(recipient: string): Promise<bigint> {
    return this.contract.read('balances', { _recipient: recipient });
  }

  async claim(): Promise<string> {
    const gasOptions = await getGasOptions(this.provider);
    return (this.contract as ReadWriteContract<StakingManagerABI>).write('claim', {}, gasOptions);
  }
}

