'use client';
import { useParams } from "next/navigation";

import { GetSpaceDocument, Space } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { isObjectId } from "$lib/utils/helpers";

export function useSpace () {
  const { uid } = useParams<{ uid: string }>();

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data } = useQuery(GetSpaceDocument, { variables });

  return data?.getSpace as Space | undefined;
}
