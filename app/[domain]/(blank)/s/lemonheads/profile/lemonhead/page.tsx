'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useAppKitAccount } from '@reown/appkit/react';
import { Card, drawer, modal, toast } from '$lib/components/core';
import {
  getLemonHeadImage,
  LemonHeadsImageLazyLoad,
  ShareModal,
} from '$lib/components/features/lemonheads/mint/steps/ClaimLemonHead';
import { PostComposerModal } from '$lib/components/features/lens-feed/PostComposerModal';
import { ProfilePane } from '$lib/components/features/pane';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useAccount } from '$lib/hooks/useLens';

function Page() {
  const { address } = useAppKitAccount();
  const { account: myAccount } = useAccount();
  const { data } = useLemonhead();

  const [downloading, setDownloading] = React.useState(false);

  const setPhotoProfile = async () => {
    if (data && data.tokenId > 0) {
      try {
        setDownloading(true);
        const url = getLemonHeadImage({
          address: myAccount?.address || address,
          tokenId: data.tokenId.toString(),
          color: 'violet',
        });

        const response = await fetch(`${url}&download=true`);

        if (!response.ok) {
          toast.error('Download fail! Please try again.');
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = data.tokenId.toString();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);

        drawer.open(ProfilePane);
      } catch (err) {
        toast.error('Download fail! Please try again.');
      }
    }
  };

  const actions = [
    {
      icon: 'icon-image-arrow-up-outline text-warning-500',
      label: 'Set as Profile Photo',
      onClick: setPhotoProfile,
    },
    { icon: 'icon-edit-square text-alert-600', label: 'Post', onClick: () => modal.open(PostComposerModal) },
    {
      icon: 'icon-government text-success-700',
      label: 'Governance Portal',
      onClick: () => toast.success('Comming soon.'),
    },
    { icon: 'icon-gift-line text-accent-600', label: 'Rewards', onClick: () => toast.success('Comming soon.') },
    { icon: 'icon-share text-[#F472B6]', label: 'Share', onClick: () => drawer.open(ShareModal) },
    // { icon: 'icon-arrow-outward text-tertiary', label: 'View on OpenSea', onClick: () => window.open() },
  ];

  return (
    <div className="flex flex-col gap-4 pb-20">
      {(myAccount?.address || address) && data && data.tokenId > 0 && (
        <LemonHeadsImageLazyLoad
          src={getLemonHeadImage({
            address: myAccount?.address || address,
            tokenId: data.tokenId.toString(),
            color: 'violet',
          })}
          className="border border-primary"
        />
      )}

      <div className="flex flex-col md:grid grid-cols-3 gap-3">
        {actions.map((item, idx) => (
          <Card.Root
            key={idx}
            onClick={() => {
              if (!downloading) item.onClick();
            }}
          >
            <Card.Content className="flex gap-3 py-3 items-center">
              <i className={twMerge('size-[22px] aspect-square', item.icon)} />
              <p>{item.label}</p>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}

export default Page;
