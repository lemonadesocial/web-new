"use client";
import {
  type EthereumProvider,
  type NexusNetwork,
  NexusSDK,
  type OnAllowanceHookData,
  type OnIntentHookData,
  type OnSwapIntentHookData,
  type SupportedChainsAndTokensResult,
  type SupportedChainsResult,
  type UserAsset,
} from "@avail-project/nexus-core";

import {
  createContext,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAccountEffect } from "wagmi";

interface NexusContextType {
  nexusSDK: NexusSDK | null;
  bridgableBalance: UserAsset[] | null;
  swapBalance: UserAsset[] | null;
  intent: RefObject<OnIntentHookData | null>;
  allowance: RefObject<OnAllowanceHookData | null>;
  swapIntent: RefObject<OnSwapIntentHookData | null>;
  exchangeRate: Record<string, number> | null;
  supportedChainsAndTokens: SupportedChainsAndTokensResult | null;
  swapSupportedChainsAndTokens: SupportedChainsResult | null;
  network?: NexusNetwork;
  loading: boolean;
  handleInit: (provider: EthereumProvider) => Promise<void>;
  fetchBridgableBalance: () => Promise<void>;
  fetchSwapBalance: () => Promise<void>;
  getFiatValue: (amount: number, token: string) => number;
  initializeNexus: (provider: EthereumProvider) => Promise<void>;
  deinitializeNexus: () => Promise<void>;
  attachEventHooks: () => void;
  requestSwapIntentAutoAllow: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

type NexusProviderProps = {
  children: React.ReactNode;
  config?: {
    network?: NexusNetwork;
    debug?: boolean;
  };
};

const defaultConfig: Required<NexusProviderProps["config"]> = {
  network: "mainnet",
  debug: false,
};

const NexusProvider = ({
  children,
  config = defaultConfig,
}: NexusProviderProps) => {
  const stableConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  );

  const sdkRef = useRef<NexusSDK | null>(null);
  sdkRef.current ??= new NexusSDK({
    ...stableConfig,
  });
  const sdk = sdkRef.current;

  const [nexusSDK, setNexusSDK] = useState<NexusSDK | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const supportedChainsAndTokens =
    useRef<SupportedChainsAndTokensResult | null>(null);
  const swapSupportedChainsAndTokens = useRef<SupportedChainsResult | null>(
    null
  );
  const [bridgableBalance, setBridgableBalance] = useState<UserAsset[] | null>(
    null
  );
  const [swapBalance, setSwapBalance] = useState<UserAsset[] | null>(null);
  const exchangeRate = useRef<Record<string, number> | null>(null);

  const intent = useRef<OnIntentHookData | null>(null);
  const allowance = useRef<OnAllowanceHookData | null>(null);
  const swapIntent = useRef<OnSwapIntentHookData | null>(null);
  const swapIntentAutoAllowRef = useRef(false);

  const setupNexus = useCallback(async () => {
    const list = sdk.utils.getSupportedChains(
      config?.network === "testnet" ? 0 : undefined
    );
    supportedChainsAndTokens.current = list ?? null;
    const swapList = sdk.utils.getSwapSupportedChainsAndTokens();
    swapSupportedChainsAndTokens.current = swapList ?? null;
    const [bridgeAbleBalanceResult, rates] = await Promise.allSettled([
      sdk.getBalancesForBridge(),
      sdk.utils.getCoinbaseRates(),
    ]);

    if (bridgeAbleBalanceResult.status === "fulfilled") {
      setBridgableBalance(bridgeAbleBalanceResult.value);
    }

    if (rates?.status === "fulfilled") {
      const usdPerUnit: Record<string, number> = {};

      for (const [symbol, value] of Object.entries(rates.value)) {
        const unitsPerUsd = Number.parseFloat(String(value));
        if (Number.isFinite(unitsPerUsd) && unitsPerUsd > 0) {
          usdPerUnit[symbol.toUpperCase()] = 1 / unitsPerUsd;
        }
      }
      exchangeRate.current = usdPerUnit;
    }
  }, [sdk, config?.network]);

