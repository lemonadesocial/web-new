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
  const [selected, setSelected] = React.useState<string[]>(value || []);

  React.useEffect(() => {
    setSelected(value || []);
  }, [value]);

  const handleToggle = (ticketId: string) => {
    const newSelected = selected.includes(ticketId)
      ? selected.filter(id => id !== ticketId)
      : [...selected, ticketId];
    
    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleRemove = (ticketId: string) => {
    const newSelected = selected.filter(id => id !== ticketId);
    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleAllTicketsToggle = () => {
    const newSelected = selected.length === 0 ? ticketTypes.map(type => type._id) : [];
    setSelected(newSelected);
    onChange(newSelected);
  };

  const selectedTicketTypes = ticketTypes.filter(ticketType => 
    selected.includes(ticketType._id)
  );

  return (
    <Menu.Root>
      <Menu.Trigger>
        <fieldset className="input-field">
          <div className="control px-1.5! py-1! flex items-center min-h-[40px] h-auto! w-full">
            <div className="flex-1 w-full flex flex-wrap gap-1">
              {selected.length === 0 ? (
                <Badge
                  title="All Tickets"
                  className="btn btn-tertiary text-primary! text-sm rounded py-0.5!"
                  onClose={(e) => {
                    e.stopPropagation();
                    handleAllTicketsToggle();
                  }}
                />
              ) : (
                selectedTicketTypes.map((ticketType) => (
                  <Badge
                    key={ticketType._id}
                    title={ticketType.title}
                    className="btn btn-tertiary text-primary! text-sm rounded py-0.5! max-w-30"
                    onClose={(e) => {
                      e.stopPropagation();
                      handleRemove(ticketType._id);
                    }}
                  />
                ))
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
                iconRight={selected.length === 0 ? 'text-primary! icon-check-filled' : 'icon-circle-outline'}
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
                    handleToggle(ticketType._id);
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
