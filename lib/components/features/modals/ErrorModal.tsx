import { Button } from "$lib/components/core";

export function ErrorModal({ title, message, onRetry, onClose }: { title: string; message: string; onRetry?: () => void, onClose: () => void }) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-danger-400/16">
        <i className="icon-error text-danger-400" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">{title}</p>
        <p className="text-sm text-secondary">
          {message}
        </p>
      </div>
      <div className="flex gap-3">
      <Button variant="tertiary" onClick={onClose} className="w-full">
        Cancel
      </Button>
      {
        onRetry && (
          <Button
            variant="secondary"
            onClick={onRetry}
            className="w-full"
          >
            Retry
          </Button>
        )
      }
      </div>
    </div>
  );
}
