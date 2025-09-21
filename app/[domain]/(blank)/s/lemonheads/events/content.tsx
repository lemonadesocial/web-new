'use client';
import { Community } from '$lib/components/features/community';
import { TitleSection } from '../shared';

// TODO: Will re-work on Community component after launch lemonheads community
export function Content({ space, subSpaces, spaceTags }: any) {
  return (
    <Community
      initData={{ space, subSpaces, spaceTags }}
      hideHeroSection
      customTitle={(title) => <TitleSection className="capitalize flex-1">{title}</TitleSection>}
    />
  );
}
