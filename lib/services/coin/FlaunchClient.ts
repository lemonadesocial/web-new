import { isAddress, JsonRpcProvider, type Signer } from 'ethers';
import { createDrift, type Drift, type ReadContract, type Abi, type Hash, ReadWriteContract } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { Flaunch } from '$lib/abis/token-launch-pad/Flaunch';
import { FeeEscrow } from '$lib/abis/token-launch-pad/FeeEscrow';
import { MarketUtils } from '$lib/abis/token-launch-pad/MarketUtils';
import { PoolSwap } from '$lib/abis/token-launch-pad/PoolSwap';
import { PositionManager } from '$lib/abis/token-launch-pad/PositionManager';
import { FlaunchZap } from '$lib/abis/token-launch-pad/FlaunchZap';
import { TreasuryManagerFactory } from '$lib/abis/token-launch-pad/TreasuryManagerFactory';
import { MarketCappedPrice } from '$lib/abis/token-launch-pad/MarketCappedPrice';
import { Memecoin } from '$lib/abis/token-launch-pad/Memecoin';
import { LETH } from '$lib/abis/token-launch-pad/LETH';
import { ERC20 } from '$lib/abis/ERC20';

type FlaunchABI = typeof Flaunch;
type FeeEscrowABI = typeof FeeEscrow;
type MarketUtilsABI = typeof MarketUtils;
type PositionManagerABI = typeof PositionManager;
type FlaunchZapABI = typeof FlaunchZap;
type TreasuryManagerFactoryABI = typeof TreasuryManagerFactory;
type MarketCappedPriceABI = typeof MarketCappedPrice;
type MemecoinABI = typeof Memecoin;
type LETHABI = typeof LETH;

export class FlaunchClient {
  private static instances: Map<string, FlaunchClient> = new Map();

  static getInstance(chain: Chain, memecoinAddress: string, signer?: Signer): FlaunchClient {
    if (signer) return new FlaunchClient(chain, memecoinAddress, signer);
    
    const key = `${chain.chain_id}-${memecoinAddress}`;

    if (!FlaunchClient.instances.has(key)) {
      FlaunchClient.instances.set(key, new FlaunchClient(chain, memecoinAddress));
    }

    return FlaunchClient.instances.get(key)!;
  }

  private drift: Drift;
  private provider: JsonRpcProvider;

  private zapContract: ReadContract<FlaunchZapABI>;
  private flaunchContract: ReadContract<FlaunchABI> | null = null;
  private treasuryManagerFactoryContract: ReadContract<TreasuryManagerFactoryABI> | null = null;
  private feeEscrowContract: ReadContract<FeeEscrowABI>;
  private marketCappedPriceContract: ReadContract<MarketCappedPriceABI>;
  private marketUtilsContract: ReadContract<MarketUtilsABI>;
  private memecoinContract: ReadContract<MemecoinABI>;
  private positionManagerContract: ReadContract<PositionManagerABI> | null = null;

  private memecoinAddress: string;

