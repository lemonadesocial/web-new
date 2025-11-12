import { createKernelAccount } from '@zerodev/sdk';
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants';
import { WeightedValidatorContractVersion, createWeightedValidator, createWeightedKernelAccountClient, toECDSASigner, WeightedSigner } from '@zerodev/weighted-validator';
import { createPublicClient, http, type EIP1193Provider } from 'viem';
import { baseSepolia, base } from 'viem/chains';
import { useAccount } from "wagmi";

import { Button, useModal } from '$lib/components/core';

const entryPoint = getEntryPoint('0.7');
const kernelVersion = KERNEL_V3_1;
const validatorContractVersion = WeightedValidatorContractVersion.V0_0_2_PATCHED;
const chain = base;
const BUNDLER_URL = 'https://rpc.zerodev.app/api/v3/7fa4f613-d955-4964-91d4-3c73010f2bbc/chain/84532'; //-- add to secret?

const publicClient = createPublicClient({
  transport: http(),
  chain,
});

const createAccount = async (signer: WeightedSigner, publicKeys: string[]) => {
  const multiSigValidator = await createWeightedValidator(publicClient, {
    entryPoint,
    kernelVersion,
    validatorContractVersion,
    signer,
    config: {
      threshold: 100,
      signers: publicKeys.map((key) => ({
        publicKey: key,
        weight: 100,
      })),
    },
  });

  const account = await createKernelAccount(publicClient, {
    entryPoint,
    kernelVersion,
    plugins: {
      sudo: multiSigValidator,
    },
  });

  const client = createWeightedKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(BUNDLER_URL),
  });

  return client;
};

function CreateSmartAccountModal() {
  const account = useAccount();
  
  const createWithWallet = async ()=>{
    if(!account.address){
      //-- todo show connect popup
      return;
    }

    if(!account.connector){
      alert('Wallet connector not available. Please connect your wallet.');
      return;
    }

    // Get the provider from the connector
    const provider = await account.connector.getProvider();

    if(!provider){
      alert('Provider not available. Please connect your wallet.');
      return;
    }
    
    const ecdsaSigner = await toECDSASigner({
      signer: provider as EIP1193Provider,
    });

    const smartAccount = await createAccount(ecdsaSigner, [account.address]);

    console.log("smartAccount address", smartAccount.account.address);
  }

  return (
    <div style={{ padding: 21, display: 'flex', flexDirection: 'column', gap: 21 }}>
      <Button onClick={createWithWallet}>Use my wallet</Button>
      <Button>Use my passkey</Button>
      <Button>Use social accounts</Button>
    </div>
  );
}

export function CreateSmartAccount() {
  const modal = useModal();

  if (!modal){
    return null;
  }

  return <Button onClick={() => modal.open(CreateSmartAccountModal)}>Create Smart Account</Button>;
}
