"use client";

import { WagmiProvider, createConfig, http, fallback } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

// Multiple RPC URLs for reliability and load balancing
const ARBITRUM_SEPOLIA_RPCS = [
  "https://sepolia-rollup.arbitrum.io/rpc",
  "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
  "https://arbitrum-sepolia-rpc.publicnode.com",
  "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
  "https://arbitrum-sepolia.access-nodes.com",
];

// Project ID for WalletConnect (Free tier for testing)
const projectId = "3fcc6bba6f1d54ca1b280a671a73815c";

const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: fallback(
      ARBITRUM_SEPOLIA_RPCS.map((url) => http(url, { 
        timeout: 60_000, 
        retryCount: 5,   
        retryDelay: 2000 
      })),
      { rank: true } 
    ),
  },
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: "Opaque Protocol" }),
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
