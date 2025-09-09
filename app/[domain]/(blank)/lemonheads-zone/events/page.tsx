import { Community } from '$lib/components/features/community';
import {
  GetSpaceTagsDocument,
  GetSubSpacesDocument,
  PublicSpace,
  Space,
  SpaceTag,
} from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { getSpace } from '$lib/utils/getSpace';
import { notFound } from 'next/navigation';
import { Content } from './content';

async function Page() {
  const space = await getSpace({ slug: 'new-spaceabc' });

  if (!space) return notFound();

  return <Content initData={{ space }} />;
}

export default Page;
