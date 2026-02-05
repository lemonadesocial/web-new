"use client";

import { useReducer } from "react";
import type {
  WidgetStep,
  TransactionStatus,
  DepositInputs,
  NavigationDirection,
} from "../types";
import type { OnSwapIntentHookData } from "@avail-project/nexus-core";

/**
 * Source swap info collected during transaction execution
 */
export interface SourceSwapInfo {
  chainId: number;
  chainName: string;
  explorerUrl: string;
}

/**
 * Data from SDK when swap is skipped (using existing destination balance)
 */
export interface SwapSkippedData {
  destination: {
    amount: string;
    chain: { id: number; name: string };
    token: {
      contractAddress: `0x${string}`;
      decimals: number;
      symbol: string;
    };
  };
  input: {
    amount: string;
    token: {
      contractAddress: `0x${string}`;
      decimals: number;
      symbol: string;
    };
  };
  gas: {
    required: string;
    price: string;
    estimatedFee: string;
  };
}

/**
 * Core deposit widget state
 */
export interface DepositState {
  step: WidgetStep;
  inputs: DepositInputs;
  status: TransactionStatus;
  explorerUrls: {
    sourceExplorerUrl: string | null;
    destinationExplorerUrl: string | null;
  };
  sourceSwaps: SourceSwapInfo[];
  nexusIntentUrl: string | null;
  depositTxHash: string | null;
  actualGasFeeUsd: number | null;
  error: string | null;
  lastResult: unknown;
  navigationDirection: NavigationDirection;
  simulation: {
    swapIntent: OnSwapIntentHookData;
  } | null;
  simulationLoading: boolean;
  receiveAmount: string | null;
  skipSwap: boolean;
  intentReady: boolean;
  swapSkippedData: SwapSkippedData | null;
}

/**
 * Action types for state reducer
 */
export type DepositAction =
  | {
      type: "setStep";
      payload: { step: WidgetStep; direction: NavigationDirection };
    }
  | { type: "setInputs"; payload: Partial<DepositInputs> }
  | { type: "setStatus"; payload: TransactionStatus }
  | {
      type: "setExplorerUrls";
      payload: Partial<DepositState["explorerUrls"]>;
    }
  | { type: "setError"; payload: string | null }
  | { type: "setLastResult"; payload: unknown }
  | {
      type: "setSimulation";
      payload: {
        swapIntent: OnSwapIntentHookData;
      };
    }
  | { type: "setSimulationLoading"; payload: boolean }
  | { type: "setReceiveAmount"; payload: string | null }
  | { type: "setSkipSwap"; payload: boolean }
  | { type: "setIntentReady"; payload: boolean }
  | { type: "setSwapSkippedData"; payload: SwapSkippedData | null }
  | { type: "addSourceSwap"; payload: SourceSwapInfo }
  | { type: "setNexusIntentUrl"; payload: string | null }
  | { type: "setDepositTxHash"; payload: string | null }
  | { type: "setActualGasFeeUsd"; payload: number | null }
  | { type: "reset" };

/**
 * Step history for back navigation
 */
export const STEP_HISTORY: Record<WidgetStep, WidgetStep | null> = {
  amount: null,
  confirmation: "amount",
  "transaction-status": null,
  "transaction-complete": null,
  "transaction-failed": null,
  "asset-selection": "amount",
} as const;

/**
 * Creates fresh initial state
 */
export const createInitialState = (): DepositState => ({
  step: "amount",
  inputs: {
    amount: undefined,
    selectedToken: "USDC",
  },
  status: "idle",
  explorerUrls: {
    sourceExplorerUrl: null,
    destinationExplorerUrl: null,
  },
  sourceSwaps: [],
  nexusIntentUrl: null,
  depositTxHash: null,
  actualGasFeeUsd: null,
  error: null,
  lastResult: null,
  navigationDirection: null,
  simulation: null,
  simulationLoading: false,
  receiveAmount: null,
  skipSwap: false,
  intentReady: false,
  swapSkippedData: null,
});

/**
 * State reducer for deposit widget
 */
function depositReducer(state: DepositState, action: DepositAction): DepositState {
  switch (action.type) {
    case "setStep":
      return {
        ...state,
        step: action.payload.step,
        navigationDirection: action.payload.direction,
      };
    case "setInputs": {
      const newInputs = { ...state.inputs, ...action.payload };
      let newStatus = state.status;
      if (
        state.status === "idle" &&
        newInputs.amount &&
        Number.parseFloat(newInputs.amount) > 0
      ) {
        newStatus = "previewing";
      }
      if (
        state.status === "previewing" &&
        (!newInputs.amount || Number.parseFloat(newInputs.amount) <= 0)
      ) {
        newStatus = "idle";
      }
      // Clear error when user changes inputs
      return { ...state, inputs: newInputs, status: newStatus, error: null };
    }
    case "setStatus":
      return { ...state, status: action.payload };
    case "setExplorerUrls":
      return {
        ...state,
        explorerUrls: { ...state.explorerUrls, ...action.payload },
      };
    case "setError":
      return { ...state, error: action.payload };
    case "setLastResult":
      return { ...state, lastResult: action.payload };
    case "setSimulation":
      return {
        ...state,
        simulation: action.payload,
      };
    case "setSimulationLoading":
      return { ...state, simulationLoading: action.payload };
    case "setReceiveAmount":
      return { ...state, receiveAmount: action.payload };
    case "setSkipSwap":
      return { ...state, skipSwap: action.payload };
    case "setIntentReady":
      return { ...state, intentReady: action.payload };
    case "setSwapSkippedData":
      return { ...state, swapSkippedData: action.payload };
    case "addSourceSwap":
      return { ...state, sourceSwaps: [...state.sourceSwaps, action.payload] };
    case "setNexusIntentUrl":
      return { ...state, nexusIntentUrl: action.payload };
    case "setDepositTxHash":
      return { ...state, depositTxHash: action.payload };
    case "setActualGasFeeUsd":
      return { ...state, actualGasFeeUsd: action.payload };
    case "reset":
      return createInitialState();
    default:
      return state;
  }
}

/**
 * Hook for managing deposit widget state via reducer
 */
export function useDepositState() {
  const [state, dispatch] = useReducer(
    depositReducer,
    undefined,
    createInitialState
  );

  return { state, dispatch };
}
