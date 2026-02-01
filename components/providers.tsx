"use client";

import { WagmiProvider, createConfig, http, fallback } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

// Multiple RPC URLs for reliability
const ARBITRUM_SEPOLIA_RPCS = [
  "https://sepolia-rollup.arbitrum.io/rpc",
  "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  "https://arbitrum-sepolia-rpc.publicnode.com",
];

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: fallback(
      ARBITRUM_SEPOLIA_RPCS.map((url) => http(url, { 
        timeout: 30_000,
        retryCount: 3,
      }))
    ),
  },
  connectors: [injected()],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
