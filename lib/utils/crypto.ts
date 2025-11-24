import { getDefaultStore } from 'jotai';
import { Eip1193Provider, ethers, isError } from 'ethers';
import { mainnet } from 'viem/chains';

import { chainsMapAtom, listChainsAtom } from '$lib/jotai';

import ERC20 from '$lib/abis/ERC20.json';
import LemonadeRelayPayment from '$lib/abis/LemonadeRelayPayment.json';
import LemonadeStakePayment from '$lib/abis/LemonadeStakePayment.json';
import ERC721 from '$lib/abis/ERC721.json'; 
import LemonheadNFT from '$lib/abis/LemonheadNFT.json';
import LemonadePassport from '$lib/abis/LemonadePassport.json';
import { TRPCClientError } from '@trpc/client';
import ZugramaPassport from '$lib/abis/ZuGramaPassport.json';
import { Chain } from '$lib/graphql/generated/backend/graphql';

export const ERC20Contract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(ERC20));
export const ERC721Contract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(ERC721));
export const LemonadeRelayPaymentContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonadeRelayPayment.abi));
export const LemonadeStakePaymentContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonadeStakePayment.abi));
export const LemonheadNFTContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonheadNFT.abi));
export const LemonadePassportContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonadePassport.abi));
export const ZugramaPassportContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(ZugramaPassport.abi));

export function getListChains() {
  return getDefaultStore().get(listChainsAtom);
}

export function getChain(network: string) {
  return getDefaultStore().get(chainsMapAtom)[network];
}

export function formatWallet(address: string, length = 4): string {
  if (address.length < length * 2) return address;

  return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`;
}

export const isNativeToken = (tokenAddress: string, network: string) => {
  const chain = getListChains().find(c => c.chain_id === network);
  const token = chain?.tokens?.find(t => t.contract === tokenAddress);
  return token?.is_native;
};

export async function writeContract(
  contractInstance: ethers.Contract,
  contractAddress: string,
  provider: Eip1193Provider,
  functionName: string,
  args: any[],
  txOptions: Record<string, any> = {}
): Promise<any> {
  const browserProvider = new ethers.BrowserProvider(provider);
  const signer = await browserProvider.getSigner();
  const contract = contractInstance.attach(contractAddress).connect(signer);
  const gasLimit = await contract.getFunction(functionName).estimateGas(...args, txOptions);
  
  const data = contract.interface.encodeFunctionData(functionName, args);
  
  const tx = await signer.sendTransaction({
    to: contractAddress,
    data: ethers.hexlify(data),
    gasLimit,
    ...txOptions
  });
  
  return tx;
}

export async function approveERC20Spender(tokenAddress: string, spender: string, amount: bigint, walletProvider: Eip1193Provider) {
  const transaction = await writeContract(
    ERC20Contract,
    tokenAddress,
    walletProvider,
    'approve',
    [spender, amount]
  );

  await transaction.wait();
}

export async function transfer(toAddress: string, amount: string, tokenAddress: string, walletProvider: Eip1193Provider, network: string) {
  try {
    if (!isNativeToken(tokenAddress, network)) {
      const transaction = await writeContract(
        ERC20Contract,
        tokenAddress,
        walletProvider,
        'transfer',
        [toAddress, amount]
      );

      return transaction.hash;
    }

    const browserProvider = new ethers.BrowserProvider(walletProvider);
    const signer = await browserProvider.getSigner();
    const fromAddress = await signer.getAddress();
    const txDetails = {
      from: fromAddress,
      to: toAddress,
      value: amount,
      data: '0x'
    };

    const gasLimit = await browserProvider.estimateGas(txDetails);

    const transaction = await signer.sendTransaction({
      ...txDetails,
      gasLimit
    });

    return transaction.hash;
  } catch (err: any) {
    if (err.transactionHash) return err.transactionHash; // workaround for Rainbow
    throw err;
  }
};

export function formatError(error: any): string {
  if (isError(error, 'ACTION_REJECTED')) {
    return 'Transaction was rejected by user';
  }

  if (isError(error, 'INSUFFICIENT_FUNDS')) {
    return 'Insufficient funds to complete transaction';
  }

  if (isError(error, 'NETWORK_ERROR')) {
    return 'Network error. Please check your connection and try again';
  }

  if (isError(error, 'TIMEOUT')) {
    return 'Transaction timed out. Please try again';
  }

  if (isError(error, 'CALL_EXCEPTION')) {
    return 'Transaction failed. Please check your inputs and try again';
  }

  if (isError(error, 'NONCE_EXPIRED')) {
    return 'Transaction nonce expired. Please try again';
  }

  if (isError(error, 'REPLACEMENT_UNDERPRICED')) {
    return 'Transaction replacement under-priced. Please try again with higher gas';
  }

  if (isError(error, 'UNSUPPORTED_OPERATION')) {
    return 'Operation not supported. Please try a different approach';
  }

  if (isError(error, 'INVALID_ARGUMENT')) {
    return 'Invalid input provided. Please check your parameters';
  }

  if (isError(error, 'SERVER_ERROR')) {
    return 'Server error occurred. Please try again later';
  }

  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('user rejected') || message.includes('user denied')) {
      return 'Transaction was rejected by user';
    }
    
    if (message.includes('insufficient funds')) {
      return 'Insufficient funds to complete transaction';
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Network error. Please check your connection and try again';
    }
    
    if (message.includes('timeout')) {
      return 'Transaction timed out. Please try again';
    }
    
    if (message.includes('gas') && message.includes('limit')) {
      return 'Gas limit exceeded. Please try again with higher gas limit';
    }
    
    if (message.includes('nonce')) {
      return 'Transaction nonce error. Please try again';
    }
  }

  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again';
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
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    const erc165Contract = new ethers.Contract(contractAddress, ERC165_ABI, provider);
    const ERC721_INTERFACE_ID = '0x80ac58cd';
    const isERC721 = await erc165Contract.supportsInterface(ERC721_INTERFACE_ID);

    if (isERC721) {
      const erc721Contract = new ethers.Contract(contractAddress, ERC721, provider);
      try {
        const symbol = await erc721Contract.symbol();

        return { type: ContractType.ERC721, symbol };
      } catch {
        return { type: ContractType.ERC721 };
      }
    }
  } catch {
  }

  try {
    const erc20Contract = new ethers.Contract(contractAddress, ERC20, provider);

    await Promise.all([
      erc20Contract.totalSupply().catch(() => { throw new Error('Not ERC20: totalSupply failed'); }),
      erc20Contract.balanceOf(ethers.ZeroAddress).catch(() => { throw new Error('Not ERC20: balanceOf failed'); })
    ]);

    const [symbol, decimals] = await Promise.all([
      erc20Contract.symbol(),
      erc20Contract.decimals()
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

export const MainnetRpcProvider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]); 

export const getTransactionUrl = (chain: Chain, txHash: string) => {
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
