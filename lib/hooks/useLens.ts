'use client';
import { handleOperationWith, signMessageWith } from '@lens-protocol/client/ethers';
import {
  createAccountWithUsername,
  fetchAccountsAvailable,
  fetchFeed,
  fetchPost,
  lastLoggedInAccount,
  post,
  fetchPosts as lensFetchPosts,
  fetchPostReferences,
  fetchAccountGraphStats,
  fetchUsernames,
  fetchTimeline,
} from '@lens-protocol/client/actions';
import { AccountMetadata, account, MetadataAttributeType } from '@lens-protocol/metadata';
import { setAccountMetadata } from '@lens-protocol/client/actions';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { useState, useEffect, useCallback } from 'react';
import { delay } from 'lodash';

import {
  evmAddress,
  never,
  ok,
  AnyPost,
  postId,
  PostReferenceType,
  Account,
  PostType,
  PageSize,
} from '@lens-protocol/client';
import { fetchAccount } from '@lens-protocol/client/actions';
import { toast } from '$lib/components/core/toast';
import { sessionClientAtom, accountAtom, feedAtom, feedPostsAtom, chainsMapAtom, feedPostAtom, lemonadeUsernameAtom } from '$lib/jotai';
import { useAppKitAccount } from '$lib/utils/appkit';
import { client, storageClient } from '$lib/utils/lens/client';
import { ATTRIBUTES_SAFE_KEYS, LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { modal } from '$lib/components/core';
import { LENS_NAMESPACE, LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { SelectProfileModal } from '$lib/components/features/lens-account/SelectProfileModal';
import { useClient } from '$lib/graphql/request';

import { useSigner } from './useSigner';
import { useConnectWallet } from './useConnectWallet';
import { useMe } from './useMe';
import { UpdateUserDocument, UpdateUserMutationVariables, User } from '$lib/graphql/generated/backend/graphql';
import { uploadFiles } from '$lib/utils/file';
import { formatError } from '$lib/utils/crypto';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';

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

      if (lastLoggedIn.isErr() || !lastLoggedIn.value) {
        setIsLoading(false);
        return;
      }

      const result = await fetchAccount(resumed.value, {
        address: lastLoggedIn.value.address,
      });

      if (result.isErr()) return;

      setAccount(result.value);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resumeSession();
  }, [address]);

  return {
    isLoading,
  };
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
  };

  return {
    isLoading,
    logIn,
  };
}

export function useLogOut() {
  const [sessionClient, setSessionClient] = useAtom(sessionClientAtom);
  const setAccount = useSetAtom(accountAtom);

  const logOut = async () => {
    setAccount(null);
    await sessionClient?.logout();
    setSessionClient(null);
  };

  return {
    logOut,
  };
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
        },
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
        .andThen((account) => {
          setAccount(account);
          return sessionClient.switchAccount({
            account: account?.address ?? never('Account not found'),
          });
        })
        .mapErr((error) => {
          throw error;
        });

      if (created.isErr()) return;

      setSessionClient(created.value);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimUsername,
    isLoading,
  };
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
  global?: boolean;
};

