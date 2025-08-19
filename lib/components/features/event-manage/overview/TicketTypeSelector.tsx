'use client';
import React from 'react';
import { Menu, MenuItem } from '$lib/components/core/menu';
import { Badge } from '$lib/components/core/badge';
import { EventTicketType } from '$lib/graphql/generated/backend/graphql';

interface TicketTypeSelectorProps {
  value: string[];
  onChange: (ticketIds: string[]) => void;
  ticketTypes: EventTicketType[];
}

export function TicketTypeSelector({
  value,
  onChange,
  ticketTypes
}: TicketTypeSelectorProps) {
  const [selected, setSelected] = React.useState<string[]>(value.length ? value : ticketTypes.map(type => type._id));

  const isAllSelected = selected.length === ticketTypes.length;

  const handleAllTicketsToggle = () => {
    if (isAllSelected) {
      setSelected([]);
      onChange([]);
      return;
    }

    const allTickets = ticketTypes.map(t => t._id);
    setSelected(allTickets);
    onChange(allTickets);
  };

  const handleTicketToggle = (ticketId: string) => {
    if (isAllSelected) {
      const newSelected = ticketTypes
        .map(t => t._id)
        .filter(id => id !== ticketId);
      setSelected(newSelected);
      onChange(newSelected);
      return;
    }

    const newSelected = selected.includes(ticketId)
      ? selected.filter(id => id !== ticketId)
      : [...selected, ticketId];

    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleRemoveTicket = (ticketId: string) => {
    const newSelected = selected.filter(id => id !== ticketId);
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <Menu.Root>
      <Menu.Trigger>
        <fieldset className="input-field">
          <div className="control px-1.5! py-1! flex items-center min-h-[40px] h-auto! w-full">
            <div className="flex-1 w-full flex flex-wrap gap-1">
              {isAllSelected ? (
                <Badge
                  title="All Tickets"
                  className="btn btn-tertiary text-primary! text-sm rounded py-0.5!"
                  onClose={(e) => {
                    e.stopPropagation();
                    handleAllTicketsToggle();
                  }}
                />
              ) : (
                selected.map((ticketId) => {
                  const ticketType = ticketTypes.find(t => t._id === ticketId);
                  if (!ticketType) return null;

                  return (
                    <Badge
                      key={ticketId}
                      title={ticketType.title}
                      className="btn btn-tertiary text-primary! text-sm rounded py-0.5! max-w-30"
                      onClose={(e) => {
                        e.stopPropagation();
                        handleRemoveTicket(ticketId);
                      }}
                    />
                  );
                })
              )}
            </div>
            <i className="icon-chevron-down size-5" />
          </div>
        </fieldset>
      </Menu.Trigger>
      <Menu.Content className="w-full p-0">
        {({ toggle }) => (
          <>
            <div className="p-1 max-h-[200px] overflow-auto no-scrollbar">
              <MenuItem
                title="All Tickets"
                iconRight={isAllSelected ? 'text-primary! icon-check-filled' : 'icon-circle-outline'}
                onClick={() => {
                  handleAllTicketsToggle();
                  toggle();
                }}
              />
              <hr className="border-t border-t-divider my-2 -mx-1" />
              {ticketTypes.map((ticketType) => (
                <MenuItem
                  key={ticketType._id}
                  iconLeft="icon-ticket"
                  iconRight={selected.includes(ticketType._id) ? 'text-primary! icon-check-filled' : 'icon-circle-outline'}
                  onClick={() => {
                    handleTicketToggle(ticketType._id);
                    toggle();
                  }}
                >
                  <p className="text-sm text-secondary flex-1 truncate">{ticketType.title}</p>
                </MenuItem>
              ))}
            </div>
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
