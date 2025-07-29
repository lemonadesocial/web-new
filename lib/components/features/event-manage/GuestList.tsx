import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { snakeCase } from "lodash";

import { Button, Avatar, Chip, Input, Skeleton, drawer } from "$lib/components/core";
import { downloadCSVFile } from "$lib/utils/file";
import { randomUserImage } from "$lib/utils/user";
import { useQuery } from "$lib/graphql/request";
import { Event, EventJoinRequestState, ListEventGuestsDocument } from "$lib/graphql/generated/backend/graphql";

import { GuestDetailsDrawer } from "./drawers/GuestDetailsDrawer";

export function GuestList({ event }: { event: Event }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error } = useQuery(ListEventGuestsDocument, {
    variables: {
      event: event._id,
      search: searchText || undefined,
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
    },
  });

  const guests = data?.listEventGuests.items || [];
  const totalCount = data?.listEventGuests.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const exportGuestsCSV = () => {
    downloadCSVFile(`/event/${event?._id}/export/guests`, snakeCase(`${event.title} Guests ${format(new Date(event.start), 'dd_MM_yyyy')}`));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading guest list</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Guest List</h1>
        <Button icon="icon-download" variant="tertiary" size="sm" onClick={exportGuestsCSV} />
      </div>

      <Input
        placeholder="Search guests..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        variant="outlined"
      />

      <div className="rounded-md border border-card-border bg-card">
        {loading ? (
          <div className="divide-y divide-(--color-divider)">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-5 h-5 rounded-full" animate />
                  <div className="flex-1 flex gap-2 items-center">
                    <Skeleton className="h-4 w-24" animate />
                    <Skeleton className="h-4 w-32" animate />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-16 rounded-full" animate />
                  <Skeleton className="h-4 w-20" animate />
                  <Skeleton className="h-5 w-12 rounded-full" animate />
                </div>
              </div>
            ))}
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-tertiary">No guests found</p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-divider)">
            {guests.map((guest, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-card-hover cursor-pointer"
                  onClick={() => drawer.open(GuestDetailsDrawer, { props: { email: guest.user.email, event: event._id } })}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar
                      src={guest.user.image_avatar || randomUserImage(guest.user.email?.toString())}
                      className="size-5"
                    />
                    <div className="flex-1 flex gap-2 items-center">
                      <p className="truncate">{guest.user.display_name || guest.user.name}</p>
                      <p className="text-tertiary truncate">{guest.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {
                      guest.ticket && <>
                        <Chip variant="secondary" size="xxs" className="rounded-full" leftIcon="icon-ticket size-3">
                          {guest.ticket?.type_expanded?.title}
                        </Chip>
                        <span className="text-sm text-tertiary whitespace-nowrap">
                          {formatDistanceToNow(new Date(guest.ticket?.created_at), { addSuffix: true })}
                        </span>
                      </>
                    }
                    {
                      (!guest.join_request || guest.join_request.state === EventJoinRequestState.Approved) && (
                        <Chip variant="success" size="xxs" className="rounded-full">
                          Going
                        </Chip>
                      )
                    }
                    {
                      guest.join_request?.state === EventJoinRequestState.Pending && (
                        <Chip variant="warning" size="xxs" className="rounded-full">
                          Pending
                        </Chip>
                      )
                    }
                    {
                      guest.join_request?.state === EventJoinRequestState.Declined && (
                        <Chip variant="error" size="xxs" className="rounded-full">
                          Declined
                        </Chip>
                      )
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            icon="icon-chevron-left"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full"
          />
          <p className="text-sm text-tertiary">
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="tertiary"
            size="sm"
            icon="icon-chevron-right"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}
