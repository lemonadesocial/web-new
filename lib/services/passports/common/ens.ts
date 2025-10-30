import * as ethers from 'ethers';

export const getEnsUsername = async (wallet: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_PROVIDER);

  // Use lookup to get ENS name from wallet address
  const ensName = await provider.lookupAddress(wallet);

  if (!ensName) {
    throw new Error('Failed to get ENS username');
  }

  return `@${ensName}`;
}
