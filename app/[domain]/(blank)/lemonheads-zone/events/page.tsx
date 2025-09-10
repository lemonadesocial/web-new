import { getSpace } from '$lib/utils/getSpace';
import { Content } from './content';

async function Page() {
  //NOTE: list events of lemonheads community
  const space = await getSpace({ slug: 'new-spaceabc' });

  return <Content initData={{ space }} />;
}

export default Page;
