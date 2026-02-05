"use client";

import { useState } from "react";
import WidgetHeader from "./widget-header";
import { ReceiveAmountDisplay } from "./receive-amount-display";
import type { DepositWidgetContextValue } from "../types";
import { ArrowBoxUpRightIcon, ChevronDownIcon, ChevronUpIcon } from "./icons";
import { CardContent, CardFooter } from "../../ui/card";
import { Button } from "$lib/components/core/button/button";
import { usdFormatter } from "../../common";

function formatTimer(seconds: number): string {
  const secs = Math.round(seconds);
  return `${secs}s`;
}

function truncateHash(hash: string): string {
  if (hash.length <= 13) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

interface TransactionCompleteContainerProps {
  widget: DepositWidgetContextValue;
  heading?: string;
  onClose?: () => void;
}

const TransactionCompleteContainer = ({
  widget,
  heading,
  onClose,
}: TransactionCompleteContainerProps) => {
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  const handleNewDeposit = () => {
    widget.reset();
    widget.goToStep("amount");
  };

  const handleClose = () => {
    widget.reset();
    onClose?.();
  };

  // Use user's requested amount
  const receiveAmountUsd =
    widget.confirmationDetails?.receiveAmountAfterSwapUsd?.toFixed(2) ?? "0";
  const completionTime = formatTimer(widget.timer);

  const hasSourceSwaps = widget.sourceSwaps.length > 0;

  // Build deposit transaction URL
  const depositTxUrl =
    widget.destination.explorerUrl && widget.depositTxHash
      ? `${widget.destination.explorerUrl}/tx/${widget.depositTxHash}`
      : null;

  return (
    <>
      <WidgetHeader
        title={heading ?? ""}
        onClose={onClose}
        depositTargetLogo={widget?.destination?.depositTargetLogo}
      />
      <CardContent>
        <div className="flex flex-col">
          <div className="bg-base rounded-t-lg border-t border-l border-r border-border shadow-[0_1px_12px_0_rgba(91,91,91,0.05)] px-6 pt-6 pb-1 flex flex-col items-center gap-5">
            <ReceiveAmountDisplay
              label="You received"
              amount={receiveAmountUsd}
              timeLabel={completionTime}
            />
            <span className="font-sans text-base w-full text-center leading-5 text-secondary">
              Transaction successful
            </span>
            <div className="w-full">
              <div className="border-t py-5 flex flex-col gap-5">
                {/* Collected on sources section - only show when swap was not skipped */}
                {!widget.skipSwap && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-base leading-5 text-card-foreground">
                        Collected on sources
                      </span>
                      <button
                        className="font-sans flex gap-0.5 text-secondary text-base leading-5 underline cursor-pointer items-center"
                        onClick={() => setShowSourceDetails(!showSourceDetails)}
                      >
                        {showSourceDetails ? (
                          <>
                            {" "}
                            Hide details
                            <ChevronUpIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            View details
                            <ChevronDownIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        showSourceDetails
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex gap-3 flex-wrap pt-2 pb-3">
                          {hasSourceSwaps
                            ? // Show individual source chain links
                              widget.sourceSwaps.map((swap, index) => (
                                <a
                                  key={`${swap.chainId}-${index}`}
                                  href={swap.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-sans flex gap-1 items-center text-secondary text-base leading-5 underline transition-all"
                                  style={{
                                    animationDelay: showSourceDetails
                                      ? `${index * 50}ms`
                                      : "0ms",
                                  }}
                                >
                                  {swap.chainName}
                                  <ArrowBoxUpRightIcon
                                    size={16}
                                    className="text-muted-foreground transition-colors"
                                  />
                                </a>
                              ))
                            : // No source swaps - show Nexus intent URL
                              widget.nexusIntentUrl && (
                                <a
                                  href={widget.nexusIntentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-sans flex gap-1 items-center text-secondary text-base leading-5 underline transition-all"
                                >
                                  View on Nexus Explorer
                                  <ArrowBoxUpRightIcon
                                    size={16}
                                    className="text-muted-foreground transition-colors"
                                  />
                                </a>
                              )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deposit transaction */}
                {depositTxUrl && (
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-base leading-5 text-card-foreground">
                      Deposit transaction
                    </span>
                    <a
                      href={depositTxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans flex gap-0.5 text-secondary text-base leading-5 underline cursor-pointer"
                    >
                      {truncateHash(widget.depositTxHash ?? "")}
                      <ArrowBoxUpRightIcon
                        size={16}
                        className="text-muted-foreground"
                      />
                    </a>
                  </div>
                )}
              </div>

              {/* Fees section */}
              <div className="border-t py-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-sans text-base leading-5 text-card-foreground">
                      Total fees
                    </span>
                  </div>
                  <span className="font-sans text-secondary text-base leading-5">
                    {usdFormatter.format(
                      widget.feeBreakdown.gasUsd +
                        (widget?.confirmationDetails?.totalFeeUsd ?? 0),
                    )}
                    USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              onClick={handleNewDeposit}
            >
              New Deposit
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

export default TransactionCompleteContainer;
