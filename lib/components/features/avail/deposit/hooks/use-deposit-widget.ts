"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  WidgetStep,
  DepositWidgetContextValue,
  DepositInputs,
  DestinationConfig,
} from "../types";
import {
  NEXUS_EVENTS,
  CHAIN_METADATA,
  type SwapStepType,
  type ExecuteParams,
  type SwapAndExecuteParams,
  type SwapAndExecuteResult,
  parseUnits,
} from "@avail-project/nexus-core";
import {
  SWAP_EXPECTED_STEPS,
  useNexusError,
  usePolling,
  useStopwatch,
  useTransactionSteps,
} from "../../common";
import { type Address, type Hex, formatEther } from "viem";
import { useAccount } from "wagmi";
import { useNexus } from "../../nexus/NexusProvider";
import { SIMULATION_POLL_INTERVAL_MS } from "../constants/widget";

// Import extracted hooks
import {
  useDepositState,
  STEP_HISTORY,
  type SwapSkippedData,
} from "./use-deposit-state";
import { useAssetSelection } from "./use-asset-selection";
import { useDepositComputed } from "./use-deposit-computed";

interface UseDepositProps {
  executeDeposit: (
    tokenSymbol: string,
    tokenAddress: `0x${string}`,
    amount: bigint,
    chainId: number,
    user: Address,
  ) => Omit<ExecuteParams, "toChainId">;
  destination: DestinationConfig;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Main deposit widget hook that orchestrates state, SDK integration,
 * and computed values via smaller focused hooks.
 */
export function useDepositWidget(
  props: UseDepositProps,
): DepositWidgetContextValue {
  const { executeDeposit, destination, onSuccess, onError } = props;

  // External dependencies
  const {
    nexusSDK,
    swapIntent,
    swapBalance,
    fetchSwapBalance,
    getFiatValue,
    exchangeRate,
  } = useNexus();
  const { address } = useAccount();
  const handleNexusError = useNexusError();

  // Core state management
  const { state, dispatch } = useDepositState();
  const [pollingEnabled, setPollingEnabled] = useState(false);

  // Asset selection state
  const { assetSelection, setAssetSelection, resetAssetSelection } =
    useAssetSelection(swapBalance);

  // Refs for tracking
  const hasAutoSelected = useRef(false);
  const initialSimulationDone = useRef(false);
  const determiningSwapComplete = useRef(false);
  const lastSimulationTime = useRef(0);

  // Transaction steps tracking
  const {
    seed,
    onStepComplete,
    reset: resetSteps,
    steps,
  } = useTransactionSteps<SwapStepType>();

  // Stopwatch for timing
  const stopwatch = useStopwatch({
    running:
      state.status === "executing" ||
      (state.status === "previewing" && determiningSwapComplete.current),
    intervalMs: 100,
  });

  // Derived state
  const isProcessing = state.status === "executing";
  const isSuccess = state.status === "success";
  const isError = state.status === "error";
  const activeIntent = state.simulation?.swapIntent ?? swapIntent.current;

  // Computed values
  const {
    availableAssets,
    totalSelectedBalance,
    totalBalance,
    confirmationDetails,
    feeBreakdown,
  } = useDepositComputed({
    swapBalance,
    assetSelection,
    activeIntent,
    destination,
    inputAmount: state.inputs.amount,
    exchangeRate,
    getFiatValue,
    actualGasFeeUsd: state.actualGasFeeUsd,
    swapSkippedData: state.swapSkippedData,
    skipSwap: state.skipSwap,
    nexusSDK,
  });

  // Action callbacks
  const setInputs = useCallback(
    (next: Partial<DepositInputs>) => {
      dispatch({ type: "setInputs", payload: next });
    },
    [dispatch],
  );

  const setTxError = useCallback(
    (error: string | null) => {
      dispatch({ type: "setError", payload: error });
    },
    [dispatch],
  );

  /**
   * Start the swap and execute flow with the SDK
   */
  const start = useCallback(
    (inputs: SwapAndExecuteParams) => {
      if (!nexusSDK || !inputs || isProcessing) return;

      seed(SWAP_EXPECTED_STEPS);

      // Build source list from selected assets
      const fromSources: Array<{ tokenAddress: Hex; chainId: number }> = [];
      assetSelection.selectedChainIds.forEach((key) => {
        const lastDashIndex = key.lastIndexOf("-");
        const tokenAddress = key.substring(0, lastDashIndex) as Hex;
        const chainId = parseInt(key.substring(lastDashIndex + 1), 10);
        fromSources.push({ tokenAddress, chainId });
      });

      const inputsWithSources = {
        ...inputs,
        fromSources: fromSources.length > 0 ? fromSources : undefined,
      };

      nexusSDK
        .swapAndExecute(inputsWithSources, {
          onEvent: (event) => {
            if (event.name === NEXUS_EVENTS.SWAP_STEP_COMPLETE) {
              const step = event.args as SwapStepType & {
                completed?: boolean;
                data?: SwapSkippedData;
              };

              // Handle SWAP_SKIPPED - go directly to transaction-status
              if (step?.type === "SWAP_SKIPPED") {
                dispatch({ type: "setSkipSwap", payload: true });
                dispatch({
                  type: "setSwapSkippedData",
                  payload: step.data ?? null,
                });
                dispatch({ type: "setStatus", payload: "executing" });
                dispatch({
                  type: "setStep",
                  payload: { step: "transaction-status", direction: "forward" },
                });
                stopwatch.start();
              }

              if (step?.type === "DETERMINING_SWAP" && step?.completed) {
                determiningSwapComplete.current = true;
                stopwatch.start();
                dispatch({ type: "setIntentReady", payload: true });
              }
              onStepComplete(step);
            }
          },
        })
        .then((data: SwapAndExecuteResult) => {
          // Extract source swaps from the result
          const sourceSwapsFromResult = data.swapResult?.sourceSwaps ?? [];
          sourceSwapsFromResult.forEach((sourceSwap) => {
            const chainMeta =
              CHAIN_METADATA[sourceSwap.chainId as keyof typeof CHAIN_METADATA];
            const baseUrl = chainMeta?.blockExplorerUrls?.[0] ?? "";
            const explorerUrl = baseUrl
              ? `${baseUrl}/tx/${sourceSwap.txHash}`
              : "";
            dispatch({
              type: "addSourceSwap",
              payload: {
                chainId: sourceSwap.chainId,
                chainName: chainMeta?.name ?? `Chain ${sourceSwap.chainId}`,
                explorerUrl,
              },
            });
          });

          // Set explorer URLs from the result
          if (sourceSwapsFromResult.length > 0) {
            const firstSourceSwap = sourceSwapsFromResult[0];
            const chainMeta =
              CHAIN_METADATA[
                firstSourceSwap.chainId as keyof typeof CHAIN_METADATA
              ];
            const baseUrl = chainMeta?.blockExplorerUrls?.[0] ?? "";
            const sourceExplorerUrl = baseUrl
              ? `${baseUrl}/tx/${firstSourceSwap.txHash}`
              : "";
            dispatch({
              type: "setExplorerUrls",
              payload: { sourceExplorerUrl },
            });
          }

          // Destination explorer URL
          const destChainMeta =
            CHAIN_METADATA[destination.chainId as keyof typeof CHAIN_METADATA];
          const destBaseUrl = destChainMeta?.blockExplorerUrls?.[0] ?? "";
          const destinationExplorerUrl =
            data.swapResult?.explorerURL ??
            (data.executeResponse?.txHash && destBaseUrl
              ? `${destBaseUrl}/tx/${data.executeResponse.txHash}`
              : null);

          if (destinationExplorerUrl) {
            dispatch({
              type: "setExplorerUrls",
              payload: { destinationExplorerUrl },
            });
          }

          // Store Nexus intent URL and deposit tx hash
          dispatch({
            type: "setNexusIntentUrl",
            payload: data.swapResult?.explorerURL ?? null,
          });
          dispatch({
            type: "setDepositTxHash",
            payload: data.executeResponse?.txHash ?? null,
          });

          // Calculate actual gas fee from receipt
          const receipt = data.executeResponse?.receipt;
          if (receipt?.gasUsed && receipt?.effectiveGasPrice) {
            const gasUsed = BigInt(receipt.gasUsed);
            const effectiveGasPrice = BigInt(receipt.effectiveGasPrice);
            const gasCostWei = gasUsed * effectiveGasPrice;
            const gasCostNative = parseFloat(formatEther(gasCostWei));
            const gasTokenSymbol = destination.gasTokenSymbol ?? "ETH";
            const gasCostUsd = getFiatValue(gasCostNative, gasTokenSymbol);
            dispatch({
              type: "setActualGasFeeUsd",
              payload: gasCostUsd,
            });
          }

          dispatch({
            type: "setReceiveAmount",
            payload: swapIntent.current?.intent?.destination?.amount ?? "",
          });
          onSuccess?.();
          dispatch({ type: "setStatus", payload: "success" });
          dispatch({
            type: "setStep",
            payload: { step: "transaction-complete", direction: "forward" },
          });
        })
        .catch((error) => {
          const { message } = handleNexusError(error);
          dispatch({ type: "setError", payload: message });
          dispatch({ type: "setStatus", payload: "error" });

          if (initialSimulationDone.current) {
            dispatch({
              type: "setStep",
              payload: { step: "transaction-failed", direction: "forward" },
            });
          } else {
            dispatch({
              type: "setStep",
              payload: { step: "amount", direction: "backward" },
            });
          }
          onError?.(message);
        })
        .finally(async () => {
          await fetchSwapBalance();
        });
    },
    [
      nexusSDK,
      isProcessing,
      seed,
      onStepComplete,
      swapIntent,
      onSuccess,
      onError,
      handleNexusError,
      assetSelection.selectedChainIds,
      destination,
      getFiatValue,
      dispatch,
      stopwatch,
    ],
  );

  /**
   * Handle amount input continue - starts simulation
   */
  const handleAmountContinue = useCallback(
    (totalAmountUsd: number) => {
      if (!nexusSDK || !address || !exchangeRate) return;

      // Reset state and refs for a fresh simulation
      dispatch({ type: "setIntentReady", payload: false });
      initialSimulationDone.current = false;
      determiningSwapComplete.current = false;
      swapIntent.current = null;

      const tokenAmount =
        totalAmountUsd / (exchangeRate[destination.tokenSymbol] ?? 1);
      const tokenAmountStr = tokenAmount.toFixed(destination.tokenDecimals);
      const parsed = parseUnits(tokenAmountStr, destination.tokenDecimals);

      const executeParams = executeDeposit(
        destination.tokenSymbol,
        destination.tokenAddress,
        parsed,
        destination.chainId,
        address,
      );

      const newInputs: SwapAndExecuteParams = {
        toChainId: destination.chainId,
        toTokenAddress: destination.tokenAddress,
        toAmount: parsed,
        execute: {
          to: executeParams.to,
          value: executeParams.value,
          data: executeParams.data,
          tokenApproval: executeParams.tokenApproval as {
            token: `0x${string}`;
            amount: bigint;
            spender: Hex;
          },
          gas: BigInt(200_000),
        },
      };

      dispatch({
        type: "setInputs",
        payload: { amount: totalAmountUsd.toString() },
      });
      dispatch({ type: "setStatus", payload: "simulation-loading" });
      dispatch({ type: "setSimulationLoading", payload: true });
      start(newInputs);
    },
    [
      nexusSDK,
      address,
      exchangeRate,
      destination,
      executeDeposit,
      start,
      swapIntent,
      dispatch,
    ],
  );

  /**
   * Handle order confirmation - allow intent to execute
   */
  const handleConfirmOrder = useCallback(() => {
    if (!activeIntent) return;
    dispatch({ type: "setStatus", payload: "executing" });
    dispatch({
      type: "setStep",
      payload: { step: "transaction-status", direction: "forward" },
    });
    activeIntent.allow();
  }, [activeIntent, dispatch]);

  /**
   * Navigate to a specific step
   */
  const goToStep = useCallback(
    (newStep: WidgetStep) => {
      dispatch({
        type: "setStep",
        payload: { step: newStep, direction: "forward" },
      });
      if (state.step === "amount" && newStep === "confirmation") {
        const amount = state.inputs.amount;
        if (amount) {
          const totalAmountUsd = parseFloat(amount.replace(/,/g, ""));
          if (totalAmountUsd > 0) {
            handleAmountContinue(totalAmountUsd);
            return;
          }
        }
      }
    },
    [state.step, state.inputs.amount, handleAmountContinue, dispatch],
  );

  /**
   * Navigate back to previous step
   */
  const goBack = useCallback(async () => {
    const previousStep = STEP_HISTORY[state.step];
    if (previousStep) {
      dispatch({ type: "setError", payload: null });
      dispatch({
        type: "setStep",
        payload: { step: previousStep, direction: "backward" },
      });
      swapIntent.current = null;
      initialSimulationDone.current = false;
      lastSimulationTime.current = 0;
      setPollingEnabled(false);
      stopwatch.stop();
      stopwatch.reset();
      await fetchSwapBalance();
    }
  }, [state.step, swapIntent, stopwatch, dispatch]);

  /**
   * Reset widget to initial state
   */
  const reset = useCallback(async () => {
    dispatch({ type: "reset" });
    resetAssetSelection();
    resetSteps();
    swapIntent.current = null;
    initialSimulationDone.current = false;
    lastSimulationTime.current = 0;
    setPollingEnabled(false);
    stopwatch.stop();
    stopwatch.reset();
    await fetchSwapBalance();
  }, [resetSteps, swapIntent, stopwatch, dispatch, resetAssetSelection]);

  /**
   * Refresh simulation data
   */
  const refreshSimulation = useCallback(async () => {
    const timeSinceLastSimulation = Date.now() - lastSimulationTime.current;
    if (timeSinceLastSimulation < 5000) {
      return;
    }

    try {
      dispatch({ type: "setSimulationLoading", payload: true });
      const updated = await swapIntent.current?.refresh();
      if (updated) {
        swapIntent.current!.intent = updated;
        dispatch({
          type: "setSimulation",
          payload: {
            swapIntent: swapIntent.current!,
          },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch({ type: "setSimulationLoading", payload: false });
      stopwatch.reset();
      lastSimulationTime.current = Date.now();
    }
  }, [stopwatch, swapIntent, dispatch]);

  const startTransaction = useCallback(() => {
    if (isProcessing) return;
    dispatch({ type: "setError", payload: null });
  }, [isProcessing, dispatch]);

  // Effect: Handle swap intent when it arrives
  useEffect(() => {
    if (!state.intentReady || initialSimulationDone.current) {
      return;
    }

    if (!swapIntent.current) {
      return;
    }

    initialSimulationDone.current = true;
    dispatch({
      type: "setSimulation",
      payload: { swapIntent: swapIntent.current! },
    });
    dispatch({ type: "setSimulationLoading", payload: false });
    dispatch({ type: "setStatus", payload: "previewing" });
    lastSimulationTime.current = Date.now();
    setPollingEnabled(true);
  }, [state.intentReady, swapIntent, dispatch]);

  // Effect: Fetch swap balance on mount
  useEffect(() => {
    if (!nexusSDK) return;

    if (!swapBalance) {
      void fetchSwapBalance();
      return;
    }

    if (!hasAutoSelected.current && availableAssets.length > 0) {
      hasAutoSelected.current = true;
    }
  }, [nexusSDK, swapBalance, availableAssets, fetchSwapBalance]);

  // Polling for simulation refresh
  usePolling(
    pollingEnabled &&
      state.status === "previewing" &&
      Boolean(swapIntent.current) &&
      !state.simulationLoading,
    async () => {
      await refreshSimulation();
    },
    SIMULATION_POLL_INTERVAL_MS,
  );

  // Return the full context value
  return {
    step: state.step,
    inputs: state.inputs,
    setInputs,
    status: state.status,
    explorerUrls: state.explorerUrls,
    sourceSwaps: state.sourceSwaps,
    nexusIntentUrl: state.nexusIntentUrl,
    depositTxHash: state.depositTxHash,
    destination,
    isProcessing,
    isSuccess,
    isError,
    txError: state.error,
    setTxError,
    goToStep,
    goBack,
    reset,
    navigationDirection: state.navigationDirection,
    startTransaction,
    lastResult: state.lastResult,
    assetSelection,
    setAssetSelection,
    swapBalance,
    activeIntent,
    confirmationDetails,
    feeBreakdown,
    steps,
    timer: stopwatch.seconds,
    handleConfirmOrder,
    handleAmountContinue,
    totalSelectedBalance,
    skipSwap: state.skipSwap,
    simulationLoading: state.simulationLoading,
    totalBalance,
  };
}
