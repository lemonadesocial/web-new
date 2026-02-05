interface AmountDisplayProps {
  amount: string;
  suffix: string;
  label: string;
  align?: "left" | "center" | "right";
  size?: "default" | "compact";
}

export function AmountDisplay({
  amount,
  suffix,
  label,
  align = "center",
  size = "default",
}: AmountDisplayProps) {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  const amountSizeClasses = {
    default: "text-[23px] tracking-[0.52px]",
    compact: "text-xl tracking-[0.4px]",
  };

  const suffixSizeClasses = {
    default: "text-base",
    compact: "text-sm text-secondary",
  };

  const labelSizeClasses = {
    default: "text-base",
    compact: "text-sm text-secondary",
  };

  return (
    <div className={`flex flex-col gap-0.5 ${alignmentClasses[align]} w-1/3`}>
      <div className="flex items-baseline gap-1">
        <span
          className={`font-display text-card-foreground font-medium leading-tight ${amountSizeClasses[size]}`}
        >
          {amount}
        </span>
        <span
          className={`text-muted-foreground font-sans ${suffixSizeClasses[size]}`}
        >
          {suffix}
        </span>
      </div>
      <div
        className={`text-muted-foreground leading-5 font-sans ${labelSizeClasses[size]}`}
      >
        {label}
      </div>
    </div>
  );
}
