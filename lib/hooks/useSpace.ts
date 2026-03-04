'use client';
import { useParams } from "next/navigation";

import { GetSpaceDocument, Space } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { isObjectId } from "$lib/utils/helpers";
import { useCommunityManageSpace } from "$lib/components/features/community-manage/CommunityManageSpaceContext";

export function useSpace() {
  const manageContext = useCommunityManageSpace();
  if (manageContext) return manageContext.space;

  const { uid } = useParams<{ uid: string }>();
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data } = useQuery(GetSpaceDocument, { variables });

  return data?.getSpace as Space | undefined;
}
