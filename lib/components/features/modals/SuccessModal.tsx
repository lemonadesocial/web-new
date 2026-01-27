import { Button, modal } from '$lib/components/core';

export function SuccessModal({
  title,
  description,
  onClose,
  buttonText = 'Done',
}: {
  title: string;
  description: string;
  onClose?: () => void;
  buttonText?: string;
}) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16">
        <i className="icon-done text-success-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">{title}</p>
        <p className="text-sm text-secondary break-words">{description}</p>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          onClose?.();
          modal.close();
        }}
        className="w-full"
      >
        {buttonText}
      </Button>
    </div>
  );
}
