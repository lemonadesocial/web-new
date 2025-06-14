'use client';
import { usePathname, useRouter } from 'next/navigation';

import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';

export function UserFeed({ authorId }: { authorId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  
  return <LensFeed authorId={authorId} showReposts onSelectPost={(slug) => router.push(`${pathname}/${slug}`)} />;
}
