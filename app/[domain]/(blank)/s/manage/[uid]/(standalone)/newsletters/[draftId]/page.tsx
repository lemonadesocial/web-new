import { NewsletterDraftPage } from '$lib/components/features/community-manage/NewsletterDraftPage';

export default function Page({ params }: { params: { uid: string; draftId: string } }) {
  return <NewsletterDraftPage uid={params.uid} draftId={params.draftId} />;
}
