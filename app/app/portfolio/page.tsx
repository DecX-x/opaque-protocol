"use client";

import { Navbar } from "../../../components/app-ui/app-components";
import { Footer } from "../../../components/app-ui/app-components";
import {
  StatCard,
  FundManagement,
  AssetTable,
  FaucetCard,
  AVAILABLE_TOKENS,
} from "../../../components/portfolio-ui/portfolio-components";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, ERC20_ABI, VAULT_ABI, ORACLE_ABI } from "@/constants";

export default function PortfolioPage() {
  const { address } = useAccount();
  const vaultAddress = CONTRACTS.ARBITRUM_SEPOLIA.VAULT as `0x${string}`;
  const oracleAddress = CONTRACTS.ARBITRUM_SEPOLIA.ORACLE as `0x${string}`;

  // Dynamic Contract Calls
  const contracts = AVAILABLE_TOKENS.flatMap((token) => {
    const tokenAddr = CONTRACTS.ARBITRUM_SEPOLIA[token.symbol as keyof typeof CONTRACTS.ARBITRUM_SEPOLIA] as `0x${string}`;
    return [
      // 0: Price (from Oracle)
      { address: oracleAddress, abi: ORACLE_ABI, functionName: "getPrice", args: [tokenAddr] },
      // 1: User Wallet Balance
      { address: tokenAddr, abi: ERC20_ABI, functionName: "balanceOf", args: [address || "0x0000000000000000000000000000000000000000"] },
      // 2: User Vault Balance
      { address: vaultAddress, abi: VAULT_ABI, functionName: "balances", args: [address || "0x0000000000000000000000000000000000000000", tokenAddr] },
      // 3: Vault TVL (Token Balance of Vault)
      { address: tokenAddr, abi: ERC20_ABI, functionName: "balanceOf", args: [vaultAddress] },
    ];
  });

  const { data } = useReadContracts({
    contracts,
    query: { refetchInterval: 8000 },
  });

  // Calculate Stats
  let totalWallet = 0;
  let totalVault = 0;
  let totalTVL = 0;

  AVAILABLE_TOKENS.forEach((token, i) => {
    const baseIdx = i * 4;
    const priceRaw = data?.[baseIdx]?.result as bigint;
    const walletRaw = data?.[baseIdx + 1]?.result as bigint;
    const vaultRaw = data?.[baseIdx + 2]?.result as bigint;
    const tvlRaw = data?.[baseIdx + 3]?.result as bigint;

    // Price is 8 decimals. Tokens are token.decimals.
    const price = priceRaw ? parseFloat(formatUnits(priceRaw, 8)) : 0;
    const wallet = walletRaw ? parseFloat(formatUnits(walletRaw, token.decimals)) : 0;
    const vault = vaultRaw ? parseFloat(formatUnits(vaultRaw, token.decimals)) : 0;
    const tvl = tvlRaw ? parseFloat(formatUnits(tvlRaw, token.decimals)) : 0;

    totalWallet += wallet * price;
    totalVault += vault * price;
    totalTVL += tvl * price;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-light)] text-slate-800 font-sans selection:bg-[var(--primary)] selection:text-white pb-20 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)] rounded-full filter blur-[120px] opacity-20 -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--secondary)] rounded-full filter blur-[120px] opacity-20 -z-10 animate-pulse delay-1000" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 pt-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon="public"
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
            label="Global Liquidity"
            value={`$${totalTVL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            badge="GLOBAL"
            badgeColor="text-blue-500 bg-blue-500/10"
            trend="Live Oracle"
            trendPositive
          />
          <StatCard
            icon="account_balance_wallet"
            iconColor="text-[var(--primary)]"
            iconBg="bg-[var(--primary)]/10"
            label="Your Wallet"
            value={`$${totalWallet.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            badge="EXTERNAL"
            badgeColor="text-[var(--primary)] bg-[var(--primary)]/10"
            progressBar
          />
          <StatCard
            icon="shield_with_heart"
            iconColor="text-[var(--secondary)]"
            iconBg="bg-[var(--secondary)]/10"
            label="Dark Pool Balance"
            value={`$${totalVault.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            badge="PRIVATE"
            badgeColor="text-[var(--secondary)] bg-[var(--secondary)]/10"
            isPrivate
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
            <FaucetCard />
            <FundManagement />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <AssetTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
