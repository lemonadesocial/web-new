import { getDefaultStore } from 'jotai';
import { createPublicClient, createWalletClient, custom, http, type Address, type EIP1193Provider as ViemEIP1193Provider, type PublicClient, type WalletClient } from 'viem';
import { mainnet } from 'viem/chains';
import { chainsMapAtom, listChainsAtom } from '$lib/jotai';
import { DEFAULT_GAS_LIMIT, GAS_LIMIT_BY_CHAIN_ID, MEGAETH_CHAIN_ID } from '$lib/utils/constants';

import ERC20 from '$lib/abis/ERC20.json';
import ERC721 from '$lib/abis/ERC721.json'; 
import { Chain as BackendChain } from '$lib/graphql/generated/backend/graphql';

export function getListChains() {
  return getDefaultStore().get(listChainsAtom);
}

export function getChain(network: string) {
  return getDefaultStore().get(chainsMapAtom)[network];
}

export function getViemChainConfig(chain: BackendChain) {
  const nativeToken = chain.tokens?.[0];

  return {
    id: Number(chain.chain_id),
    name: chain.name,
    nativeCurrency: {
      name: nativeToken?.name || 'Ether',
      symbol: nativeToken?.symbol || 'ETH',
      decimals: nativeToken?.decimals || 18
    },
    rpcUrls: {
      default: {
        http: [chain.rpc_url]
      }
    }
  };
}

export async function createViemClients(chainId: string | number, walletProvider: ViemEIP1193Provider) {
  const chain = getChain(chainId.toString());

  if (!chain || !chain.rpc_url) {
    throw new Error(`Chain ${chainId} configuration not found`);
  }

  const viemChain = getViemChainConfig(chain);

  const walletClient = createWalletClient({
    chain: viemChain,
    transport: custom(walletProvider),
  });

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(chain.rpc_url),
  });

  const [account] = await walletClient.getAddresses();

  return { walletClient, publicClient, account, chain };
}

