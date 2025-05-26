import { GetSpaceDocument, Space } from "$lib/graphql/generated/backend/graphql";
import { getClient } from "$lib/graphql/request";
import { unstable_cache } from "next/cache";

export const getSpace = unstable_cache(
  async (variables: { id?: string; slug?: string; hostname?: string }) => {
    const client = getClient();
    const { data } = await client.query({ query: GetSpaceDocument, variables });
    return data?.getSpace as Space;
  },
  ['get-space'],
  { revalidate: 60 }
);
