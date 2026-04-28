import type { Metadata } from 'next';

import { TicketNotFound, TicketPage } from '$lib/components/features/ticket/TicketPage';
import { GetTicketDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';

export const metadata: Metadata = {
  title: 'Ticket',
};

export default async function Page({ params }: { params: Promise<{ shortid: string }> }) {
  const { shortid } = await params;
  const client = getClient();

  const { data, error } = await client.query({
    query: GetTicketDocument,
    variables: { shortid },
    fetchPolicy: 'network-only',
  });

  if (error) {
    throw new Error(getErrorMessage(error, 'Unable to load ticket'));
  }

  if (!data?.getTicket) {
    return <TicketNotFound />;
  }

  return <TicketPage ticket={data.getTicket} />;
}
