import { JsonRpcProvider } from 'ethers';
import { createDrift, type Drift, type ReadContract, type Abi } from '@gud/drift';
import { ethersAdapter } from '@gud/drift-ethers';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import ZapContractABI from '$lib/abis/token-launch-pad/FlaunchZap.json';
import FlaunchABI from '$lib/abis/token-launch-pad/Flaunch.json';

export class FlaunchClient {
  private drift: Drift;
  private zapContract: ReadContract<Abi>;
  private flaunchContract: ReadContract<Abi> | null = null;
  private memecoinAddress: string;

  constructor(chain: Chain, memecoinAddress: string) {
    if (!chain.rpc_url) {
      throw new Error('Chain RPC URL is required');
    }
    if (!chain.launchpad_zap_contract_address) {
      throw new Error('Launchpad zap contract address is required');
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
  }

  async getFlaunchAddress(): Promise<string> {
    return (await this.zapContract.read('flaunchContract')) as string;
  }

  async getFlaunchContract(): Promise<ReadContract<Abi>> {
    if (this.flaunchContract) {
      return this.flaunchContract;
    }

    const address = await this.getFlaunchAddress();

    this.flaunchContract = this.drift.contract({
      abi: FlaunchABI.abi as Abi,
      address: address,
    });

    return this.flaunchContract;
  }

  async getTokenId(): Promise<bigint> {
    const flaunchContract = await this.getFlaunchContract();

    const tokenId = await flaunchContract.read('tokenId', {
      _memecoin: this.memecoinAddress 
    } as any);

    return tokenId as bigint;
  }

  async getOwnerOf(): Promise<string> {
    const tokenId = await this.getTokenId();

    const flaunchContract = await this.getFlaunchContract();

    const owner = await flaunchContract.read('ownerOf', { 
      id: tokenId 
    } as any);

    return owner as string;
  }
}