  const initializeNexus = async (provider: EthereumProvider) => {
    setLoading(true);
    try {
      if (sdk.isInitialized()) throw new Error("Nexus is already initialized");
      await sdk.initialize(provider);
      setNexusSDK(sdk);
    } catch (error) {
      console.error("Error initializing Nexus:", error);
    } finally {
      setLoading(false);
    }
  };

  const deinitializeNexus = async () => {
    try {
      if (!nexusSDK) throw new Error("Nexus is not initialized");
      await nexusSDK?.deinit();
      setNexusSDK(null);
      supportedChainsAndTokens.current = null;
      swapSupportedChainsAndTokens.current = null;
      setBridgableBalance(null);
      setSwapBalance(null);
      exchangeRate.current = null;
      intent.current = null;
      swapIntent.current = null;
      allowance.current = null;
      setLoading(false);
    } catch (error) {
      console.error("Error deinitializing Nexus:", error);
    }
  };

  const attachEventHooks = () => {
    sdk.setOnAllowanceHook((data: OnAllowanceHookData) => {
      allowance.current = data;
    });

    sdk.setOnIntentHook((data: OnIntentHookData) => {
      intent.current = data;
    });

    sdk.setOnSwapIntentHook((data: OnSwapIntentHookData) => {
      swapIntent.current = data;
      if (swapIntentAutoAllowRef.current) {
        swapIntentAutoAllowRef.current = false;
        data.allow();
      }
    });
  };

  const handleInit = async (provider: EthereumProvider) => {
    if (sdk.isInitialized() || loading) {
      return;
    }
    if (!provider || typeof provider.request !== "function") {
      throw new Error("Invalid EIP-1193 provider");
    }
    await initializeNexus(provider);
    await setupNexus();
    attachEventHooks();
  };

  const fetchBridgableBalance = async () => {
    try {
      const updatedBalance = await sdk.getBalancesForBridge();
      setBridgableBalance(updatedBalance);
    } catch (error) {
      console.error("Error fetching bridgable balance:", error);
    }
  };

  const fetchSwapBalance = async () => {
    try {
      const updatedBalance = await sdk.getBalancesForSwap();
      setSwapBalance(updatedBalance);
    } catch (error) {
      console.error("Error fetching swap balance:", error);
    }
  };

  function getFiatValue(amount: number, token: string) {
    const key = token.toUpperCase();
    const rate = exchangeRate.current?.[key] ?? 1;
    return rate * amount;
  }

  const requestSwapIntentAutoAllow = useCallback(() => {
    swapIntentAutoAllowRef.current = true;
  }, []);

  useAccountEffect({
    onDisconnect() {
      deinitializeNexus();
    },
  });

  const value = useMemo(
    () => ({
      nexusSDK,
      initializeNexus,
      deinitializeNexus,
      attachEventHooks,
      intent,
      allowance,
      handleInit,
      supportedChainsAndTokens: supportedChainsAndTokens.current,
      swapSupportedChainsAndTokens: swapSupportedChainsAndTokens.current,
      bridgableBalance,
      swapBalance: swapBalance,
      network: config?.network,
      loading,
      fetchBridgableBalance,
      fetchSwapBalance,
      swapIntent,
      exchangeRate: exchangeRate.current,
      getFiatValue,
      requestSwapIntentAutoAllow,
    }),
    [
      nexusSDK,
      initializeNexus,
      deinitializeNexus,
      attachEventHooks,
      handleInit,
      swapBalance,
      config,
      loading,
      fetchBridgableBalance,
      fetchSwapBalance,
      requestSwapIntentAutoAllow,
    ]
  );
  return (
    <NexusContext.Provider value={value}>{children}</NexusContext.Provider>
  );
};

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
}

export default NexusProvider;
