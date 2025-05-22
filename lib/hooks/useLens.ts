import { handleOperationWith, signMessageWith } from "@lens-protocol/client/ethers";
import { createAccountWithUsername, fetchAccountsAvailable, lastLoggedInAccount } from "@lens-protocol/client/actions";
import { MetadataAttributeType, account } from "@lens-protocol/metadata";
import { useAtomValue, useSetAtom } from "jotai";

import { evmAddress, never } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { sessionClientAtom, accountAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { client, storageClient } from "$lib/utils/lens/client";

import { useSigner } from "./useSigner";
import { useState } from "react";
import { useMe } from "./useMe";

export function useResumeSession() {
  const signer = useSigner();
  const setSessionClient = useSetAtom(sessionClientAtom);

  const [isLoading, setIsLoading] = useState(false);

  const resumeSession = async () => {
    setIsLoading(true);
  
    try {
      const resumed = await client.resumeSession();
      if (resumed.isErr()) return;
      setSessionClient(resumed.value);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    resumeSession,
  }
}

export function useLogIn() {
  const { address } = useAppKitAccount();
  const signer = useSigner();
  const setSessionClient = useSetAtom(sessionClientAtom);

  const [isLoading, setIsLoading] = useState(false);

  const logIn = async () => {
    if (!signer) return;

    setIsLoading(true);
    try {
      const accountsResult = await fetchAccountsAvailable(client, {
        managedBy: address,
        includeOwned: true,
      });
      if (accountsResult.isErr()) return;

      const { items } = accountsResult.value;

      if (items.length) {
        const loginAs =
          items[0].__typename === 'AccountOwned'
            ? {
              accountOwner: {
                owner: address,
                account: items[0].account.address,
              },
            }
            : {
              accountManager: {
                manager: address,
                account: items[0].account.address,
              },
            };
      
        const loginResult = await client.login({
          ...loginAs,
          signMessage: signMessageWith(signer),
        });

        if (!loginResult.isErr()) {
          setSessionClient(loginResult.value);
        }

        return;
      }

      const onboardingResult = await client.login({
        onboardingUser: {
          app: process.env.NEXT_PUBLIC_LENS_APP_ID,
          wallet: signer.address,
        },
        signMessage: signMessageWith(signer),
      });

      if (!onboardingResult.isErr()) {
        setSessionClient(onboardingResult.value);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    logIn,
  }
}

export function useAccount() {
  const { address } = useAppKitAccount();
  const sessionClient = useAtomValue(sessionClientAtom);
  const [account, setAccount] = useAtom(accountAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!sessionClient || !address) return;

      setIsLoading(true);

      const lastLoggedIn = await lastLoggedInAccount(sessionClient, {
        address: evmAddress(address),
      });

      try {
        const result = await fetchAccount(sessionClient, {
          address: lastLoggedIn.isOk() && lastLoggedIn.value ? lastLoggedIn.value.address : evmAddress(address),
        });

        if (result.isErr()) return;

        setAccount(result.value);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, [sessionClient, address]);

  return {
    account,
    isLoading,
  };
}

export function useClaimUsername() {
  const { address } = useAppKitAccount();
  const [sessionClient, setSessionClient] = useAtom(sessionClientAtom);
  const me = useMe();
  const signer = useSigner();

  const [isLoading, setIsLoading] = useState(false);

  const getMetadataUri = async () => {
    if (!me) return;
  
    const metadata = account({
      name: me.display_name || me.name,
      bio: me.description ?? undefined,
    });
    
    const { uri } = await storageClient.uploadAsJson(metadata);
    
    return uri;
  }

  const claimUsername = async (username: string) => {
    if (!sessionClient || !signer) return;

    try {
      setIsLoading(true);

      const uri = await getMetadataUri();

      const created = await createAccountWithUsername(sessionClient, {
        metadataUri: uri,
        username: {
          localName: username,
          // namespace: process.env.NEXT_PUBLIC_LENS_NAMESPACE ? evmAddress(process.env.NEXT_PUBLIC_LENS_NAMESPACE) : undefined,
        },
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
        .andThen((account) =>
          sessionClient.switchAccount({
            account: account?.address ?? never("Account not found"),
          })
        ).mapErr((error) => {
          throw error;
        });

      if (created.isErr()) return;

      setSessionClient(created.value);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    claimUsername,
    isLoading,
  }
}
