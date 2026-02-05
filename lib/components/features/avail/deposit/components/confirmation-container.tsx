"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import SummaryCard from "./summary-card";
import { GasPumpIcon, CoinIcon } from "./icons";
import WidgetHeader from "./widget-header";
import { ReceiveAmountDisplay } from "./receive-amount-display";
import { ErrorBanner } from "./error-banner";
import type { DepositWidgetContextValue } from "../types";
import { Button } from "$lib/components/core/button/button";
import { CardContent } from "../../ui/card";
import { usdFormatter } from "../../common";
import { formatTokenBalance } from "@avail-project/nexus-core";
import { useNexus } from "../../nexus/NexusProvider";

interface ConfirmationContainerProps {
  widget: DepositWidgetContextValue;
  heading?: string;
  onClose?: () => void;
}

const ConfirmationContainer = ({
  widget,
  heading,
  onClose,
}: ConfirmationContainerProps) => {
  const [showSpendDetails, setShowSpendDetails] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const { getFiatValue } = useNexus();

  const {
    confirmationDetails,
    feeBreakdown,
    handleConfirmOrder,
    isProcessing,
    txError,
    activeIntent,
    simulationLoading,
  } = widget;

  const isLoading = simulationLoading || !activeIntent;

  const receiveAmount =
    confirmationDetails?.receiveAmountAfterSwapUsd?.toFixed(2) ?? "0";
  const timeLabel = confirmationDetails?.estimatedTime ?? "~30s";
  // This is in USD
  const amountSpent = confirmationDetails?.amountSpent;
  // TODO: Ensure unique names are displayed
  const tokenNames = confirmationDetails?.sources
    .filter((s) => s)
    .map((s) => s?.symbol)
    .slice(0, 2)
    .join(", ");
  const moreCount =
    (confirmationDetails?.sources.filter((s) => s).length ?? 0) - 2;
  const tokenNamesSummary =
    moreCount > 0 ? `${tokenNames} + ${moreCount} more` : tokenNames;

  // Combined filter + map into single iteration (js-combine-iterations)
  const sourceDetails = useMemo(() => {
    if (!confirmationDetails?.sources) return [];
    const result: Array<{
      chainName: string;
      chainLogo: string | undefined;
      tokenSymbol: string;
      tokenDecimals: number;
      amount: string;
      isDestinationBalance: boolean;
    }> = [];
    for (const source of confirmationDetails.sources) {
      if (!source) continue;
      result.push({
        chainName: source.chainName ?? "",
        chainLogo: source.chainLogo,
        tokenSymbol: source.symbol ?? "",
        tokenDecimals: source.decimals ?? 6,
        amount: source.balance ?? "0",
        isDestinationBalance: source.isDestinationBalance ?? false,
      });
    }
    return result;
  }, [confirmationDetails]);

  return (
    <>
      <WidgetHeader
        title={heading ?? ""}
        onBack={widget.goBack}
        onClose={onClose}
        depositTargetLogo={widget?.destination?.depositTargetLogo}
      />
      <CardContent>
        <div className="flex flex-col">
          <div className="bg-base rounded-t-lg border-t border-l border-r shadow-[0_1px_12px_0_rgba(91,91,91,0.05)] px-6 pt-10 pb-1 flex flex-col gap-6">
            <ReceiveAmountDisplay
              amount={receiveAmount}
              timeLabel={timeLabel}
              loading={isLoading}
              destinationTokenLogo={widget?.destination?.tokenLogo}
              depositTargetLogo={widget?.destination?.depositTargetLogo}
            />
            <div>
              <SummaryCard
                icon={<CoinIcon className="w-5 h-5 text-muted-foreground" />}
                title="You spend"
                subtitle={
                  isLoading
                    ? "Calculating..."
                    : tokenNamesSummary || "Selected assets"
                }
                value={String(amountSpent)}
                valueSuffix="USD"
                showBreakdown={!isLoading && sourceDetails.length > 0}
                loading={isLoading}
                expanded={showSpendDetails}
                onToggleExpand={() => setShowSpendDetails(!showSpendDetails)}
              >
                <div className="space-y-4">
                  {sourceDetails.map((source, index) => {
                    const amountUsd = getFiatValue(
                      parseFloat(source.amount),
                      source.tokenSymbol,
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {source.chainLogo && (
                            <img
                              src={source.chainLogo}
                              alt={source.chainName}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans text-base text-card-foreground">
                              {source.tokenSymbol}
                            </span>
                            <span className="font-sans text-sm text-secondary">
                              {source.chainName}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 items-end">
                          <span className="font-sans text-base text-card-foreground">
                            {usdFormatter.format(amountUsd)}USD
                          </span>
                          <span className="font-sans text-sm text-secondary">
                            {formatTokenBalance(parseFloat(source.amount), {
                              decimals: source.tokenDecimals,
                              symbol: source.tokenSymbol,
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SummaryCard>

              <SummaryCard
                icon={<GasPumpIcon className="w-5 h-5 text-muted-foreground" />}
                title="Total fees"
                value={(confirmationDetails?.totalFeeUsd ?? 0).toFixed(2)}
                valueSuffix="USD"
                showBreakdown={false}
                loading={isLoading}
                expanded={false}
              />
            </div>
          </div>
          {txError && widget.status === "error" && (
            <ErrorBanner message={txError} />
          )}
          <Button
            variant="secondary"
            onClick={handleConfirmOrder}
            disabled={isProcessing || isLoading}
          >
            {isProcessing
              ? "Fetching quote"
              : isLoading
                ? "Fetching quote"
                : "Confirm and deposit"}
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default ConfirmationContainer;
