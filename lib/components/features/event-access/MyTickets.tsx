import { useMe } from "$lib/hooks/useMe";
import { SkeletonBox } from "$lib/components/core";
import { Event } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { GetTicketsDocument } from '$lib/generated/backend/graphql';
import { useMemo } from "react";
import { AccessCard } from "./AccessCard";

export function MyTickets({ event }: { event: Event }) {
  const me = useMe();

  const { data, loading } = useQuery(GetTicketsDocument, {
    variables: {
      event: event._id,
      user: me?._id,
    },
    skip: !me,
  });

  const ticketTypeText = useMemo(() => {
    if (!data?.getTickets?.length) return '';

    const ticketTypes = data.getTickets.reduce((acc, ticket) => {
      const typeId = ticket.type;
      if (!acc[typeId]) {
        acc[typeId] = {
          count: 0,
          title: ticket.type_expanded?.title || ''
        };
      }
      acc[typeId].count++;
      return acc;
    }, {} as Record<string, { count: number; title: string }>);

    return Object.values(ticketTypes)
      .map(({ count, title }) => `${count}x ${title}`)
      .join(', ');
  }, [data]);

  if (loading) return <SkeletonBox rows={4} />;

  if (!me || !data?.getTickets?.length) return null;

  return (
    <AccessCard>
      <div>
        <h3 className="text-xl font-semibold">You&apos;re In</h3>
        <p className="text-lg text-tertiary">{ticketTypeText}</p>
      </div>
    </AccessCard>
  );
}
