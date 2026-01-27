import { useState } from "react";

import { Button, Input, LabeledInput, modal, ModalContent } from "$lib/components/core";

export function TicketCapacityModal({ ticketLimit, onChange }: { ticketLimit: number | null; onChange: (limit: number | null) => void }) {
  const [limit, setLimit] = useState(ticketLimit);

  const handleConfirm = async () => {
    onChange(limit);
    modal.close();
  }

  return (
    <ModalContent icon="icon-vertical-align-top" onClose={() => modal.close()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Ticket Capacity</p>
          <p className="text-sm text-secondary">Limit how many of this ticket type are available. Only approved guests count toward the cap.</p>
        </div>

        <LabeledInput label="Capacity">
          <Input
            type="number"
            value={limit ?? ''}
            onChange={(e) => setLimit(e.target.valueAsNumber)}
            variant="outlined"
            placeholder="Unlimited"
            min={1}
          />
        </LabeledInput>

        <div className="flex gap-2">
          <Button
            variant="tertiary"
            className="w-full"
            onClick={() => {
              onChange(null);
              modal.close();
            }}
          >
            Remove Limit
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleConfirm}
          >
            Set Limit
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
