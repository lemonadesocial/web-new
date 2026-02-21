'use client';
import React from 'react';
import { fetchAccount } from '@lens-protocol/client/actions';
import { evmAddress } from '@lens-protocol/client';

import { GetUserDocument, User } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { client } from '$lib/utils/lens/client';
import { isAddress } from 'ethers';
import { isObjectId } from '$lib/utils/helpers';

/**
 * @description this hooks support get user profile from BE or lens account via address
 */
export const useUserProfile = (params?: string) => {
  const [data, setData] = React.useState<Partial<User>>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  const getUser = async ({
    lens_profile_id,
    username,
    id,
  }: {
    lens_profile_id?: string;
    username?: string;
    id?: string;
  }) => {
    const request = getClient();

    const { data, error: queryError } = await request.query({
      query: GetUserDocument,
      variables: { lens_profile_id, username, id },
    });

    if (queryError) {
      setError(queryError as unknown);
      return;
    }

    return data?.getUser as User | undefined;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      if (isAddress(params)) {
        const result = await fetchAccount(client, {
          address: evmAddress(params),
        });

        if (result.isErr()) {
          setError(result.error);
          return;
        }

        const account = result.value;
        const attributes: Record<string, string> = {};
        account?.metadata?.attributes?.forEach((item) => (attributes[item.key] = item.value));

        const user = await getUser({ lens_profile_id: params });

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
        let user = undefined;
        if (isObjectId(params)) {
          user = await getUser({ id: params });
        } else {
          user = await getUser({ username: params });
        }

        setData(user);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (params) fetchData();
  }, [params]);

  return { user: data as User, loading, error };
};
