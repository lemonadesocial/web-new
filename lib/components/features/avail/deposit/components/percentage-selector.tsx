"use client";

const PERCENTAGE_OPTIONS = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "MAX", value: 1 },
] as const;

interface PercentageButtonProps {
  label: string;
  onClick: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

function PercentageButton({
  label,
  onClick,
  isFirst,
  isLast,
}: PercentageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 bg-card max-w-[60px] h-[34px] flex items-center justify-center w-full px-4 font-sans text-base leading-5 hover:bg-muted transition-colors cursor-pointer ${
        !isLast ? "border-r border-border" : ""
      } ${isFirst ? "rounded-l-lg" : ""} ${isLast ? "rounded-r-lg" : ""}`}
    >
      {label}
    </button>
  );
}

export interface PercentageSelectorProps {
  onPercentageClick: (percentage: number) => void;
}

export function PercentageSelector({
  onPercentageClick,
}: PercentageSelectorProps) {
  return (
    <div className="relative mt-[42px]">
      <div className="h-px w-full bg-border" />
      <div className="absolute flex top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-base h-9 rounded-lg border">
        {PERCENTAGE_OPTIONS.map((option, index) => (
          <PercentageButton
            key={option.label}
            label={option.label}
            onClick={() => onPercentageClick(option.value)}
            isFirst={index === 0}
            isLast={index === PERCENTAGE_OPTIONS.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
