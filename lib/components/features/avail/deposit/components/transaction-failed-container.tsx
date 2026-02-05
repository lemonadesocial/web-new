"use client";

import { CardContent, CardFooter } from "../../ui/card";
import { Button } from "$lib/components/core/button/button";
import WidgetHeader from "./widget-header";
import { ReceiveAmountDisplay } from "./receive-amount-display";
import type { DepositWidgetContextValue } from "../types";

interface TransactionFailedContainerProps {
  widget: DepositWidgetContextValue;
  heading?: string;
  onClose?: () => void;
}

const TransactionFailedContainer = ({
  widget,
  heading,
  onClose,
}: TransactionFailedContainerProps) => {
  const handleRetry = () => {
    widget.setTxError(null);
    widget.reset();
    widget.goToStep("amount");
  };

  const handleClose = () => {
    widget.reset();
    onClose?.();
  };

  return (
    <>
      <WidgetHeader
        title={heading ?? ""}
        onClose={onClose}
        depositTargetLogo={widget?.destination?.depositTargetLogo}
      />
      <CardContent>
        <div className="flex flex-col">
          <div className="bg-base rounded-t-lg border-t border-l border-r border-border shadow-[0_1px_12px_0_rgba(91,91,91,0.05)] px-6 pt-6 pb-6 flex flex-col items-center gap-5">
            <ReceiveAmountDisplay
              label="Transaction failed"
              amount="-$0.00"
              timeLabel=""
              showClockIcon={false}
              showUsdValue={false}
            />
            <div className="w-full bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-4 overflow-hidden">
              <p className="font-sans text-base leading-5 text-destructive break-all">
                {widget?.txError ??
                  `It's not you, it's us. Everything seems to be in order from your
                side, our engineers might have broken something.`}
              </p>
              <p className="font-sans text-base leading-5 text-destructive mt-3">
                Retry in a bit?
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              onClick={handleRetry}
            >
              Retry
            </Button>
            <Button
              variant="tertiary"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter />
    </>
  );
};

export default TransactionFailedContainer;
