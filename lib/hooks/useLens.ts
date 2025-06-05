import { handleOperationWith, signMessageWith } from "@lens-protocol/client/ethers";
import { createAccountWithUsername, fetchAccountsAvailable, fetchFeed, fetchPost, lastLoggedInAccount, post, fetchPosts as lensFetchPosts, fetchPostReferences, fetchAccountGraphStats } from "@lens-protocol/client/actions";
import { AccountMetadata } from "@lens-protocol/metadata";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect, useCallback } from "react";

import { evmAddress, never, ok, AnyPost, postId, PostReferenceType } from "@lens-protocol/client";
import { fetchAccount } from "@lens-protocol/client/actions";
import { toast } from "$lib/components/core/toast";
import { sessionClientAtom, accountAtom, feedAtom, feedPostsAtom, chainsMapAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { client, storageClient } from "$lib/utils/lens/client";
import { LENS_CHAIN_ID } from "$lib/utils/lens/constants";
import { modal } from "$lib/components/core";

import { useSigner } from "./useSigner";
import { useConnectWallet } from "./useConnectWallet";
import { SelectProfileModal } from "$lib/components/features/lens-account/SelectProfileModal";
import { LEMONADE_FEED_ADDRESS } from "$lib/utils/constants";

export function useResumeSession() {
  const setSessionClient = useSetAtom(sessionClientAtom);
  const setAccount = useSetAtom(accountAtom);
  const { address } = useAppKitAccount();

  const [isLoading, setIsLoading] = useState(false);

  const resumeSession = async () => {
    if (!address) return;
  
    try {
      setIsLoading(true);
      const resumed = await client.resumeSession();
    
      if (resumed.isErr()) {
        setIsLoading(false);
        return;
      }

      setSessionClient(resumed.value);

      const lastLoggedIn = await lastLoggedInAccount(resumed.value, {
        address: evmAddress(address),
      });
  
      if (lastLoggedIn.isErr()) {
        setIsLoading(false);
        return;
      }

      const result = await fetchAccount(resumed.value, {
        address: lastLoggedIn.value?.address ?? never("Account not found"),
      });

      if (result.isErr()) return;

      setAccount(result.value);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    resumeSession();
  }, [address]);

  return {
    isLoading,
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

export function useLogOut() {
  const [sessionClient, setSessionClient] = useAtom(sessionClientAtom);
  const setAccount = useSetAtom(accountAtom);

  const logOut = async () => {
    setAccount(null);
    await sessionClient?.logout();
    setSessionClient(null);
  }

  return {
    logOut,
  }
}

export function useAccount() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [account, setAccount] = useAtom(accountAtom);
  const [isLoading, setIsLoading] = useState(false);

  const myAccount = useAtomValue(accountAtom);

  const refreshAccount = useCallback(async () => {
    if (!sessionClient || !myAccount?.address) return;

    setIsLoading(true);
    try {
      const result = await fetchAccount(sessionClient, { address: myAccount.address });
      if (result.isOk()) {
        setAccount(result.value);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionClient, myAccount?.address, setAccount]);

  return {
    account,
    refreshAccount,
    isLoading,
  };
}

export function useClaimUsername() {
  const [sessionClient, setSessionClient] = useAtom(sessionClientAtom);
  const signer = useSigner();
  const setAccount = useSetAtom(accountAtom);

  const [isLoading, setIsLoading] = useState(false);

  const claimUsername = async (username: string, accountMedadata: AccountMetadata) => {
    if (!sessionClient || !signer) return;

    try {
      setIsLoading(true);

      const { uri } = await storageClient.uploadAsJson(accountMedadata);

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
        .andThen((account) => {
          setAccount(account);
          return sessionClient.switchAccount({
            account: account?.address ?? never("Account not found"),
          })
        }).mapErr((error) => {
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

type PostFilter = {
  feedAddress?: string;
  authorId?: string;
}

export function useFeedPosts(postFilter: PostFilter) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [posts, setPosts] = useAtom(feedPostsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const filter = {
    ...(postFilter.feedAddress && { feeds: [{ feed: postFilter.feedAddress }] }),
    ...(postFilter.authorId && { authors: [postFilter.authorId] }),
  };

  const fetchPostsData = async (refresh = false) => {    
    setIsLoading(true);
    try {
      const result = await lensFetchPosts(sessionClient || client, {
        filter,
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
  }, [sessionClient]);

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
  commentOn?: string;
};

export function usePost() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const setPosts= useSetAtom(feedPostsAtom);

  const createPost = async ({ metadata, feedAddress, commentOn }: CreatePostParams) => {
    if (!sessionClient || !signer) return;

    setIsLoading(true);
    try {
      const { uri } = await storageClient.uploadAsJson(metadata);

      const result = await post(sessionClient, {
        contentUri: uri,
        feed: evmAddress(feedAddress ?? LEMONADE_FEED_ADDRESS),
        ...(commentOn && { commentOn: { post: postId(commentOn) } }),
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchPost(sessionClient, { txHash }))
        .andThen((post) => {
          setPosts(prev => [post as AnyPost, ...prev]);
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
  const account = useAtomValue(accountAtom);

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
  const account = useAtomValue(accountAtom);
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
      modal.open(SelectProfileModal, { dismissible: true });
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
