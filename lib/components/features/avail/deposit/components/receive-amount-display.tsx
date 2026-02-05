import { TokenIcon } from "./token-icon";
import { ClockIcon } from "./icons";
import { DEPOSIT_WIDGET_ASSETS } from "../constants/assets";
import { Skeleton } from "../../ui/skeleton";
import { usdFormatter } from "../../common";

interface ReceiveAmountDisplayProps {
  label?: string;
  amount: string;
  timeLabel?: string;
  showUsdValue?: boolean;
  showClockIcon?: boolean;
  loading?: boolean;
  destinationTokenLogo?: string;
  depositTargetLogo?: string;
}

export function ReceiveAmountDisplay({
  label = "You receive",
  amount,
  timeLabel,
  showUsdValue = true,
  showClockIcon = true,
  loading = false,
  destinationTokenLogo,
  depositTargetLogo,
}: ReceiveAmountDisplayProps) {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <span className="font-sans text-base leading-5 text-secondary">
        {label}
      </span>
      <div className="w-full flex items-center justify-center gap-3">
        {/* <TokenIcon
          tokenSrc={destinationTokenLogo || DEPOSIT_WIDGET_ASSETS.tokens.USDC}
          protocolSrc={
            depositTargetLogo || DEPOSIT_WIDGET_ASSETS.protocols.aave
          }
          tokenAlt={destinationTokenLogo}
        /> */}
        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <h3 className="font-display text-[32px] tracking-[0.64px] font-medium">
            {amount}
          </h3>
        )}
      </div>
      {(showUsdValue || showClockIcon) && (
        <div className="font-sans flex items-center gap-x-1 text-base leading-5 text-secondary mt-1">
          {loading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <div className="flex items-center gap-x-1">
              {showUsdValue && `${usdFormatter.format(parseFloat(amount))} in`}
              {showClockIcon && (
                <span className="flex items-center gap-x-1">
                  {timeLabel}
                  <ClockIcon className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
