import LemonHead from '$lib/lemon-heads';
import { Content } from './content';

export default async function Page() {
  const lemonhead = new LemonHead();
  const { data } = await lemonhead.getBody();

  return <Content dataBody={data?.list} />;
}
