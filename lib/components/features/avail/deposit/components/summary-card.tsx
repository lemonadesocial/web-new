import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import { Skeleton } from "../../ui/skeleton";
import { usdFormatter } from "../../common";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string;
  valueSuffix?: string;
  showBreakdown?: boolean;
  loading?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
}

function SummaryCard({
  icon,
  title,
  subtitle,
  value,
  valueSuffix,
  showBreakdown,
  loading = false,
  expanded = false,
  onToggleExpand,
  children,
}: SummaryCardProps) {
  return (
    <div className="border-t border-border py-5">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          {icon}
          <div className="flex-col flex gap-2">
            <span className="font-sans text-base leading-5 text-card-foreground">
              {title}
            </span>
            {subtitle && (
              <span className="font-sans text-sm leading-5 text-secondary">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-1 items-end">
            {loading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <>
                <span className="font-display text-card-foreground tracking-[0.36px] leading-5 font-medium">
                  {valueSuffix === "USD"
                    ? usdFormatter.format(parseFloat(value))
                    : value}
                </span>
                {valueSuffix && (
                  <span className="text-secondary text-sm leading-5">
                    {valueSuffix}
                  </span>
                )}
              </>
            )}
          </div>
          {showBreakdown && (
            <button
              className="flex gap-0.5 cursor-pointer"
              onClick={onToggleExpand}
            >
              <span className="font-sans text-sm underline leading-5 text-secondary underline-offset-2">
                View details
              </span>
              {expanded ? (
                <ChevronUpIcon size={16} className="text-muted-foreground" />
              ) : (
                <ChevronDownIcon size={16} className="text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>
      {expanded && children && (
        <div className="mt-4 p-4 bg-background/30">{children}</div>
      )}
    </div>
  );
}

export default SummaryCard;
