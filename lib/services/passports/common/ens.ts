import * as ethers from 'ethers';
import { mainnet } from 'viem/chains';

export const getEnsUsername = async (wallet: string) => {
  const provider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);

  // Use lookup to get ENS name from wallet address
  const ensName = await provider.lookupAddress(wallet);

  if (!ensName) {
    throw new Error('Failed to get ENS username');
  }

  return `@${ensName}`;
}
