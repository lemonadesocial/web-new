import { LemonHeadMain } from '$lib/components/features/lemonheads/main';
import lemonhead from '$lib/trpc/lemonheads';

export default async function Page() {
  const { data } = await lemonhead.getBody();
  return <LemonHeadMain dataBody={data?.list} />;
}
