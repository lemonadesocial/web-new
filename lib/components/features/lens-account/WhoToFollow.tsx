'use client';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { fetchAccountsBulk, follow } from '@lens-protocol/client/actions';
import { Account } from '@lens-protocol/client';

import { Avatar, Button, toast } from '$lib/components/core';
import { sessionClientAtom, accountAtom } from '$lib/jotai';
import { client } from '$lib/utils/lens/client';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { useSigner } from '$lib/hooks/useSigner';
import { useLensAuth } from '$lib/hooks/useLens';

const SUGGESTED_USERNAMES = [
  'vitalik',
  'stani',
  'christina',
  'cmn__',
  'juampu',
  'sunshinevendetta',
  'jeanayala',
  'thebusyspice',
  'papajams',
  'moodyink',
  'dee_centralized',
  'nooblemon_eth',
  'makelemonade',
  'raave',
  'natem',
  'superluminal',
  'benoit_tokyo',
  'sealaunch',
  'eliankutse',
  'watchereth',
  'punkess',
  'pedrovilela',
  'nilesh',
  'notgonnamakeit',
  'amber',
  'soundoffractures',
  'tinyrainboot',
  'paulburke',
  'kyushime',
  'thefaketomato',
  'anialexander',
  'nohussle',
  'yoshiromare',
  'eduardmsmr',
  'kipto',
  'lanadingwall',
  'eclecticmethod',
  'danielrotter',
  'violetverse',
  'jessyjeanne',
  'leopastel',
  'andresbriceno',
  'dankshard',
  'arterlios',
  'tinyrainboots',
  'kyushime',
  'springhead',
  'paris',
  'mp',
];

export function WhoToFollow() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const myAccount = useAtomValue(accountAtom);
  const signer = useSigner();

  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [displayedAccounts, setDisplayedAccounts] = useState<Account[]>([]);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  const handleLensAuth = useLensAuth();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await fetchAccountsBulk(client, {
          usernames: SUGGESTED_USERNAMES.map((username) => ({ localName: username })),
        });

        if (result.isErr()) {
          toast.error('Failed to fetch accounts');
          return;
        }

        const unfollowedAccounts = result.value.filter((account) => !account.operations?.isFollowedByMe);
        setAllAccounts(unfollowedAccounts);
        setDisplayedAccounts(unfollowedAccounts.slice(0, 5));
      } catch (_error) {
        toast.error('Failed to fetch accounts');
      }
    };

    fetchAccounts();
  }, [myAccount]);

  const handleFollow = async (account: Account) => {
    if (!sessionClient || !signer) {
      toast.error('Please connect your wallet');
      return;
    }

    setFollowLoading(account.address);
    try {
      const result = await follow(sessionClient, {
        account: account.address,
      });

      if (result.isErr()) {
        toast.error('Failed to follow user');
        return;
      }

      toast.success('Successfully followed!');

      setDisplayedAccounts((prev) => prev.filter((acc) => acc.address !== account.address));
      setAllAccounts((prev) => prev.filter((acc) => acc.address !== account.address));

      const remainingAccounts = allAccounts.filter((acc) => acc.address !== account.address);
      const currentDisplayed = displayedAccounts.filter((acc) => acc.address !== account.address);

      if (currentDisplayed.length < 5 && remainingAccounts.length > 0) {
        const nextAccount = remainingAccounts[currentDisplayed.length];
        if (nextAccount) {
          setDisplayedAccounts([...currentDisplayed, nextAccount]);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to follow user');
    } finally {
      setFollowLoading(null);
    }
  };

  if (displayedAccounts.length === 0) return null;

  return (
    <div className="rounded-md border p-4 space-y-3">
      <p className="text-tertiary">Who to Follow</p>
      {displayedAccounts.map((account) => (
        <div key={account.address} className="flex items-center gap-3">
          <Avatar src={getAccountAvatar(account)} size="lg" />
          <div className="flex-1">
            <p>{account.metadata?.name}</p>
            <div className="text-tertiary text-sm">@{account.username?.localName}</div>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            className="rounded-full"
            onClick={() => handleLensAuth(() => handleFollow(account))}
            loading={followLoading === account.address}
            disabled={followLoading === account.address}
          >
            Follow
          </Button>
        </div>
      ))}
    </div>
  );
}

