import { isAddress, JsonRpcProvider, type Signer, Interface } from 'ethers';
import { createDrift, type Drift, type ReadContract, type Hash, ReadWriteContract } from '@gud/drift';
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
import { FairLaunch } from '$lib/abis/token-launch-pad/FairLaunch';
import { BidWall } from '$lib/abis/token-launch-pad/BidWall';
import { MULTICALL } from '$lib/abis/token-launch-pad/Multicall';
import { TOTAL_SUPPLY } from '../token-launch-pad';
import { getFetchableUrl } from '$lib/utils/metadata';

type FlaunchABI = typeof Flaunch;
type FeeEscrowABI = typeof FeeEscrow;
type MarketUtilsABI = typeof MarketUtils;
type PositionManagerABI = typeof PositionManager;
type FlaunchZapABI = typeof FlaunchZap;
type TreasuryManagerFactoryABI = typeof TreasuryManagerFactory;
type MarketCappedPriceABI = typeof MarketCappedPrice;
type MemecoinABI = typeof Memecoin;
type LETHABI = typeof LETH;
type ERC20ABI = typeof ERC20;
type BidWallABI = typeof BidWall;

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

export interface TokenMetadata {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }>;
}

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
  private erc20Contract: ReadContract<ERC20ABI>;
  private bidWallContract: ReadContract<BidWallABI> | null = null;

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

    this.erc20Contract = this.drift.contract({
      abi: ERC20,
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

  async getPositionManagerAddress(): Promise<string> {
    const flaunchContract = await this.getFlaunchContract();
    const address = await flaunchContract.read('positionManager');
    if (!isAddress(address)) {
      throw new Error('Invalid position manager address');
    }
    return address;
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

    return ethAmount;
  }

  async getTokenData(tokenUri?: string): Promise<{ name: string; symbol: string; tokenURI: string; decimals: number; metadata: TokenMetadata | null }> {
    let tokenURIPromise: Promise<string>;
    
    if (tokenUri) {
      tokenURIPromise = Promise.resolve(tokenUri);
    } else {
      const tokenIdPromise = this.getTokenId();
      const flaunchContractPromise = this.getFlaunchContract();
      
      const [tokenId, flaunchContract] = await Promise.all([
        tokenIdPromise,
        flaunchContractPromise,
      ]);
      
      tokenURIPromise = flaunchContract.read('tokenURI', {
        _tokenId: tokenId,
      }) as Promise<string>;
    }

    const [name, symbol, decimals, tokenURI] = await Promise.all([
      this.memecoinContract.read('name'),
      this.memecoinContract.read('symbol'),
      this.memecoinContract.read('decimals'),
      tokenURIPromise,
    ]);

    let resolvedMetadata: TokenMetadata | null = null;
    if (tokenURI) {
      try {
        const fetchableUrl = getFetchableUrl(tokenURI as string);
        const response = await fetch(fetchableUrl.href);
        if (response.ok) {
          const rawMetadata = await response.json() as TokenMetadata;
          
          if (rawMetadata.image) {
            try {
              const imageFetchableUrl = getFetchableUrl(rawMetadata.image);
              resolvedMetadata = {
                ...rawMetadata,
                imageUrl: imageFetchableUrl.href,
              };
            } catch {
              resolvedMetadata = rawMetadata;
            }
          } else {
            resolvedMetadata = rawMetadata;
          }
        }
      } catch (error) {
        console.error('Failed to resolve tokenURI:', error);
      }
    }

    return {
      name: name as string,
      symbol: symbol as string,
      tokenURI: tokenURI as string,
      decimals: Number(decimals),
      metadata: resolvedMetadata,
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

  async getLETHAddress(): Promise<string> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await positionManager.read('nativeToken');

    return nativeToken;
  }

  async getUSDCFromETH(ethAmount: bigint): Promise<bigint> {
    const usdcAmount = await this.marketCappedPriceContract.read('getFlippedMarketCap', {
      ethAmount,
    });

    return usdcAmount as bigint;
  }

  async getTreasuryValue(): Promise<bigint> {
    const flaunchContract = await this.getFlaunchContract();

    const memeCoinTreasury = await flaunchContract.read('memecoinTreasury', {
      _tokenId: await this.getTokenId(),
    });

    const memeCoinTreasuryBalance = await this.erc20Contract.read('balanceOf', {
      account: memeCoinTreasury,
    });

    const marketCap = await this.marketUtilsContract.read('marketCap', {
      memecoin: this.memecoinAddress,
      tokenAmount: memeCoinTreasuryBalance,
    });

    const lETHAddress = await this.getLETHAddress();
    const lETHContract = this.drift.contract({
      abi: ERC20,
      address: lETHAddress,
    })

    const lETHBalance = await lETHContract.read('balanceOf', {
      account: memeCoinTreasury,
    });

    const finalETHAmount = marketCap + lETHBalance;

    const finalUSDCAmount = await this.getUSDCFromETH(finalETHAmount);

    return finalUSDCAmount;
  }

  async getMarketCap(): Promise<bigint> {
    const totalSupply = await this.memecoinContract.read('totalSupply');

    const ethAmount = await this.marketUtilsContract.read('marketCap', {
      memecoin: this.memecoinAddress,
      tokenAmount: totalSupply,
    });

    const usdcAmount = await this.getUSDCFromETH(ethAmount);

    return usdcAmount;
  }

  async getLiquidity(): Promise<bigint> {
    const liquidity = await this.marketUtilsContract.read('poolLiquidity', {
      memecoin: this.memecoinAddress,
    });

    const memecoinETHValue = await this.marketUtilsContract.read('marketCap', {
      memecoin: this.memecoinAddress,
      tokenAmount: liquidity._tokenAmount,
    });

    const totalETHAmount = memecoinETHValue + liquidity._ethAmount;

    const totalUSDCAmount = await this.getUSDCFromETH(totalETHAmount);

    return totalUSDCAmount;
  }

  async getFairLaunch(): Promise<{
    info: any;
    percentage: number;
    usdcValue: bigint;
  }> {
    const positionManager = await this.getPositionManagerContract();
    const fairLaunchAddress = await positionManager.read('fairLaunch');

    if (!isAddress(fairLaunchAddress)) {
      throw new Error('Invalid fair launch address');
    }

    const fairLaunchContract = this.drift.contract({
      abi: FairLaunch,
      address: fairLaunchAddress,
    });

    const poolId = await this.getPoolId();

    const fairLaunchInfo = await fairLaunchContract.read('fairLaunchInfo', {
      _poolId: poolId,
    });

    const supply = fairLaunchInfo.supply as bigint;

    const percentage = Number((supply * BigInt(10000)) / TOTAL_SUPPLY) / 100;

    const supplyEthValue = await this.marketUtilsContract.read('marketCap', {
      memecoin: this.memecoinAddress,
      tokenAmount: supply,
    });

    const supplyUsdcValue = await this.getUSDCFromETH(supplyEthValue);

    return {
      info: fairLaunchInfo,
      percentage,
      usdcValue: supplyUsdcValue,
    };
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
    recipient,
  }: {
    buyAmount: bigint;
    slippageTolerance?: number;
    recipient: string;
  }): Promise<Hash> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await this.getLETHAddress();

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

    const poolSwapAddress = await this.zapContract.read('poolSwap');

    const lETHInterface = new Interface(LETH);
    const poolSwapInterface = new Interface(PoolSwap);

    const calls: Array<{
      target: string;
      allowFailure: boolean;
      value: bigint;
      callData: string;
    }> = [
        {
          target: nativeToken,
          allowFailure: false,
          value: buyAmount,
          callData: lETHInterface.encodeFunctionData('deposit', [0]),
        },
        {
          target: nativeToken,
          allowFailure: false,
          value: 0n,
          callData: lETHInterface.encodeFunctionData('approve', [poolSwapAddress, buyAmount]),
        },
        {
          target: poolSwapAddress,
          allowFailure: false,
          value: 0n,
          callData: poolSwapInterface.encodeFunctionData('swap', [
            [
              poolKey.currency0,
              poolKey.currency1,
              poolKey.fee,
              poolKey.tickSpacing,
              poolKey.hooks,
            ],
            {
              zeroForOne: isNativeToken0,
              amountSpecified: -buyAmount,
              sqrtPriceLimitX96,
            },
            recipient,
          ]),
        },
      ];

    const multicall3Contract = this.drift.contract({
      abi: MULTICALL,
      address: MULTICALL3_ADDRESS,
    }) as unknown as ReadWriteContract<typeof MULTICALL>;

    const txHash = await multicall3Contract.write('aggregate3Value', {
      calls,
    }, {
      value: buyAmount,
    });

    return txHash;
  }

  //-- keep this function for fallback if other wallet clients do not support 7702
  async sellCoin({
    sellAmount,
    slippageTolerance = 500,
    recipient,
  }: {
    sellAmount: bigint;
    slippageTolerance?: number;
    recipient: string;
  }): Promise<Hash> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await this.getLETHAddress();

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

    const txHash = await poolSwapContract.write(
      'swap',
      {
        _key: poolKey,
        _params: {
          zeroForOne: !isNativeToken0,
          amountSpecified: -sellAmount,
          sqrtPriceLimitX96,
        },
        _recipient: recipient,
      }
    );

    return txHash;
  }

  async sellCoinWith7702(sendCalls: (calls: any[]) => Promise<string>, {
    sellAmount,
    slippageTolerance = 500,
    recipient,
  }: {
    sellAmount: bigint;
    slippageTolerance?: number;
    recipient: string;
  }): Promise<Hash> {
    const positionManager = await this.getPositionManagerContract();
    const nativeToken = await this.getLETHAddress();

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

    const poolSwapAddress = await this.zapContract.read('poolSwap');

    const erc20Interface = new Interface(ERC20);
    const poolSwapInterface = new Interface(PoolSwap);

    const approveData = erc20Interface.encodeFunctionData('approve', [
      poolSwapAddress,
      sellAmount,
    ]);

    const swapData = poolSwapInterface.encodeFunctionData('swap', [
      [
        poolKey.currency0,
        poolKey.currency1,
        poolKey.fee,
        poolKey.tickSpacing,
        poolKey.hooks,
      ],
      {
        zeroForOne: !isNativeToken0,
        amountSpecified: -sellAmount,
        sqrtPriceLimitX96,
      },
      recipient,
    ]);

    const userOps = [
      {
        to: this.memecoinAddress as `0x${string}`,
        value: 0n,
        data: approveData as `0x${string}`,
      },
      {
        to: poolSwapAddress as `0x${string}`,
        value: 0n,
        data: swapData as `0x${string}`,
      },
    ];

    const txHash = await sendCalls(userOps);

    return txHash;
  }

  async getBuybackCharging(): Promise<{
    threshold: bigint;
    progress: number;
    amount0: bigint;
    amount1: bigint;
  }> {
    const positionManager = await this.getPositionManagerContract();

    const poolKey = await positionManager.read('poolKey', {
      _token: this.memecoinAddress,
    });

    const poolFeesResult = await positionManager.read('poolFees', {
      _poolKey: poolKey,
    });

    const current = poolFeesResult.amount0;
    const threshold = BigInt('1000000000000000');
    const progress = threshold > 0n ? Number(current) / Number(threshold) : 0;

    return {
      threshold,
      progress: Math.min(1, Math.max(0, progress)),
      amount0: poolFeesResult.amount0,
      amount1: poolFeesResult.amount1,
    };
  }

  private async getBidWallContract(): Promise<ReadContract<BidWallABI>> {
    if (this.bidWallContract) return this.bidWallContract;

    const positionManager = await this.getPositionManagerContract();
    const bidWallAddress = await positionManager.read('bidWall');

    if (!isAddress(bidWallAddress)) {
      throw new Error('Invalid bid wall address');
    }

    this.bidWallContract = this.drift.contract({
      abi: BidWall,
      address: bidWallAddress,
    });

    return this.bidWallContract;
  }

  async getBidWallInfo(): Promise<{
    cumulativeSwapFees: bigint;
    amount0: bigint;
    amount1: bigint;
    pendingETH: bigint;
  }> {
    const poolId = await this.getPoolId();
    const bidWallContract = await this.getBidWallContract();

    const [poolInfo, position] = await Promise.all([
      bidWallContract.read('poolInfo', {
        _poolId: poolId,
      }),
      bidWallContract.read('position', {
        _poolId: poolId,
      }),
    ]);

    return {
      cumulativeSwapFees: poolInfo.cumulativeSwapFees,
      amount0: position.amount0_,
      amount1: position.amount1_,
      pendingETH: position.pendingEth_,
    };
  }

  async isInFairLaunchWindow(): Promise<boolean> {
    const positionManager = await this.getPositionManagerContract();
    const fairLaunchAddress = await positionManager.read('fairLaunch');

    if (!isAddress(fairLaunchAddress)) {
      throw new Error('Invalid fair launch address');
    }

    const fairLaunchContract = this.drift.contract({
      abi: FairLaunch,
      address: fairLaunchAddress,
    });

    const poolId = await this.getPoolId();
    return fairLaunchContract.read('inFairLaunchWindow', {
      _poolId: poolId,
    });
  }
}
