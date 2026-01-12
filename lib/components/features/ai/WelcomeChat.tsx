'use client';
import { useMe } from '$lib/hooks/useMe';

export function WelcomeChat() {
  const me = useMe();

  if (!me) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-center">
        <i className="icon-lemon-ai text-warning-300 size-8" />
        <h3 className="text-2xl font-semibold">{me.name || me.display_name}</h3>
      </div>
      <p className="text-tertiary">I can help with events, communities, tokens, and more.</p>
    </div>
  );
}
