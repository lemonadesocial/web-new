'use client';

import { useState, useCallback } from 'react';

import type { AtlasTicketType } from '$lib/types/atlas';
import { atlasListTickets } from '$lib/services/atlas-client';

interface UseAtlasTicketsReturn {
  tickets: AtlasTicketType[];
  loading: boolean;
  error: string | null;
  fetchTickets: (eventId: string) => Promise<void>;
}

export function useAtlasTickets(): UseAtlasTicketsReturn {
  const [tickets, setTickets] = useState<AtlasTicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await atlasListTickets(eventId);
      setTickets(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tickets';
      setError(message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tickets, loading, error, fetchTickets };
}
