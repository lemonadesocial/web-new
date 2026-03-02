import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const { uid } = await params;
  redirect(`/s/manage/${uid}/integrations/mapping`);
}
