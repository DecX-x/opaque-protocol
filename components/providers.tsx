"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http, fallback } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";

// Multiple RPC URLs for reliability and load balancing
const ARBITRUM_SEPOLIA_RPCS = [
  "https://sepolia-rollup.arbitrum.io/rpc",
  "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  "https://arbitrum-sepolia-rpc.publicnode.com",
  "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
  "https://arbitrum-sepolia.access-nodes.com",
];

// WalletConnect Project ID (WalletConnect Cloud).
// Prefer env var so forks/deploys can override without code changes.
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "3fcc6bba6f1d54ca1b280a671a73815c";

const config = getDefaultConfig({
  appName: "Opaque Protocol",
  projectId,
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: fallback(
      ARBITRUM_SEPOLIA_RPCS.map((url) =>
        http(url, {
          timeout: 60_000,
          retryCount: 5,
          retryDelay: 2000,
        })
      ),
      { rank: true }
    ),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
