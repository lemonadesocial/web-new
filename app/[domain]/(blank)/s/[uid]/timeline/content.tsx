'use client';
import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { usePathname, useRouter } from 'next/navigation';

export function TimelineContent({ feedAddress }: { feedAddress?: string }) {
  const pathName = usePathname();
  const router = useRouter();
  return <LensFeed feedAddress={feedAddress} onSelectPost={(slug) => router.push(`${pathName}/${slug}`)} />;
}
