"use client";

import { useCallback, useMemo, useState } from "react";
import WidgetHeader from "./widget-header";
import type { DepositWidgetContextValue } from "../types";
import AmountCard from "./amount-card";
import PayUsing from "./pay-using";
import { ErrorBanner } from "./error-banner";
import { Button } from "$lib/components/core/button/button";
import { CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

interface AmountContainerProps {
  widget: DepositWidgetContextValue;
  heading?: string;
  onClose?: () => void;
}

const AmountContainer = ({
  widget,
  heading,
  onClose,
}: AmountContainerProps) => {
  const [hasAmountError, setHasAmountError] = useState(false);
  const selectedTokenAmount = useMemo(
    () => widget.totalSelectedBalance,
    [widget.totalSelectedBalance],
  );

  const handleAmountChange = useCallback(
    (amount: string) => {
      widget.setInputs({ amount });
    },
    [widget.setInputs],
  );

  const handleErrorStateChange = useCallback((hasError: boolean) => {
    setHasAmountError(hasError);
  }, []);

  return (
    <>
      <WidgetHeader
        title={heading ?? ""}
        onClose={onClose}
        depositTargetLogo={widget?.destination?.depositTargetLogo}
      />
      <CardContent>
        <div className="flex flex-col gap-4">
          {widget.totalBalance?.balance && widget?.totalBalance?.usdBalance ? (
            <AmountCard
              totalBalance={widget.totalBalance!}
              amount={widget.inputs.amount ?? ""}
              onAmountChange={handleAmountChange}
              selectedTokenAmount={selectedTokenAmount}
              onErrorStateChange={handleErrorStateChange}
              totalSelectedBalance={widget.totalSelectedBalance}
              destinationConfig={widget.destination}
            />
          ) : (
            <Skeleton className="min-h-[212px]" />
          )}

          {widget.txError && widget.status === "error" && (
            <ErrorBanner message={widget.txError} />
          )}
          <div className="flex flex-col">
            <PayUsing
              onClick={() => widget.goToStep("asset-selection")}
              selectedChainIds={widget.assetSelection.selectedChainIds}
              amount={widget.inputs.amount}
              swapBalance={widget.swapBalance}
            />
            <Button
              variant="secondary"
              onClick={() => widget.goToStep("confirmation")}
              disabled={
                widget.isProcessing ||
                hasAmountError ||
                !widget.inputs.amount ||
                widget.inputs.amount === "0"
              }
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default AmountContainer;
