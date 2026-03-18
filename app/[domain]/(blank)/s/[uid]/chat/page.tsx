import { GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { graphql } from '$lib/graphql/generated/backend';
import { GetSpaceDocument, GetSpaceQuery, Space } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { isObjectId } from '$lib/utils/helpers';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();
  const { data, error } = await client.query<GetSpaceQuery, object>({
    query: GetSpaceDocument,
    variables,
  });
  const space = data?.getSpace as Space;

  if (!space || error) return notFound();

  const { data: dataConfig } = await aiChatClient.query({
    query: GetListAiConfigDocument,
    variables: { filter: { spaces_in: [space._id] } },
  });

  if (!dataConfig?.configs.items.length) return notFound();

  return <div>Chat Page</div>;
}
