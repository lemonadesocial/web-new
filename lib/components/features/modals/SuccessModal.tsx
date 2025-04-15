import { Button, modal } from "$lib/components/core";

export function SuccessModal({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16">
        <i className="icon-done text-success-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">{title}</p>
        <p className="text-sm text-secondary">
          {description}
        </p>
      </div>
      <Button variant="secondary" onClick={() => modal.close()} className="w-full">
        Done
      </Button>
    </div>
  )
}
