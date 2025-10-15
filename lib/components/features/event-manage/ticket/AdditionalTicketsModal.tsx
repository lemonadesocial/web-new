import { useState } from "react";

import { Button, Input, LabeledInput, modal, ModalContent, Toggle } from "$lib/components/core";

export function AdditionalTicketsModal({ ticketLimitPer, onChange }: { ticketLimitPer: number | null; onChange: (limit: number | null) => void }) {
  const [limit, setLimit] = useState(ticketLimitPer);
  const [allowAdditionalTickets, setAllowAdditionalTickets] = useState(!!(ticketLimitPer === null || ticketLimitPer && ticketLimitPer > 1));

  const handleConfirm = async () => {
    onChange(limit);
    modal.close();
  }

  return (
    <ModalContent icon="icon-ticket-plus" onClose={() => modal.close()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Additional Tickets</p>
          <p className="text-sm text-secondary">If turned on, guests will be able to get multiple tickets of this type. You can set a cap per guest.</p>
        </div>

        <div className="flex items-center justify-between">
          <p>Allow Additional Tickets</p>
          <Toggle
            id="accept-registration"
            checked={allowAdditionalTickets}
            onChange={(checked) => {
              setAllowAdditionalTickets(checked);
              setLimit(checked ? 2 : 1);
            }}
          />
        </div>

        {
          allowAdditionalTickets && (
            <LabeledInput label="Ticket Limit per Guest">
            <div className="relative">
              <Input
                type="number"
                value={limit === null ? '' : limit}
                onChange={(e) => {
                  const val = e.target.value;
                  setLimit(val === '' ? null : e.target.valueAsNumber);
                }}
                variant="outlined"
                className="[-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Unlimited"
              />
              <i className="icon-cancel size-5 text-quaternary cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2" onClick={() => setLimit(null)} />
            </div>
          </LabeledInput>
          )
        }
        
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </ModalContent>
  );
}
