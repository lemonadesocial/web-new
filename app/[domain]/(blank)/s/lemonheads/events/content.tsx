'use client';
import { LemonHeadsLockFeature } from '$lib/components/features/lemonheads/LemonHeadsLockFeature';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useAppKitAccount } from '@reown/appkit/react';
import { TitleSection } from '../shared';
import { CommunityEventsWithCalendar } from '$lib/components/features/community/CommunityEventsWithCalendar';

// TODO: Will re-work on Community component after launch lemonheads community
export function Content({ space, subSpaces, spaceTags }: any) {
  const { data } = useLemonhead();
  const { address } = useAppKitAccount();
  const locked = !address || !data || (data && data.tokenId == 0);

  return (
    <CommunityEventsWithCalendar
      space={space}
      customTitle={(title) => <TitleSection className="capitalize flex-1">{title}</TitleSection>}
      locked={
        !locked ? (
          <LemonHeadsLockFeature
            title="Events are Locked"
            subtitle="Claim your LemonHead to unlock access to exclusive events."
            icon="icon-confirmation-number"
          />
        ) : undefined
      }
    />
  );
}
