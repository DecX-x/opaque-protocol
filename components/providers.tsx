"use client";

import { WagmiProvider, createConfig, http, fallback } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

// Multiple RPC URLs for reliability and load balancing
const ARBITRUM_SEPOLIA_RPCS = [
  "https://sepolia-rollup.arbitrum.io/rpc",
  "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  "https://arbitrum-sepolia-rpc.publicnode.com",
  "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
  "https://arbitrum-sepolia.access-nodes.com",
];

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: fallback(
      ARBITRUM_SEPOLIA_RPCS.map((url) => http(url, { 
        timeout: 60_000, // Longer timeout
        retryCount: 5,   // More retries
        retryDelay: 2000 // Wait 2s between retries
      })),
      { rank: true } // Automatically choose the fastest/healthiest RPC
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
