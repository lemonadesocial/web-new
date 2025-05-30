import { handleOperationWith, signMessageWith } from "@lens-protocol/client/ethers";
import { createAccountWithUsername, fetchAccountsAvailable, fetchFeed, fetchPost, lastLoggedInAccount, post, fetchPosts as lensFetchPosts, fetchPostReferences, fetchAccountGraphStats } from "@lens-protocol/client/actions";
import { account } from "@lens-protocol/metadata";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect } from "react";

import { evmAddress, never, ok, EvmAddress, AnyPost, postId, PostReferenceType } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { toast } from "$lib/components/core/toast";
import { sessionClientAtom, accountAtom, feedAtom, feedPostsAtom, chainsMapAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { client, storageClient } from "$lib/utils/lens/client";
import { LENS_CHAIN_ID } from "$lib/utils/lens/constants";
import { modal } from "$lib/components/core";
import { ClaimUsernameModal } from "$lib/components/features/lens-account/ClaimUsernameModal";

import { useSigner } from "./useSigner";
import { useMe } from "./useMe";
import { useConnectWallet } from "./useConnectWallet";

export function useResumeSession() {
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

  const getAccountAddress = async (): Promise<string> => {
    if (!sessionClient || !address) return '';

    const lastLoggedIn = await lastLoggedInAccount(sessionClient, {
      address: evmAddress(address),
    });

    if (lastLoggedIn.isOk() && lastLoggedIn.value) {
      return lastLoggedIn.value.address;
    }

    const accountsResult = await fetchAccountsAvailable(client, {
      managedBy: address,
      includeOwned: true,
    });

    if (accountsResult.isOk() && accountsResult.value.items.length > 0) {
      return accountsResult.value.items[0].account.address;
    }

    return '';
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!sessionClient || !address || account?.username) return;

      setIsLoading(true);

      try {
        const accountAddress = await getAccountAddress();

        if (!accountAddress) return;

        const result = await fetchAccount(sessionClient, {
          address: accountAddress,
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
  const [sessionClient, setSessionClient] = useAtom(sessionClientAtom);
  const me = useMe();
  const signer = useSigner();

  const [isLoading, setIsLoading] = useState(false);

  const getMetadataUri = async () => {
    if (!me) return;
  
    const metadata = account({
      name: me.display_name || me.name,
      bio: me.description || undefined,
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
    if (feed) return;

    setIsLoading(true);
    try {
      const result = await fetchFeed(sessionClient || client, {
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

export function useFeedPosts(feedId: EvmAddress) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [posts, setPosts] = useAtom(feedPostsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const fetchPostsData = async (refresh = false) => {    
    setIsLoading(true);
    try {
      const result = await lensFetchPosts(sessionClient || client, {
        filter: {
          feeds: [{ feed: feedId }]
        },
        ...(cursor && !refresh ? { cursor } : {})
      });

      if (result.isOk()) {
        const { items, pageInfo } = result.value;
        
        setHasMore(!!pageInfo.next);
        if (pageInfo.next) {
          setCursor(pageInfo.next);
        }
        
        const validPosts = items.filter((post): post is NonNullable<typeof post> => post !== null) as AnyPost[];
        
        if (refresh) {
          setPosts(validPosts);
        } else {
          setPosts(prev => [...prev, ...validPosts]);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData(true);
  }, [sessionClient, feedId]);

  return {
    posts,
    isLoading,
    hasMore,
    loadMore: () => hasMore && !isLoading && fetchPostsData(),
    refresh: () => fetchPostsData(true),
  };
}

type CreatePostParams = {
  metadata: unknown;
  feedAddress?: string;
};

export function usePost() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const setPosts= useSetAtom(feedPostsAtom);

  const createPost = async ({ metadata, feedAddress }: CreatePostParams) => {
    if (!sessionClient || !signer) return;

    setIsLoading(true);
    try {
      const { uri } = await storageClient.uploadAsJson(metadata);

      const result = await post(sessionClient, {
        contentUri: uri,
        ...(feedAddress && { feed: evmAddress(feedAddress) }),
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchPost(sessionClient, { txHash }))
        .andThen((post) => {
          setPosts(prev => [post, ...prev]);
          return ok(post);
        })
        .mapErr((error) => {
          throw error;
        });

      if (result.isErr()) {
        throw new Error("Failed to create post");
      }

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

type UseCommentsProps = {
  postId: string;
  feedAddress?: string;
};

export function useComments({ postId: targetPostId, feedAddress }: UseCommentsProps) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const [comments, setComments] = useState<AnyPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const fetchComments = async (refresh = false) => {
    if (!targetPostId) return;
    
    setIsLoading(true);
    try {
      const result = await fetchPostReferences(client, {
        referencedPost: postId(targetPostId),
        referenceTypes: [PostReferenceType.CommentOn],
        ...(cursor && !refresh ? { cursor } : {})
      });

      if (result.isOk()) {
        const { items, pageInfo } = result.value;
        
        setHasMore(!!pageInfo.next);
        if (pageInfo.next) {
          setCursor(pageInfo.next);
        }
        
        const validComments = items.filter((comment): comment is NonNullable<typeof comment> => 
          comment !== null
        ) as AnyPost[];
        
        if (refresh) {
          setComments(validComments);
        } else {
          setComments(prev => [...prev, ...validComments]);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createComment = async (metadata: unknown) => {
    if (!sessionClient || !signer || !targetPostId) return;

    setIsCreating(true);
    try {
      const { uri: contentUri } = await storageClient.uploadAsJson(metadata);

      const result = await post(sessionClient, {
        contentUri,
        ...(feedAddress && { feed: evmAddress(feedAddress) }),
        commentOn: {
          post: postId(targetPostId),
        },
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchPost(sessionClient, { txHash }))
        .andThen((comment) => {
          setComments(prev => [comment, ...prev]);
          return ok(comment);
        })
        .mapErr((error) => {
          throw error;
        });

      if (result.isErr()) {
        throw new Error("Failed to create comment");
      }

      return result.value;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create comment";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchComments(true);
  }, [targetPostId]);

  return {
    comments,
    isLoading,
    isCreating,
    hasMore,
    loadMore: () => hasMore && !isLoading && fetchComments(),
    refresh: () => fetchComments(true),
    createComment,
  };
}

export function useAccountStats() {
  const [stats, setStats] = useState<{ followers: number; following: number }>({ followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useAccount();

  const fetchStats = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      const result = await fetchAccountGraphStats(client, {
        account: evmAddress(account.address),
      });

      if (result.isOk() && result.value) {
        setStats({
          followers: result.value.followers,
          following: result.value.following,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [account]);

  return {
    stats,
    isLoading,
    refetch: fetchStats,
  };
}

export function useLensAuth() {
  const { account } = useAccount();
  const sessionClient = useAtomValue(sessionClientAtom);
  const chainsMap = useAtomValue(chainsMapAtom);
  const { isReady, connect } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);
  const { logIn } = useLogIn();

  const handleAuth = async (action: () => Promise<void>): Promise<void> => {
    if (account?.username) {
      await action();
      return;
    }

    if (sessionClient) {
      toast.error('You need to claim a username to post');
      modal.open(ClaimUsernameModal);
      return;
    }

    if (isReady) {
      toast.error('Please login to your Lens account to continue');
      await logIn();
      return;
    }

    connect();
  };

  return handleAuth;
}
