import { Eip1193Provider, ethers } from 'ethers';

import { useAppKitAccount, useAppKitProvider } from '$lib/utils/appkit';
import { defaultClient } from '$lib/graphql/request/instances';
import { GetUserWalletRequestDocument } from '$lib/graphql/generated/backend/graphql';

export function useSignWallet() {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const signWallet = async () => {
    if (!walletProvider || !address) {
      throw new Error('Could not find wallet provider');
    }

    const { data } = await defaultClient.query({
      query: GetUserWalletRequestDocument,
      variables: {
        wallet: address,
      },
    });
  
    const provider = new ethers.BrowserProvider(walletProvider as Eip1193Provider);

    if (!data?.getUserWalletRequest) {
      throw new Error('Could not find wallet request');
    }

    const signature = await provider.send('personal_sign', [
      ethers.hexlify(ethers.toUtf8Bytes(data.getUserWalletRequest.message)),
      address,
    ]);

    return { signature, token: data.getUserWalletRequest.token };
  };

  return signWallet;
}
