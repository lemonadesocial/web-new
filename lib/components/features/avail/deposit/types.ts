import type {
  SUPPORTED_CHAINS_IDS,
  ExecuteParams,
  OnSwapIntentHookData,
  SwapStepType,
  UserAsset,
} from "@avail-project/nexus-core";
import type { Address } from "viem";

export type WidgetStep =
  | "amount"
  | "confirmation"
  | "transaction-status"
  | "transaction-complete"
  | "transaction-failed"
  | "asset-selection";

export type TransactionStatus =
  | "idle"
  | "previewing"
  | "simulation-loading"
  | "executing"
  | "success"
  | "error";

export type NavigationDirection = "forward" | "backward" | null;

export type AssetFilterType = "all" | "stablecoins" | "native" | "custom";

export type TokenCategory = "stablecoin" | "native" | "memecoin";

export interface ChainItem {
  id: string;
  tokenAddress: `0x${string}`;
  chainId: number;
  name: string;
  usdValue: number;
  amount: number;
}

export interface Token {
  id: string;
  symbol: string;
  decimals: number;
  chainsLabel: string;
  usdValue: string;
  amount: string;
  logo: string;
  category: TokenCategory;
  chains: ChainItem[];
}

export interface DepositInputs {
  amount?: string;
  selectedToken: string;
  toChainId?: number;
  toTokenAddress?: `0x${string}`;
  toAmount?: bigint;
}

export interface AssetSelectionState {
  selectedChainIds: Set<string>;
  filter: AssetFilterType;
  expandedTokens: Set<string>;
}

export interface DestinationConfig {
  chainId: SUPPORTED_CHAINS_IDS;
  depositTargetLogo?: string;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenLogo?: string;
  label?: string;
  estimatedTime?: string;
  gasTokenSymbol?: string;
  explorerUrl?: string;
}

export interface ExecuteDepositParams {
  tokenSymbol: string;
  tokenAddress: string;
  amount: bigint;
  chainId: number;
  user: Address;
}

export type ExecuteDepositResult = Omit<ExecuteParams, "toChainId">;

export interface UseDepositWidgetProps {
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

export interface DepositWidgetContextValue {
  // Core state
  step: WidgetStep;
  inputs: DepositInputs;
  status: TransactionStatus;

  // Input management
  setInputs: (inputs: Partial<DepositInputs>) => void;

  // Explorer URLs
  explorerUrls: {
    sourceExplorerUrl: string | null;
    destinationExplorerUrl: string | null;
  };

  // Source swap transactions (from BRIDGE_DEPOSIT events)
  sourceSwaps: Array<{
    chainId: number;
    chainName: string;
    explorerUrl: string;
  }>;

  // Transaction result data
  nexusIntentUrl: string | null;
  depositTxHash: string | null;

  // Destination config (for building explorer URLs)
  destination: DestinationConfig;

  // Derived state
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;

  // Error handling
  txError: string | null;
  setTxError: (error: string | null) => void;

  // Navigation
  goToStep: (step: WidgetStep) => void;
  goBack: () => void;
  reset: () => void;
  navigationDirection: NavigationDirection;

  // Transaction actions
  startTransaction: () => void;

  // Results
  lastResult: unknown;

  // Asset selection
  assetSelection: AssetSelectionState;
  setAssetSelection: (selection: Partial<AssetSelectionState>) => void;

  // SDK integration
  swapBalance: UserAsset[] | null;
  activeIntent: OnSwapIntentHookData | null;
  confirmationDetails: {
    sourceLabel: string;
    sources: Array<
      | {
          chainId: number;
          tokenAddress: `0x${string}`;
          decimals: number;
          symbol: string;
          balance: string;
          balanceInFiat?: number;
          tokenLogo?: string;
          chainLogo?: string;
          chainName?: string;
          isDestinationBalance?: boolean;
        }
      | undefined
    >;
    gasTokenSymbol?: string;
    estimatedTime?: string;
    amountSpent: number;
    totalFeeUsd: number;
    receiveTokenSymbol: string;
    receiveAmountAfterSwap: string;
    receiveAmountAfterSwapUsd: number;
    receiveTokenLogo?: string;
    receiveTokenChain: number;
    destinationChainName?: string;
  } | null;
  feeBreakdown: {
    totalGasFee: number;
    gasUsd: number;
    gasFormatted: string;
  };
  steps: Array<{
    id: number;
    completed: boolean;
    step: SwapStepType;
  }>;
  timer: number;
  handleConfirmOrder: () => void;
  handleAmountContinue: (totalAmountUsd: number) => void;
  totalSelectedBalance: number;
  skipSwap: boolean;
  simulationLoading: boolean;
  totalBalance:
    | {
        balance: number;
        usdBalance: number;
      }
    | undefined;
}

export interface BaseDepositWidgetProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export interface DepositWidgetProps
  extends UseDepositWidgetProps,
    BaseDepositWidgetProps {
  heading?: string;
  embed?: boolean;
  className?: string;
  onClose?: () => void;
  /** Control the dialog open state (non-embed mode only) */
  open?: boolean;
  /** Callback when dialog open state changes (non-embed mode only) */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage (non-embed mode only) */
  defaultOpen?: boolean;
}
