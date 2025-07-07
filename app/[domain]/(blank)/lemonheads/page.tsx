import { LemonHeadMain } from '$lib/components/features/lemonheads/main';
import lemonhead from '$lib/trpc/lemonheads';

export default async function Page() {
  const [dataBodySet, dataDefaultSet] = await Promise.all([lemonhead.getBodies(), lemonhead.getDefaultSet()]);
  return <LemonHeadMain bodySet={dataBodySet?.data?.list || []} defaultSet={dataDefaultSet?.data?.list || []} />;
}
