import { signMessageWith } from "@lens-protocol/client/ethers";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { useAtomValue, useSetAtom } from "jotai";

import { evmAddress } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { sessionClientAtom, accountAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { client } from "$lib/utils/lens/client";

import { useSigner } from "./useSigner";
import { useState } from "react";

export function useResumeSession() {
  const signer = useSigner();
  const setSessionClient = useSetAtom(sessionClientAtom);

  const [isLoading, setIsLoading] = useState(false);

  const resumeSession = async () => {
    if (!signer) return;

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
      try {
        const result = await fetchAccount(client, {
          address: evmAddress(address),
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
