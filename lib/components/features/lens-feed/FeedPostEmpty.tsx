import { Account } from '@lens-protocol/client';

export function FeedPostEmpty({ account }: { account?: Account | null }) {
  return (
    <div className="flex pt-12 pb-18 flex-col items-center justify-center rounded-md border gap-5">
      <i aria-hidden="true" className="icon-dashboard size-[184] text-tertiary" />
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-center">No Posts</h1>
        <p className="text-tertiary text-center">
          {account
            ? 'Nothing here yet. Be the first to post something!'
            : 'Want to share something? Connect your wallet to get started.'}
        </p>
      </div>
    </div>
  );
}
