import { Eip1193Provider, ethers } from 'ethers';

import { appKit } from '$lib/utils/appkit';

import { getUserWalletRequest } from "../services/auth/wallet";

export function useSignWallet() {
  const signWallet = async () => {
    const walletProvider = appKit.getProvider('eip155');
    const address = appKit.getAddress();

    if (!walletProvider || !address) {
      throw new Error('Could not find wallet provider');
    }

    const { message, token } = await getUserWalletRequest(address);
    const provider = new ethers.BrowserProvider(walletProvider as Eip1193Provider);

    const signature = await provider.send('personal_sign', [
      ethers.hexlify(ethers.toUtf8Bytes(message)),
      address,
    ]);

    return { signature, token };
  };

  return signWallet;
}
