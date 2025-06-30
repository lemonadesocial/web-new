import { LemonHeadMain } from '$lib/components/features/lemonheads/main';
import lemonhead from '$lib/trpc/lemonheads';

export default async function Page() {
  const { data: dataBodySet } = await lemonhead.getBodies();
  const { data: dataDefaultSet } = await lemonhead.getDefaultSet();

  return <LemonHeadMain bodySet={dataBodySet?.list} defaultSet={dataDefaultSet.list} />;
}
