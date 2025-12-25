'use client';
import React from 'react';
import { Button } from '$lib/components/core';
import { GetSpaceNfTsDocument, Space, SpaceNft, SpaceNftKind } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useGetEns } from '$lib/hooks/useGetEnsName';
import { useMusicNft } from '$lib/hooks/useMusicNft';

import { WidgetContent } from './WidgetContent';

interface Props {
  space: Space;
}

export function WidgetMusicNFT({ space }: Props) {
  const [skip, setSkip] = React.useState(0);
  const [paused, setPaused] = React.useState(true);

  const { data: dataListSpaceNfts, loading } = useQuery(GetSpaceNfTsDocument, {
    variables: { space: space._id, skip, limit: 1, kind: SpaceNftKind.MusicTrack },
    skip: !space.nft_enabled,
  });
  const list = (dataListSpaceNfts?.listSpaceNFTs?.items || []) as SpaceNft[];
  const track = list?.[0];
  const contract = track?.contracts?.[0];
  const { data } = useMusicNft({
    network_id: contract?.network_id,
    contractAddress: contract?.deployed_contract_address,
  });

  const ensData = useGetEns(data?.owner);

  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.load();
    }

    return () => {
      return;
    };
  }, [track, audioRef.current]);

  if (!space.nft_enabled || !track) return null;

  return (
    <WidgetContent space={space} title="Music Player" className="col-span-2">
      <div className="p-6 flex items-center gap-8">
        <div className="bg-gray-50 size-[228px] aspect-square rounded-sm overflow-hidden">
          {track?.cover_image_url && (
            <img src={track.cover_image_url} alt="Album Cover" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm text-tertiary">NOW PLAYING</p>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{loading ? '--' : track?.name || '--'}</h3>
              <p className="text-tertiary">{loading ? '--' : ensData?.username || '--'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <audio ref={audioRef} src={track?.content_url as string} preload="auto"></audio>
            <Button
              variant="tertiary-alt"
              className="rounded-full"
              icon="icon-skip-previous"
              disabled={skip === 0}
              onClick={() => setSkip((prev) => prev - 1)}
            />
            <Button
              variant="tertiary-alt"
              className="rounded-full"
              icon={paused ? 'icon-play-arrow' : 'icon-pause'}
              disabled={!track}
              onClick={() => {
                if (paused) {
                  audioRef.current?.play();
                  setPaused(false);
                } else {
                  audioRef.current?.pause();
                  setPaused(true);
                }
              }}
            />
            <Button
              variant="tertiary-alt"
              className="rounded-full"
              icon="icon-skip-next"
              onClick={() => setSkip((prev) => prev + 1)}
            />
          </div>
        </div>
      </div>
    </WidgetContent>
  );
}
