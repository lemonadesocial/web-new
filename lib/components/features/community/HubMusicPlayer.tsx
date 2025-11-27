'use client';

import { Card } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function HubMusicPlayer() {
  return (
    <div className="p-2 flex gap-4 min-h-[788px]">
      <Vinyl />
      <div className="w-[397px]">
        <TrackList />
      </div>
    </div>
  );
}

function Vinyl() {
  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0">
        <div className="relative w-full max-w-xl aspect-square scale-120 -ml-30">
          <img
            src={`${ASSET_PREFIX}/assets/images/vinyl.png`}
            alt="Vinyl Record"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Album Cover"
              className="size-48 object-cover rounded-full shadow-lg"
            />
          </div>
        </div>
        {/* <div className="-ml-[20%]"> */}
        {/*   <div className="animate-spin1 [animation-duration:5s] relative flex items-center justify-center max-w-[1080px] max-h-[1080px]"> */}
        {/*     <img src={`${ASSET_PREFIX}/assets/images/vinyl.png`} className="w-full h-full" /> */}
        {/*     <div className="bg-gray-300 absolute size-[360px] aspect-square rounded-full"> */}
        {/*       <img */}
        {/*         src="https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" */}
        {/*         className="w-full h-full rounded-full" */}
        {/*       /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
      </Card.Content>
    </Card.Root>
  );
}

function TrackList() {
  return (
    <Card.Root>
      <Card.Header>Up Next</Card.Header>
      <Card.Content>Track List</Card.Content>
    </Card.Root>
  );
}
