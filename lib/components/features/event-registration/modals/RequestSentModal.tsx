import { Button, modal } from "$lib/components/core";

export const RequestSentModal = () => {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16">
        <i aria-hidden="true" className="icon-done text-success-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Request Sent!</p>
        <p className="text-sm text-secondary">
          Your payment has been confirmed, and your request to join the event has been sent to the host. We will let you know when the host approves your registration.
        </p>
      </div>
      <Button variant="secondary" onClick={() => modal.close()} className="w-full">
        Done
      </Button>
    </div>
  );
};
