import { useMemo, useState, useEffect, useRef } from "react";
import ButtonCard from "./button-card";
import { RightChevronIcon, CoinIcon } from "./icons";
import { Skeleton } from "../../ui/skeleton";
import { LOADING_SKELETON_DELAY_MS } from "../constants/widget";

interface PayUsingProps {
  onClick?: () => void;
  selectedChainIds: Set<string>;
  amount?: string;
  swapBalance: Array<{
    symbol: string;
    decimals: number;
    icon?: string;
    breakdown?: Array<{
      chain: { id: number; name: string; logo?: string };
      balance: string;
      balanceInFiat?: number;
      contractAddress?: `0x${string}`;
    }>;
  }> | null;
}

function PayUsing({
  onClick,
  selectedChainIds,
  amount,
  swapBalance,
}: PayUsingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const previousAmountRef = useRef<string | undefined>(undefined);
  const hasAmount = Boolean(amount && amount.trim() !== "" && amount !== "0");

  useEffect(() => {
    const hadAmount = Boolean(
      previousAmountRef.current && previousAmountRef.current.trim() !== "",
    );

    if (hasAmount && !hadAmount) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, LOADING_SKELETON_DELAY_MS);
      return () => clearTimeout(timer);
    }

    previousAmountRef.current = amount;
  }, [amount, hasAmount]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { subtitle, selectedCount, totalUsdValue } = useMemo(() => {
    const tokenCounts: Record<string, number> = {};
    let total = 0;

    if (swapBalance) {
      swapBalance.forEach((asset) => {
        const selectedChains =
          asset.breakdown?.filter((c) =>
            selectedChainIds.has(`${c.contractAddress}-${c.chain.id}`),
          ) ?? [];
        if (selectedChains.length > 0) {
          tokenCounts[asset.symbol] = selectedChains.length;
          selectedChains.forEach((c) => {
            total += c.balanceInFiat ?? 0;
          });
        }
      });
    }

    const symbols = Object.keys(tokenCounts);
    const count = Object.values(tokenCounts).reduce((a, b) => a + b, 0);

    let text: string;
    if (count === 0) {
      text = "No tokens selected";
    } else if (symbols.length <= 2) {
      text = symbols.join(", ");
    } else {
      text = `${symbols.slice(0, 2).join(", ")} +${symbols.length - 2} more`;
    }

    return {
      subtitle: text,
      selectedCount: count,
      totalUsdValue: total,
    };
  }, [selectedChainIds, swapBalance]);

  const renderSubtitle = () => {
    if (!hasAmount) {
      return (
        <span className="text-sm leading-5 text-secondary font-sans">
          Auto-selected based on amount
        </span>
      );
    }

    if (isLoading) {
      return <Skeleton className="h-4 w-32 bg-muted" />;
    }

    return (
      <span className="text-sm leading-5 text-secondary font-sans">
        {subtitle}
      </span>
    );
  };

  const showEditControls = hasAmount && !isLoading;

  return (
    <ButtonCard
      title="Pay using"
      subtitle={renderSubtitle()}
      icon={<CoinIcon className="w-6 h-6 text-muted-foreground" />}
      rightIcon={
        showEditControls ? (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-base leading-5 transition-colors duration-200 group-hover/button-card:text-card-foreground">
              Edit
            </span>
            <RightChevronIcon
              size={20}
              className="text-muted-foreground transition-colors duration-200 group-hover/button-card:text-card-foreground"
            />
          </div>
        ) : undefined
      }
      onClick={showEditControls ? onClick : undefined}
      disabled={!showEditControls}
      roundedBottom={false}
    />
  );
}

export default PayUsing;
