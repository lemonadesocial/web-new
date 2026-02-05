"use client";

import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { TokenIcon } from "./token-icon";
import { ErrorBanner } from "./error-banner";
import { PercentageSelector } from "./percentage-selector";
import { parseCurrencyInput } from "../utils";
import { UpDownArrows } from "./icons";
import { usdFormatter } from "../../common";
import { type DestinationConfig } from "../types";
import {
  BALANCE_SAFETY_MARGIN,
  CHARACTER_ANIMATION_DURATION_MS,
  SHINE_ANIMATION_DURATION_MS,
  MAX_INPUT_WIDTH_PX,
} from "../constants/widget";

// Hoisted RegExp to avoid recreation on every render (js-hoist-regexp)
const NUMERIC_INPUT_REGEX = /^\d*\.?\d*$/;

interface AmountCardProps {
  amount?: string;
  onAmountChange?: (amount: string) => void;
  selectedTokenAmount?: number;
  onErrorStateChange?: (hasError: boolean) => void;
  totalSelectedBalance: number;
  totalBalance: {
    balance: number;
    usdBalance: number;
  };
  destinationConfig: DestinationConfig;
}

function AmountCard({
  amount: externalAmount,
  onAmountChange,
  selectedTokenAmount = 0,
  onErrorStateChange,
  totalSelectedBalance,
  totalBalance,
  destinationConfig,
}: AmountCardProps) {
  const [internalAmount, setInternalAmount] = useState("");
  const amount = externalAmount ?? internalAmount;
  const setAmount = onAmountChange ?? setInternalAmount;

  const [inputWidth, setInputWidth] = useState(0);
  const [isShining, setIsShining] = useState(false);
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(
    new Set(),
  );
  const prevAmountRef = useRef<string>("");
  const prevLengthRef = useRef(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = amount || "";
  const measureText = displayValue || "0";

  // Split display value into characters for animation
  const displayChars = displayValue.split("");

  // Track which characters should animate (newly added ones)
  useEffect(() => {
    const currentLength = displayValue.length;
    const prevLength = prevLengthRef.current;

    // Only animate when characters are added (not removed)
    if (currentLength > prevLength) {
      const newIndices = new Set<number>();
      for (let i = prevLength; i < currentLength; i++) {
        newIndices.add(i);
      }
      setAnimatingIndices(newIndices);

      // Clear animation after it completes
      const timer = setTimeout(() => {
        setAnimatingIndices(new Set());
      }, CHARACTER_ANIMATION_DURATION_MS);

      prevLengthRef.current = currentLength;
      return () => clearTimeout(timer);
    }

    prevLengthRef.current = currentLength;
  }, [displayValue]);

  // Calculate numeric amount for USD equivalent
  const numericAmount = useMemo(() => {
    if (!amount) return 0;
    const parsed = parseFloat(amount.replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }, [amount]);

  // Check if amount exceeds wallet balance
  const exceedsBalance = useMemo(() => {
    if (!amount) return false;
    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    return !isNaN(numericAmount) && numericAmount > totalBalance?.usdBalance;
  }, [amount, totalBalance?.usdBalance]);

  // Check if amount exceeds selected token amount but is within wallet balance
  const exceedsSelectedTokens = useMemo(() => {
    if (!amount || selectedTokenAmount === 0) return false;
    const numericAmount = parseFloat(amount.replace(/,/g, ""));
    return (
      !isNaN(numericAmount) &&
      numericAmount > selectedTokenAmount &&
      numericAmount <= totalBalance?.usdBalance
    );
  }, [amount, selectedTokenAmount, totalBalance?.usdBalance]);

  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth);
    }
  }, [measureText]);

  // Trigger shine effect when USD amount changes
  useEffect(() => {
    if (amount && amount !== prevAmountRef.current && numericAmount > 0) {
      setIsShining(true);
      const timer = setTimeout(() => {
        setIsShining(false);
      }, SHINE_ANIMATION_DURATION_MS);
      prevAmountRef.current = amount;
      return () => clearTimeout(timer);
    }
    prevAmountRef.current = amount;
  }, [amount, numericAmount]);

  // Notify parent of error state changes
  useEffect(() => {
    const hasError = exceedsBalance || exceedsSelectedTokens;
    onErrorStateChange?.(hasError);
  }, [exceedsBalance, exceedsSelectedTokens, onErrorStateChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = parseCurrencyInput(e.target.value);

      // Validate numeric input (allow unlimited decimals)
      if (rawValue === "" || NUMERIC_INPUT_REGEX.test(rawValue)) {
        setAmount(rawValue);
      }
    },
    [setAmount],
  );

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const safeBalance = totalBalance?.usdBalance * BALANCE_SAFETY_MARGIN;
      const calculatedAmount = safeBalance * percentage;
      const newAmount = usdFormatter.format(calculatedAmount).replace("$", "");
      setAmount(newAmount);
    },
    [setAmount, totalBalance?.usdBalance],
  );

  const handleDoubleClick = useCallback(() => {
    // Select all text on double click
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  // Handle keyboard shortcuts like Ctrl+A
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.select();
        }
      }
    },
    [],
  );

  return (
    <div className="py-8 min-h-[212px] w-full rounded-lg border bg-base text-muted-foreground shadow-[0_1px_12px_0_rgba(91,91,91,0.05)]">
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre font-display text-[32px] font-medium tracking-[0.8px] tabular-nums"
        aria-hidden="true"
      >
        {measureText}
      </span>

      {/* Amount Input Section */}
      <div
        className={`w-full flex items-center justify-center gap-3 transition-all duration-300 ease-out ${
          numericAmount > 0 ? "-mt-0.5" : "mt-1.5"
        }`}
      >
        <TokenIcon
          tokenSrc={destinationConfig.tokenLogo ?? "/usdc.svg"}
          protocolSrc={destinationConfig?.depositTargetLogo}
          tokenAlt="USDC"
        />
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleInputChange}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          placeholder="0"
          style={{
            width:
              inputWidth > 0
                ? Math.min(inputWidth + 4, MAX_INPUT_WIDTH_PX)
                : undefined,
            maxWidth: "calc(100vw - 100px)",
          }}
          className="font-display text-[32px] font-medium tracking-[0.8px] tabular-nums bg-transparent rounded-lg border-none outline-none min-w-[22px] text-card-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* USD Equivalent - animated height reveal */}
      <div
        className={`grid transition-all duration-300 ease-out ${
          numericAmount > 0
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 mt-2"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-center gap-1 text-muted-foreground h-5">
            <span
              key={isShining ? "shining" : "static"}
              className={`text-sm text-secondary leading-5 ${
                isShining ? "animate-glare-shine" : ""
              }`}
            >
              ~ {usdFormatter.format(numericAmount)}
            </span>
            <UpDownArrows className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Percentage Selector */}
      <div className={numericAmount > 0 ? "-mt-px" : ""}>
        <PercentageSelector onPercentageClick={handlePercentageClick} />
      </div>

      {/* Balance Display */}
      <div className="mt-[33px] font-sans text-base leading-5 text-base-foreground-2 text-center">
        Balance: {usdFormatter.format(totalSelectedBalance)}
      </div>

      {/* Error Banner */}
      {exceedsBalance && (
        <div className="mt-4 mx-4">
          <ErrorBanner message="You don't have enough wallet balance." />
        </div>
      )}
      {exceedsSelectedTokens && (
        <div className="mt-4 mx-4">
          <ErrorBanner message="Amount exceeds your selected token balance. Select more tokens or reduce the amount to continue." />
        </div>
      )}
    </div>
  );
}

export default AmountCard;
