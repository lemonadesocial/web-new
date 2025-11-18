import { createKernelAccount } from '@zerodev/sdk';
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants';
import { WebAuthnMode, toWebAuthnKey } from '@zerodev/webauthn-key';
import {
  WeightedSigner,
  WeightedValidatorContractVersion,
  createWeightedKernelAccountClient,
  createWeightedValidator,
  toECDSASigner,
  toWebAuthnSigner,
} from '@zerodev/weighted-validator';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { PublicClient, createPublicClient, http, type EIP1193Provider, type Chain as ViemChain } from 'viem';
import { useAccount } from 'wagmi';

import { Button, useModal } from '$lib/components/core';
import { type Chain } from '$lib/graphql/generated/backend/graphql';
import { useListChains } from '$lib/hooks/useListChains';
import { listChainsAtom } from '$lib/jotai';

const entryPoint = getEntryPoint('0.7');
const kernelVersion = KERNEL_V3_1;
const validatorContractVersion = WeightedValidatorContractVersion.V0_0_2_PATCHED;

const BUNDLER_URL = 'https://rpc.zerodev.app/api/v3/7fa4f613-d955-4964-91d4-3c73010f2bbc/chain/84532'; //-- add to secret?
const PASSKEY_SERVER_URL = 'https://passkeys.zerodev.app/api/v3/7fa4f613-d955-4964-91d4-3c73010f2bbc';

const createAccount = async (chain: ViemChain, client: PublicClient, signer: WeightedSigner, publicKeys: string[]) => {
  console.log('publicKeys', publicKeys);
  
  const multiSigValidator = await createWeightedValidator(client, {
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

  const account = await createKernelAccount(client, {
    entryPoint,
    kernelVersion,
    plugins: {
      sudo: multiSigValidator,
    },
  });

  console.log('account', account.address);

  return createWeightedKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(BUNDLER_URL),
  });
};

const getViemChain = (chain: Chain): ViemChain | undefined => {
  const token = chain.tokens?.[0];
  if (!token) {
    return undefined;
  }

  return {
    id: Number(chain.chain_id),
    name: chain.name,
    rpcUrls: {
      default: {
        http: [chain.rpc_url],
      },
    },
    nativeCurrency: {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    },
  };
};

const getPublicClient = (chain: Chain) => {
  const viemChain = getViemChain(chain);

  if (!viemChain) return {};

  const publicClient = createPublicClient({
    transport: http(chain.rpc_url),
    chain: viemChain,
  });

  return { viemChain, publicClient };
};

function CreateSmartAccountModal() {
  const account = useAccount();
  const chainsLoading = useListChains();
  const chains = useAtomValue(listChainsAtom);
  const zerodevChains = chains.filter((chain) => chain.is_zerodev_compatible);

  const [chain, setChain] = useState<Chain>();

  const createWithWallet = async () => {
    if (!chain) {
      alert('Chain not selected. Please select a chain.');
      return;
    }

    const { viemChain, publicClient } = getPublicClient(chain);

    if (!viemChain || !publicClient) {
      alert('Public client not available. Please select a chain.');
      return;
    }

    if (!account.address) {
      //-- todo show connect popup
      alert('Please connect your wallet.');
      return;
    }

    if (!account.connector) {
      alert('Wallet connector not available. Please connect your wallet.');
      return;
    }

    // Get the provider from the connector
    const provider = await account.connector.getProvider();

    if (!provider) {
      alert('Provider not available. Please connect your wallet.');
      return;
    }

    const ecdsaSigner = await toECDSASigner({
      signer: provider as EIP1193Provider,
    });

    console.log('ecdsaSigner', ecdsaSigner.getPublicKey());

    const smartAccount = await createAccount(viemChain, publicClient, ecdsaSigner, [account.address]);
  };

  const createWithPasskey = async () => {
    if (!chain) {
      alert('Chain not selected. Please select a chain.');
      return;
    }

    const { viemChain, publicClient } = getPublicClient(chain);

    if (!viemChain || !publicClient) {
      alert('Public client not available. Please select a chain.');
      return;
    }

    const passkeyName = 'Lemonade Smart Account';
    const mode = WebAuthnMode.Login; // can also be "login" if you are using an existing key

    const webAuthnKey = await toWebAuthnKey({
      passkeyName,
      passkeyServerUrl: PASSKEY_SERVER_URL,
      mode,
      passkeyServerHeaders: {},
    });

    const signer = await toWebAuthnSigner(publicClient, {
      webAuthnKey,
    });

    const smartAccount = await createAccount(viemChain, publicClient, signer, [signer.getPublicKey()]);
  };

  useEffect(() => {
    if (!chainsLoading && zerodevChains.length > 0 && !chain) {
      setChain(zerodevChains[0]);
    }
  }, [chain, chainsLoading, zerodevChains]);

  return (
    <div style={{ padding: 21, display: 'flex', flexDirection: 'column', gap: 21 }}>
      <select
        onChange={(e) => {
          console.log('chain id here', e.target.value);
          setChain(chains.find((chain) => chain.chain_id === e.target.value));
        }}
      >
        {zerodevChains.map((chain) => (
          <option key={chain.chain_id} value={chain.chain_id}>
            {chain.name}
          </option>
        ))}
      </select>
      <Button onClick={createWithWallet}>Use my wallet</Button>
      <Button onClick={createWithPasskey}>Use my passkey</Button>
    </div>
  );
}

export function CreateSmartAccount() {
  const modal = useModal();

  if (!modal) {
    return null;
  }

  return <Button onClick={() => modal.open(CreateSmartAccountModal)}>Create Smart Account</Button>;
}
