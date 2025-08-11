import { useState } from "react";
import { format } from "date-fns";
import { snakeCase } from "lodash";

import { Button, Input } from "$lib/components/core";
import { downloadCSVFile } from "$lib/utils/file";
import { useQuery } from "$lib/graphql/request";
import { Event, ListEventGuestsDocument } from "$lib/graphql/generated/backend/graphql";

import { GuestTable } from "./GuestTable";

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

      <GuestTable 
        event={event} 
        guests={guests} 
        loading={loading} 
        pageSize={pageSize} 
      />

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
