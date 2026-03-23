'use client';
import { useMe } from '$lib/hooks/useMe';

export function WelcomeChat() {
  const me = useMe();
  const displayName = me?.username || me?.display_name || me?.name || 'there';
  const isGuest = !me;

  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-center">
        {!isGuest && <i aria-hidden="true" className="icon-lemon-ai text-warning-300 size-8" />}
        <h3 className={isGuest ? 'font-title text-[32px] leading-10 font-semibold' : 'text-2xl font-semibold'}>
          {isGuest ? 'Where great events begin.' : `Hi ${displayName}`}
        </h3>
      </div>
      <p className="text-tertiary">
        {me
          ? 'I can help with events, communities, tokens, and more.'
          : 'Create event pages, sell tickets, and build your community, just by chatting.'}
      </p>
    </div>
  );
}
