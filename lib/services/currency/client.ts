import { createDrift, type Drift, type ReadContract } from '@gud/drift';
import { viemAdapter } from '@gud/drift-viem';
import { createPublicClient, http } from 'viem';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { ERC20 } from '$lib/abis/ERC20';
import { getViemChainConfig } from '$lib/utils/crypto';

type ERC20ABI = typeof ERC20;

export class CurrencyClient {
  private chain: Chain;
  private tokenAddress: string;
  private drift: Drift | null = null;
  private erc20Contract: ReadContract<ERC20ABI> | null = null;

  constructor(chain: Chain, tokenAddress: string) {
    this.chain = chain;
    this.tokenAddress = tokenAddress;
  }

  private getTokenFromChain(): { symbol: string; decimals: number } | null {
    const token = this.chain.tokens?.find(
      (t) => t.contract?.toLowerCase() === this.tokenAddress.toLowerCase()
    );

    if (!token) return null;

    return { symbol: token.symbol, decimals: token.decimals };
  }

  private getDrift(): Drift {
    if (!this.drift) {
      if (!this.chain.rpc_url) {
        throw new Error('Chain RPC URL is required');
      }

      const viemChain = getViemChainConfig(this.chain);
      const publicClient = createPublicClient({
        chain: viemChain,
        transport: http(this.chain.rpc_url),
      });
      this.drift = createDrift({
        adapter: viemAdapter({ publicClient }),
      });
    }

    return this.drift;
  }

  private getErc20Contract(): ReadContract<ERC20ABI> {
    if (!this.erc20Contract) {
      const drift = this.getDrift();
      this.erc20Contract = drift.contract({
        abi: ERC20,
        address: this.tokenAddress,
      });
    }

    return this.erc20Contract;
  }

  async getSymbol(): Promise<string> {
    const fromChain = this.getTokenFromChain();

    if (fromChain) return fromChain.symbol;

    const contract = this.getErc20Contract();

    return contract.read('symbol') as Promise<string>;
  }

  async getDecimals(): Promise<number> {
    const fromChain = this.getTokenFromChain();

    if (fromChain) return fromChain.decimals;

    const contract = this.getErc20Contract();
    const decimals = await contract.read('decimals');

    return Number(decimals);
  }
}
