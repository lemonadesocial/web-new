import { EventScan } from '$lib/components/features/event-manage/EventScan';

export default async function Page({ params }: { params: Promise<{ shortid: string }> }) {
  const { shortid } = await params;
  
  return <EventScan shortid={shortid} />;
}

