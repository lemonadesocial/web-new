import { LemonHeadMain } from '$lib/components/features/lemon-heads/main';
import LemonHead from '$lib/lemon-heads';

export default async function Page() {
  const lemonhead = new LemonHead();
  const { data } = await lemonhead.getBody();

  return <LemonHeadMain dataBody={data?.list} />;
}
