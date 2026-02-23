import React from 'react';
import { Avatar, Button, Card, drawer, InputField, modal } from '$lib/components/core';
import { AddEmailsModal } from '../modals/AddEmailsModal';
import { useEvent } from '../store';
import { EventTicketType, ExportEventTicketsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { randomUserImage } from '$lib/utils/user';

export function EmailListDrawer({ ticketType }: { ticketType: EventTicketType }) {
  const event = useEvent();

  const [query, setQuery] = React.useState('');
  const [currentPage, setCurentPage] = React.useState(1);
  const pageSize = 1000;

  const { data, refetch } = useQuery(ExportEventTicketsDocument, {
    variables: {
      id: event?._id,
      searchText: query || undefined,
      ticketTypeIds: [ticketType._id],
      pagination: {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
      },
    },
  });

  if (!event) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex">
        <Button icon="icon-arrow-back-sharp" variant="tertiary" size="sm" onClick={() => drawer.close()} aria-label="Go back" />
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-auto">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Email List</h3>
          <p className="text-secondary">
            Only guests on this list can purchase the ticket. You can add, remove, or edit emails at any time.
          </p>
        </div>

        <div className="[&_.control]:bg-(--btn-tertiary)! [&_.control]:border-none! [&_.control]:items-center">
          <InputField
            placeholder="Search Emails"
            iconLeft="icon-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          {data?.exportEventTickets?.tickets?.map((item) => (
            <Card.Root key={item._id} className="rounded-sm border-none">
              <Card.Content className="flex items-center gap-3 flex-1 px-3 py-2">
                <Avatar src={item.buyer_avatar || randomUserImage(item.buyer_email?.toString())} className="size-8" />
                <div className="flex-1 flex flex-col md:flex-row md:gap-2 md:items-center">
                  <p className="truncate">{item.buyer_name || 'Anonymous'}</p>
                  <p className="text-tertiary truncate text-xs md:text-base">{item.buyer_email}</p>
                </div>
                <i className="icon-more-vert size-5 cursor-pointer" />
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <Button
          variant="secondary"
          onClick={() => modal.open(AddEmailsModal, { props: { ticketType }, onClose: refetch })}
        >
          Add Emails
        </Button>
      </div>
    </div>
  );
}
