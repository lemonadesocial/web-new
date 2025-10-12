'use client';
import React from 'react';
import { fetchAccount } from '@lens-protocol/client/actions';
import { evmAddress } from '@lens-protocol/client';

import { GetUserDocument, User } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { client } from '$lib/utils/lens/client';
import { isAddress } from 'ethers';

/**
 * @description this hooks support get user profile from BE or lens account via address
 */
export const useUserProfile = (params: { username?: string; address: string }) => {
  const [data, setData] = React.useState<Partial<User>>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const getUser = async ({ lens_profile_id, username }: { lens_profile_id?: string; username?: string }) => {
    const request = getClient();

    const { data, error: queryError } = await request.query({
      query: GetUserDocument,
      variables: { lens_profile_id, username },
    });

    if (queryError) {
      setError(queryError);
      return;
    }

    return data?.getUser as User | undefined;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { address, username } = params;

      if (address && isAddress(address)) {
        const result = await fetchAccount(client, {
          address: evmAddress(address),
        });

        if (result.isErr()) {
          setError(result.error as any);
          return;
        }

        const account = result.value;
        let attributes: Record<string, string> = {};
        account?.metadata?.attributes?.forEach((item) => (attributes[item.key] = item.value));

        const user = await getUser({ lens_profile_id: address });

        setData({
          _id: user?._id,
          cover_expanded: user?.cover_expanded,
          username: account?.username?.localName,
          description: account?.metadata?.bio,
          name: account?.metadata?.name || '',
          created_at: account?.createdAt,
          image_avatar: account?.metadata?.picture,
          ...attributes,
        });
      } else {
        if (username) {
          const user = await getUser({ username });
          setData(user);
        }
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [params.username, params.address]);

  return { user: data as User, loading, error };
};
