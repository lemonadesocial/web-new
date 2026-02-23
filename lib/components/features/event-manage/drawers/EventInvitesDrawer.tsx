
import { Avatar, Button, drawer, Badge, Chip } from "$lib/components/core";
import { Event, GetEventInvitedStatisticsDocument, InvitationResponse } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { randomUserImage, userAvatar } from "$lib/utils/user";
import { format } from "date-fns";
import { useState } from "react";

type StatusTabProps = {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
};

function StatusTab({ label, count, isSelected, onClick }: StatusTabProps) {
  return (
    <div
      className={`pb-1 border-b-2 transition-colors cursor-pointer flex gap-1.5 ${
        isSelected 
          ? 'text-primary border-primary' 
          : 'text-tertiary border-transparent hover:text-primary'
      }`}
      onClick={onClick}
    >
      <p>{label}</p>
      <p className="text-tertiary">{count}</p>
    </div>
  );
}

export function EventInvitesDrawer({ event }: { event: Event }) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'accepted' | 'declined' | 'outstanding'>('all');
  
  const { data: filteredData } = useQuery(GetEventInvitedStatisticsDocument, {
    variables: {
      id: event._id,
      limit: 100,
      statuses: selectedStatus === 'all' ? undefined : 
        selectedStatus === 'accepted' ? [InvitationResponse.Accepted] :
        selectedStatus === 'declined' ? [InvitationResponse.Declined] :
        [InvitationResponse.Pending, InvitationResponse.Unsure, InvitationResponse.Cancelled],
    },
  });

  const { data: totalData } = useQuery(GetEventInvitedStatisticsDocument, {
    variables: {
      id: event._id,
      limit: 1,
    },
  });

  const stats = filteredData?.getEventInvitedStatistics;
  const totalStats = totalData?.getEventInvitedStatistics;
  const guests = stats?.guests || [];

  const getStatusCount = (status: string) => {
    switch (status) {
      case 'all':
        return totalStats?.total || 0;
      case 'accepted':
        return totalStats?.total_joined || 0;
      case 'declined':
        return totalStats?.total_declined || 0;
      case 'outstanding':
        return (totalStats?.total || 0) - (totalStats?.total_joined || 0) - (totalStats?.total_declined || 0);
      default:
        return 0;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} aria-label="Close drawer" />
        <p>Invite Stats</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <h1 className="text-xl font-semibold px-4 pt-4 pb-1">All Invittes</h1>
        
        <div className="flex items-center gap-6 px-4 pt-3 border-b border-card-border">
          <StatusTab
            label="Sent"
            count={getStatusCount('all')}
            isSelected={selectedStatus === 'all'}
            onClick={() => setSelectedStatus('all')}
          />
          <StatusTab
            label="Accepted"
            count={getStatusCount('accepted')}
            isSelected={selectedStatus === 'accepted'}
            onClick={() => setSelectedStatus('accepted')}
          />
          <StatusTab
            label="Declined"
            count={getStatusCount('declined')}
            isSelected={selectedStatus === 'declined'}
            onClick={() => setSelectedStatus('declined')}
          />
          <StatusTab
            label="Outstanding"
            count={getStatusCount('outstanding')}
            isSelected={selectedStatus === 'outstanding'}
            onClick={() => setSelectedStatus('outstanding')}
          />
        </div>

        <div className="pt-4 px-4">
        <div className="divide-y divide-card-border bg-card border-card-border rounded-md">
          {guests.map((guest: any, index: number) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={userAvatar(guest)} className="size-5" />
              <div className="flex-1 flex gap-2">
                <p className="truncate">
                  {guest.user_expanded?.display_name || 'Anonymous'}
                </p>
                <p className="text-tertiary">{guest.email}</p>
              </div>
              {guest.joined ? (
                <Chip variant="success" size="xxs" className="rounded-full">Going</Chip>
              ) : guest.declined ? (
                <Chip variant="error" size="xxs" className="rounded-full">Not Going</Chip>
              ) : (
                <Chip variant="warning" size="xxs" className="rounded-full">Pending</Chip>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
