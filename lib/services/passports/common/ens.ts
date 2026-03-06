import { createPublicClient, http, type Address } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(mainnet.rpcUrls.default.http[0]),
});

export const getEnsUsername = async (wallet: string) => {
  const ensName = await publicClient.getEnsName({ address: wallet as Address });

  if (!ensName) {
    throw new Error('Failed to get ENS username');
  }

  return `@${ensName}`;
}
