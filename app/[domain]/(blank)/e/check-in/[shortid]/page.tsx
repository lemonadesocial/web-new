import { EventCheckIn } from '$lib/components/features/event-manage/EventCheckIn';

export default async function Page({ params }: { params: Promise<{ shortid: string }> }) {
  const { shortid } = await params;

  return <EventCheckIn shortid={shortid} />;
}
