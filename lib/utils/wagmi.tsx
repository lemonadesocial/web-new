import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Config, WagmiProvider } from "wagmi";
import { ThirdwebProvider } from "thirdweb/react";
import React from "react";

const queryClient = new QueryClient();

export const Web3Provider = ({ config, children }: { config: Config, children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
};