export function formatWallet(address: string, length = 4): string {
  if (address.length < length * 2) return address;

  return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`;
}

export const isNativeToken = (tokenAddress: string, network: string) => {
  const chain = getListChains().find(c => c.chain_id === network);
  const token = chain?.tokens?.find(t => t.contract === tokenAddress);
  return token?.is_native || tokenAddress.toLowerCase() === zeroAddress;
};

export function getGasLimit(chainId: number): bigint {
  return GAS_LIMIT_BY_CHAIN_ID[chainId] ?? DEFAULT_GAS_LIMIT;
}

export function getGasOptionsByChainId(chainId: string | number): { gas: bigint } {
  return { gas: getGasLimit(Number(chainId)) };
}

type BalanceParams = {
  publicClient: PublicClient;
  tokenAddress: string;
  chainId: string;
  account: Address;
};

export async function getBalance({
  publicClient,
  tokenAddress,
  chainId,
  account
}: BalanceParams): Promise<bigint> {
  if (isNativeToken(tokenAddress, chainId)) {
    return publicClient.getBalance({ address: account });
  }

  const erc20Balance = await publicClient.readContract({
    abi: ERC20,
    address: tokenAddress as Address,
    functionName: 'balanceOf',
    args: [account]
  });

  return erc20Balance as bigint;
}

export async function checkBalanceSufficient(
  params: BalanceParams & { amount: bigint }
): Promise<void> {
  const { amount, ...balanceParams } = params;
  const balance = await getBalance(balanceParams);

  if (balance < amount) {
    throw new Error('insufficient funds');
  }
}

type ApproveERC20Params = {
  walletClient: WalletClient;
  tokenAddress: Address;
  spender: Address;
  amount: bigint;
  account: Address;
};

export async function approveERC20Spender({
  walletClient,
  tokenAddress,
  spender,
  amount,
  account,
}: ApproveERC20Params) {
  await walletClient.writeContract({
    abi: ERC20,
    address: tokenAddress,
    functionName: 'approve',
    args: [spender, amount],
    account,
    chain: walletClient.chain,
  });
}

export enum ContractType {
  ERC20 = 'ERC-20',
  ERC721 = 'ERC-721',
  UNKNOWN = 'UNKNOWN'
}

const ERC165_ABI = [
  'function supportsInterface(bytes4 interfaceId) view returns (bool)'
];

export async function getContractType(
  contractAddress: string,
  rpcUrl: string
): Promise<{ type: ContractType; symbol?: string; decimals?: number; }> {
  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  try {
    const ERC721_INTERFACE_ID = '0x80ac58cd';
    const isERC721 = await publicClient.readContract({
      address: contractAddress as Address,
      abi: ERC165_ABI,
      functionName: 'supportsInterface',
      args: [ERC721_INTERFACE_ID],
    });

    if (isERC721) {
      try {
        const symbol = await publicClient.readContract({
          address: contractAddress as Address,
          abi: ERC721,
          functionName: 'symbol',
        });

        return { type: ContractType.ERC721, symbol: String(symbol) };
      } catch {
        return { type: ContractType.ERC721 };
      }
    }
  } catch {
  }

  try {
    await Promise.all([
      publicClient.readContract({
        address: contractAddress as Address,
        abi: ERC20,
        functionName: 'totalSupply',
      }).catch(() => { throw new Error('Not ERC20: totalSupply failed'); }),
      publicClient.readContract({
        address: contractAddress as Address,
        abi: ERC20,
        functionName: 'balanceOf',
        args: [ethers.ZeroAddress],
      }).catch(() => { throw new Error('Not ERC20: balanceOf failed'); })
    ]);

    const [symbol, decimals] = await Promise.all([
      publicClient.readContract({
        address: contractAddress as Address,
        abi: ERC20,
        functionName: 'symbol',
      }),
      publicClient.readContract({
        address: contractAddress as Address,
        abi: ERC20,
        functionName: 'decimals',
      }),
    ]);

    return { type: ContractType.ERC20, symbol, decimals: Number(decimals) };
  } catch {
    return { type: ContractType.UNKNOWN };
  }
}

export function multiplyByPowerOf10(amount: string, power: number) {
  const [integerPart, decimalPart = ''] = amount.split('.');

  const combined = integerPart + decimalPart;
  const decimalLength = decimalPart.length;

  const totalPower = power - decimalLength;

  const result = BigInt(combined) * (BigInt(10) ** BigInt(totalPower));

  return result.toString();
}

export const MainnetRpcProvider = createPublicClient({
  chain: mainnet,
  transport: http('https://eth-mainnet.public.blastapi.io'),
});

export const getTransactionUrl = (chain: BackendChain, txHash: string) => {
  if (!chain?.block_explorer_url || !chain?.block_explorer_for_tx) {
    return '';
  }

  const pathTemplate = chain.block_explorer_for_tx.includes('${hash}')
    ? chain.block_explorer_for_tx.replaceAll('${hash}', txHash)
    : `${chain.block_explorer_for_tx}${txHash}`;

  const baseUrl = chain.block_explorer_url.endsWith('/')
    ? chain.block_explorer_url.slice(0, -1)
    : chain.block_explorer_url;

  const path = pathTemplate.startsWith('/')
    ? pathTemplate
    : `/${pathTemplate}`;

  return `${baseUrl}${path}`;
};

export const getAddressUrl = (chain: BackendChain, address: string) => {
  if (!chain?.block_explorer_url || !chain?.block_explorer_for_address) {
    return '';
  }

  const pathTemplate = chain.block_explorer_for_address.includes('${address}')
    ? chain.block_explorer_for_address.replaceAll('${address}', address)
    : `${chain.block_explorer_for_address}${address}`;

  const baseUrl = chain.block_explorer_url.endsWith('/')
    ? chain.block_explorer_url.slice(0, -1)
    : chain.block_explorer_url;

  const path = pathTemplate.startsWith('/')
    ? pathTemplate
    : `/${pathTemplate}`;

  return `${baseUrl}${path}`;
};
