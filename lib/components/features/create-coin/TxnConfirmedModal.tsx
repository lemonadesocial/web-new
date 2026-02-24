import { Button, modal } from '$lib/components/core';

export function TxnConfirmedModal({
  title,
  description,
  txUrl
}: {
  title: string;
  description: string;
  txUrl?: string;
}) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16">
        <i aria-hidden="true" className="icon-done text-success-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">{title}</p>
        <p className="text-sm text-secondary break-words">{description}</p>
      </div>
      <div className="flex gap-2">
        {txUrl && (
          <Button
            variant="tertiary"
            onClick={() => window.open(txUrl, '_blank')}
            className="w-full flex-1"
          >
            View Txn.
          </Button>)
        }
        <Button
          variant="secondary"
          onClick={() => modal.close()}
          className="w-full flex-1"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
