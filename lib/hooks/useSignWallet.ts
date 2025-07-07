import { Eip1193Provider, ethers } from 'ethers';

import { appKit } from '$lib/utils/appkit';
import { request } from '$lib/utils/request';

export function useSignWallet() {
  const signWallet = async () => {
    const walletProvider = appKit.getProvider('eip155');
    const address = appKit.getAddress();
    
    if (!walletProvider || !address) {
      throw new Error('Could not find wallet provider');
    }

    const { message, token } = await request<{ message: string; token: string }>(
      `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/wallet?${new URLSearchParams({ wallet: address })}`,
    );
    const provider = new ethers.BrowserProvider(walletProvider as Eip1193Provider);

    const signature = await provider.send('personal_sign', [
      ethers.hexlify(ethers.toUtf8Bytes(message)),
      address,
    ]);

    return { signature, token };
  };

  return signWallet;
}
