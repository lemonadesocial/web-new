export function ConfirmTransaction({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 space-y-4 w-[340px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
        <i aria-hidden="true" className="icon-loader animate-spin" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">{title}</p>
        <p className="text-sm text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}
