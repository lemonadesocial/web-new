import { InfoIcon } from "./icons";

interface ErrorBannerProps {
  message: string;
  icon?: boolean;
}

export function ErrorBanner({ message, icon = true }: ErrorBannerProps) {
  return (
    <div className="py-2 px-3 bg-destructive/10 rounded-lg flex items-center gap-2 justify-center">
      {icon && <InfoIcon className="h-5 w-5 text-destructive shrink-0" />}
      <span className="font-sans text-[14px] leading-[22px] text-destructive break-all">
        {message}
      </span>
    </div>
  );
}
