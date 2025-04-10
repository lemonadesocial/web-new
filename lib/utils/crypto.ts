import { getDefaultStore } from 'jotai';
import { Eip1193Provider, ethers } from 'ethers';

import { listChainsAtom } from '$lib/jotai';

import ERC20 from '$lib/abis/ERC20.json';
import LemonadeRelayPayment from '$lib/abis/LemonadeRelayPayment.json';
import LemonadeStakePayment from '$lib/abis/LemonadeStakePayment.json';

export const ERC20Contract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(ERC20));
export const LemonadeRelayPaymentContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonadeRelayPayment.abi));
export const LemonadeStakePaymentContract = new ethers.Contract(ethers.ZeroAddress, new ethers.Interface(LemonadeStakePayment.abi));

export function getListChains() {
  return getDefaultStore().get(listChainsAtom);
}

export function formatWallet(address: string, length = 4): string {
  if (address.length < length * 2) return address;

  return `${address.substring(0, length)}...${address.substring(address.length - length, address.length)}`;
}

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
  const tx = await contract.getFunction(functionName)(...args, { ...txOptions, gasLimit });
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