export function useFeedPosts(postFilter: PostFilter) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [posts, setPosts] = useAtom(feedPostsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const filter = {
    ...(postFilter.feedAddress && { feeds: [{ feed: postFilter.feedAddress }] }),
    ...(postFilter.authorId && { authors: [postFilter.authorId] }),
    ...(postFilter.global && { feeds: [{ globalFeed: true as const }] }),
    postTypes: [PostType.Root],
  };

  const fetchPostsData = async (refresh = false) => {
    setIsLoading(true);
    try {
      const result = await lensFetchPosts(sessionClient || client, {
        filter,
        ...(cursor && !refresh ? { cursor } : {}),
        pageSize: PageSize.Ten,
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
          setPosts((prev) => [...prev, ...validPosts]);
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
  const [posts, setPosts] = useAtom(feedPostsAtom);
  const setCurrentPost = useSetAtom(feedPostAtom);

  const getPost = async (params: { postId?: string; slug?: string }) => {
    let data: AnyPost | null | undefined;
    if (posts?.length) {
      data = posts.find((p) => p.id === params.postId || p.slug === params.slug);
    } else {
      const variables = { post: postId((params.postId || params.slug) as string) };

      const result = await fetchPost(client, variables);
      setIsLoading(false);

      if (result.isErr()) {
        const error = result.error;
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
      data = result.value;
    }
    return data;
  };

  const selectPost = async (params: { id?: string; slug?: string }) => {
    setIsLoading(true);
    const currentPost = await getPost(params);

    // NOTE: for better UI
    delay(() => {
      setIsLoading(false);
      setCurrentPost(currentPost);
    }, 500);
  };

  const createPost = async ({ metadata, feedAddress, commentOn }: CreatePostParams) => {
    if (!sessionClient || !signer) return;

    setIsLoading(true);
    try {
      const { uri } = await storageClient.uploadAsJson(metadata);

      const result = await post(sessionClient, {
        contentUri: uri,
        feed: feedAddress ? evmAddress(feedAddress) : undefined,
        ...(commentOn && { commentOn: { post: postId(commentOn) } }),
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction)
        .andThen((txHash) => fetchPost(sessionClient, { txHash }))
        .andThen((post) => {
          if (post) {
            setPosts((prev) => [post as AnyPost, ...prev]);
          }
          return ok(post);
        })
        .mapErr((error) => {
          throw error;
        });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    } catch (error) {
      toast.error(formatError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPost,
    createPost,
    selectPost,
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
  const [currentPost, setCurrentPost] = useAtom(feedPostAtom);
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
        ...(cursor && !refresh ? { cursor } : {}),
      });

      if (result.isOk()) {
        const { items, pageInfo } = result.value;

        setHasMore(!!pageInfo.next);
        if (pageInfo.next) {
          setCursor(pageInfo.next);
        }

        const validComments = items.filter(
          (comment): comment is NonNullable<typeof comment> => comment !== null,
        ) as AnyPost[];

        if (refresh) {
          setComments(validComments);
        } else {
          setComments((prev) => [...prev, ...validComments]);
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
          // NOTE: update state current post
          if (currentPost?.id === targetPostId) {
            setCurrentPost((prev: any) => ({ ...prev, stats: { ...prev.stats, comments: prev.stats.comments + 1 } }));
          }

          if (comment) {
            setComments((prev) => [comment, ...prev]);
          }
          return ok(comment);
        })
        .mapErr((error) => {
          throw error;
        });

      if (result.isErr()) {
        throw new Error('Failed to create comment');
      }

      return result.value;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create comment';
      toast.error(errorMessage);
      console.log(error);
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

export function useAccountStats(account: Account | null) {
  const [stats, setStats] = useState<{ followers: number; following: number }>({ followers: 0, following: 0 });
  const [isLoading, setIsLoading] = useState(false);

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
    if (account) {
      await action();
      return;
    }

    if (sessionClient) {
      modal.open(SelectProfileModal);
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

export function useLemonadeUsername(account: Account | null) {
  const [username, setUsername] = useAtom(lemonadeUsernameAtom);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsernameData = async () => {
    if (!account?.address) return;

    setIsLoading(true);
    try {
      const result = await fetchUsernames(client, {
        filter: {
          owner: account.address,
          namespace: evmAddress(LENS_NAMESPACE),
        },
      });

      if (result.isOk() && result.value.items.length > 0) {
        setUsername(result.value.items[0].localName);
      } else {
        setUsername(null);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsernameData();
  }, [account?.address]);

  return {
    username,
    isLoading,
    refetch: fetchUsernameData,
  };
}

export function useSyncLensAccount() {
  const me = useMe();
  const { refreshAccount } = useAccount();

  const { client } = useClient();

  /**
   * @description sync data from lens to lemonade - ignore username bc it can be claim
   *
   * 1. sync from lens to lemonade
   * 2. sync back from lemonade to lens
   *
   * note: step 2 is necessary it's bc lens might not have value from lemonade and need to sync back.
   * picture is more complex - need to figure out later
   */
  const triggerSync = async (myAccount: any, sessionClient: any) => {
    if (!me?.lens_profile_synced && myAccount && sessionClient) {
      let new_photos = me?.new_photos || [];
      if (myAccount.metadata?.picture) {
        try {
          const response = await fetch(myAccount.metadata?.picture);

          // Check if the request was successful
          if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
          }

          const imageBlob = await response.blob();
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          const file = new File([imageBlob], generateRandomAlphanumeric() + '.' + contentType.split('/')[1], {
            type: contentType,
            lastModified: Date.now(),
          });
          const res = await uploadFiles([file], 'user');
          if (res.length) {
            new_photos = [res[0]._id, ...new_photos];
          }
        } catch (err) {
          console.log(err);
        }
      }

      const variables = {
        input: {
          name: myAccount.metadata?.name,
          display_name: myAccount.metadata?.name,
          description: myAccount.metadata?.bio,
          lens_profile_synced: true,
        },
      } as UpdateUserMutationVariables;

      if (new_photos.length) variables.input.new_photos = new_photos;

      ATTRIBUTES_SAFE_KEYS.forEach((key) => {
        const attr = myAccount.metadata?.attributes.find((i) => i.key === key);
        // @ts-expect-error no need to check type on safe keys
        variables.input[key] = attr?.value;
      });

      const { data } = await client.query({ query: UpdateUserDocument, variables });
      const user = data?.updateUser as User;

      if (user) {
        const attributes = [] as { key: string; type: MetadataAttributeType; value: string }[];
        ATTRIBUTES_SAFE_KEYS.forEach((k) => {
          // @ts-expect-error ignore ts check
          if (user[k]) attributes.push({ key: k, type: MetadataAttributeType.STRING, value: user[k] });
        });

        const accountMetadata = account({
          name: myAccount.metadata?.name || undefined,
          bio: myAccount.metadata?.bio || undefined,
          picture: myAccount.metadata?.picture || undefined,
          // @ts-expect-error ignore ts check
          attributes,
        });

        const { uri } = await storageClient.uploadAsJson(accountMetadata);

        const result = await setAccountMetadata(sessionClient, {
          metadataUri: uri,
        });

        if (result.isErr()) {
          toast.error(result.error.message);
          return;
        }

        setTimeout(() => {
          refreshAccount();
          toast.success('Sync success!');
        }, 1000);
      }
    }
  };

  return { triggerSync };
}

export function useLensConnect () {
  const chainsMap = useAtomValue(chainsMapAtom);

  return () => {
    modal.open(ConnectWallet, {
      dismissible: true,
      props: {
        onConnect: () => {
          modal.close();
          setTimeout(() => {
            modal.open(SelectProfileModal);
          });
        },
        chain: chainsMap[LENS_CHAIN_ID]
      }
    });
  }
}

function generateRandomAlphanumeric(length: number = 12) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

type TimelineFilter = {
  account?: string;
};

export function useTimeline(timelineFilter: TimelineFilter) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const [timelineItems, setTimelineItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const fetchTimelineData = async (refresh = false) => {
    if (!sessionClient || !timelineFilter.account) return;

    setIsLoading(true);
    try {
      const result = await fetchTimeline(sessionClient, {
        account: evmAddress(timelineFilter.account),
        ...(cursor && !refresh ? { cursor } : {}),
      });

      if (result.isOk()) {
        const { items, pageInfo } = result.value;

        setHasMore(!!pageInfo.next);
        if (pageInfo.next) {
          setCursor(pageInfo.next);
        }

        const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null);

        if (refresh) {
          setTimelineItems(validItems);
        } else {
          setTimelineItems((prev) => [...prev, ...validItems]);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData(true);
  }, [sessionClient, timelineFilter.account]);

  return {
    timelineItems,
    isLoading,
    hasMore,
    loadMore: () => hasMore && !isLoading && fetchTimelineData(),
    refresh: () => fetchTimelineData(true),
  };
}
