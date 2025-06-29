import { LemonHeadMain } from '$lib/components/features/lemonheads/main';
import lemonhead from '$lib/trpc/lemonheads';

export default async function Page() {
  const { data } = await lemonhead.getBody();
  const { data: dataPreSelect } = await lemonhead.getAccessories({ viewId: 'vwziaxm5nfh9652q', limit: 100 });
  return <LemonHeadMain dataBody={data?.list} dataPreSelect={dataPreSelect.list} />;
}
