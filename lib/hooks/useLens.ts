import { handleOperationWith, signMessageWith } from "@lens-protocol/client/ethers";
import { createAccountWithUsername, fetchAccountsAvailable, fetchFeed, lastLoggedInAccount, post } from "@lens-protocol/client/actions";
import { account, textOnly } from "@lens-protocol/metadata";
import { useAtomValue, useSetAtom } from "jotai";

import { evmAddress, never } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { useAtom } from "jotai";
import { useEffect } from "react";

import { sessionClientAtom, accountAtom, feedAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { client, storageClient } from "$lib/utils/lens/client";

import { useSigner } from "./useSigner";
import { useState } from "react";
import { useMe } from "./useMe";
import { toast } from "$lib/components/core/toast";

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

export function useFeed(feedId: string) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [feed, setFeed] = useAtom(feedAtom);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeedData = async () => {
    if (!sessionClient || feed) return;

    setIsLoading(true);
    try {
      const result = await fetchFeed(sessionClient, {
        feed: feedId,
      });

      if (result.isOk()) {
        setFeed(result.value);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [sessionClient, feedId]);

  return {
    feed,
    isLoading,
    refetch: fetchFeedData,
  };
}

type CreatePostParams = {
  content: string;
  feedAddress?: string;
};

export function usePost() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const [isLoading, setIsLoading] = useState(false);

  const createPost = async ({ content, feedAddress }: CreatePostParams) => {
    if (!sessionClient || !signer) return;

    setIsLoading(true);
    try {
      const metadata = textOnly({
        content,
      });

      const { uri } = await storageClient.uploadAsJson(metadata);

      const result = await post(sessionClient, {
        contentUri: uri,
        ...(feedAddress && { feed: evmAddress(feedAddress) }),
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .mapErr((error) => {
          throw error;
        });

      if (result.isErr()) {
        throw new Error("Failed to create post");
      }

      toast.success("Post created successfully!");
      return result.value;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create post";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPost,
    isLoading,
  };
}
