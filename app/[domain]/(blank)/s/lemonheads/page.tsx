import { notFound } from 'next/navigation';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { PageContent } from './PageContent';

async function Page() {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return <PageContent space={space} />;
}

export default Page;
