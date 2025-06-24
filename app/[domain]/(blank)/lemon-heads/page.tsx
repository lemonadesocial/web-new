import { LemonHeadMain } from '$lib/components/features/lemon-heads/main';
import lemonhead from '$lib/lemon-heads';

export default async function Page() {
  const { data } = await lemonhead.getBody();
  return <LemonHeadMain dataBody={data?.list} />;
}