  constructor(chain: Chain, memecoinAddress: string, signer?: Signer) {
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

    this.provider = new JsonRpcProvider(chain.rpc_url);

    const adapterConfig = signer ? { provider: this.provider, signer } : { provider: this.provider };

    this.drift = createDrift({
      adapter: ethersAdapter(adapterConfig),
    });

    this.zapContract = this.drift.contract({
      abi: FlaunchZap,
      address: chain.launchpad_zap_contract_address,
    });

    this.feeEscrowContract = this.drift.contract({
      abi: FeeEscrow,
      address: chain.launchpad_fee_escrow_contract_address,
    });

    this.marketCappedPriceContract = this.drift.contract({
      abi: MarketCappedPrice,
      address: chain.launchpad_market_capped_price_contract_address,
    });

    this.marketUtilsContract = this.drift.contract({
      abi: MarketUtils,
      address: chain.launchpad_market_utils_contract_address,
    });

    this.memecoinContract = this.drift.contract({
      abi: Memecoin,
      address: memecoinAddress,
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

  async getTreasuryManagerFactory(): Promise<ReadContract<TreasuryManagerFactoryABI>> {
    if (this.treasuryManagerFactoryContract) {
      return this.treasuryManagerFactoryContract;
    }

    const factoryAddress = await this.zapContract.read('treasuryManagerFactory');

    if (!isAddress(factoryAddress)) {
      throw new Error('Invalid treasury manager factory address');
    }

    this.treasuryManagerFactoryContract = this.drift.contract({
      abi: TreasuryManagerFactory,
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

  async getTokenData(): Promise<{ name: string; symbol: string; tokenURI: string; decimals: number }> {
    const tokenId = await this.getTokenId();
    const flaunchContract = await this.getFlaunchContract();

    const [name, symbol, tokenURI, decimals] = await Promise.all([
      this.memecoinContract.read('name'),
      this.memecoinContract.read('symbol'),
      flaunchContract.read('tokenURI', {
        _tokenId: tokenId,
      }),
      this.memecoinContract.read('decimals'),
    ]);

    return {
      name: name as string,
      symbol: symbol as string,
      tokenURI: tokenURI as string,
      decimals: Number(decimals),
    };
  }

  async getEthValueForAmount(tokenAmount?: bigint): Promise<bigint> {
    const decimals = await this.memecoinContract.read('decimals');
    const unitAmount = (tokenAmount ?? BigInt(1)) * (BigInt(10) ** BigInt(decimals));

    const ethAmount = await this.marketUtilsContract.read('marketCap', {
      memecoin: this.memecoinAddress,
      tokenAmount: unitAmount,
    });

    return ethAmount as bigint;
  }

  private async getPositionManagerContract(): Promise<ReadContract<PositionManagerABI>> {
    if (this.positionManagerContract) return this.positionManagerContract;

    const flaunchContract = await this.getFlaunchContract();
    const address = await flaunchContract.read('positionManager');

    if (!isAddress(address)) {
      throw new Error('Invalid position manager address');
    }

    this.positionManagerContract = this.drift.contract({
      abi: PositionManager,
      address,
    });

    return this.positionManagerContract;
  }

  async buyCoin({
    buyAmount,
    slippageTolerance = 500,
  }: {
    buyAmount: bigint;
    slippageTolerance?: number;
  }): Promise<Hash> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await positionManager.read('nativeToken');

    const poolKey = await positionManager.read('poolKey', {
      _token: this.memecoinAddress,
    });

    const priceBounds = await this.marketUtilsContract.read('currentSqrtPriceX96', {
      memecoin: this.memecoinAddress,
      slippage: slippageTolerance,
    });
    
    const minSqrtPriceX96 = priceBounds.min;
    const maxSqrtPriceX96 = priceBounds.max;

    const isNativeToken0 = nativeToken.toLowerCase().localeCompare(this.memecoinAddress.toLowerCase()) <= 0;
    const sqrtPriceLimitX96 = isNativeToken0 ? minSqrtPriceX96 : maxSqrtPriceX96;

    const LETHContract = this.drift.contract({
      abi: LETH,
      address: nativeToken,
    }) as unknown as ReadWriteContract<LETHABI>;

    const poolSwapAddress = await this.zapContract.read('poolSwap');

    await LETHContract.write('approve', {
      _spender: poolSwapAddress,
      _amount: buyAmount,
    });

    const depositTxHash = await LETHContract.write('deposit', {
      [0]: buyAmount,
    }, {
      value: buyAmount,
    });

    const depositTx = await this.provider.getTransaction(depositTxHash);
    if (!depositTx) {
      throw new Error('Failed to get deposit transaction');
    }
    await depositTx.wait();

    const poolSwapContract = this.drift.contract({
      abi: PoolSwap,
      address: poolSwapAddress,
    }) as unknown as ReadWriteContract<typeof PoolSwap>;

    const txHash = await poolSwapContract.write(
      'swap',
      {
        _key: poolKey,
        _params: {
          zeroForOne: isNativeToken0,
          amountSpecified: -buyAmount,
          sqrtPriceLimitX96,
        }
      },
      {
        value: buyAmount,
      }
    );

    return txHash;
  }

  async sellCoin({
    sellAmount,
    slippageTolerance = 500,
  }: {
    sellAmount: bigint;
    slippageTolerance?: number;
  }): Promise<Hash> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await positionManager.read('nativeToken');

    const poolKey = await positionManager.read('poolKey', {
      _token: this.memecoinAddress,
    });

    const priceBounds = await this.marketUtilsContract.read('currentSqrtPriceX96', {
      memecoin: this.memecoinAddress,
      slippage: slippageTolerance,
    });
    
    const minSqrtPriceX96 = priceBounds.min;
    const maxSqrtPriceX96 = priceBounds.max;

    const isNativeToken0 = nativeToken.toLowerCase().localeCompare(this.memecoinAddress.toLowerCase()) <= 0;
    const sqrtPriceLimitX96 = !isNativeToken0 ? minSqrtPriceX96 : maxSqrtPriceX96;

    const ERC20Contract = this.drift.contract({
      abi: ERC20,
      address: this.memecoinAddress,
    }) as unknown as ReadWriteContract<typeof ERC20>;

    const poolSwapAddress = await this.zapContract.read('poolSwap');

    const approveTxHash = await ERC20Contract.write('approve', {
      spender: poolSwapAddress,
      amount: sellAmount,
    });

    const approveTx = await this.provider.getTransaction(approveTxHash);
    if (!approveTx) {
      throw new Error('Failed to get approval transaction');
    }
    await approveTx.wait();

    const poolSwapContract = this.drift.contract({
      abi: PoolSwap,
      address: poolSwapAddress,
    }) as unknown as ReadWriteContract<typeof PoolSwap>;

    console.log({
      _key: poolKey,
      _params: {
        zeroForOne: !isNativeToken0,
        amountSpecified: -sellAmount,
        sqrtPriceLimitX96,
      }
    })

    const txHash = await poolSwapContract.write(
      'swap',
      {
        _key: poolKey,
        _params: {
          zeroForOne: !isNativeToken0,
          amountSpecified: -sellAmount,
          sqrtPriceLimitX96,
        }
      }
    );

    return txHash;
  }
}
