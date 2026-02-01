"use client";

import { Navbar } from "../../../components/app-ui/app-components";
import { Footer } from "../../../components/app-ui/app-components";
import {
  StatCard,
  FundManagement,
  AssetTable,
  FaucetCard,
} from "../../../components/portfolio-ui/portfolio-components";
import { useAccount, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, ERC20_ABI, VAULT_ABI } from "@/constants";

export default function PortfolioPage() {
  const { address } = useAccount();
  
  const vaultAddress = CONTRACTS.ARBITRUM_SEPOLIA.VAULT as `0x${string}`;
  const usdcAddress = CONTRACTS.ARBITRUM_SEPOLIA.USDC as `0x${string}`;
  const wethAddress = CONTRACTS.ARBITRUM_SEPOLIA.WETH as `0x${string}`;

  const { data } = useReadContracts({
    contracts: [
        // 0: Vault USDC Balance (TVL)
        { address: usdcAddress, abi: ERC20_ABI, functionName: 'balanceOf', args: [vaultAddress] },
        // 1: Vault WETH Balance (TVL)
        { address: wethAddress, abi: ERC20_ABI, functionName: 'balanceOf', args: [vaultAddress] },
        // 2: User Wallet USDC
        { address: usdcAddress, abi: ERC20_ABI, functionName: 'balanceOf', args: [address || '0x0000000000000000000000000000000000000000'] },
        // 3: User Wallet WETH
        { address: wethAddress, abi: ERC20_ABI, functionName: 'balanceOf', args: [address || '0x0000000000000000000000000000000000000000'] },
        // 4: User Vault USDC
        { address: vaultAddress, abi: VAULT_ABI, functionName: 'balances', args: [address || '0x0000000000000000000000000000000000000000', usdcAddress] },
        // 5: User Vault WETH
        { address: vaultAddress, abi: VAULT_ABI, functionName: 'balances', args: [address || '0x0000000000000000000000000000000000000000', wethAddress] },
    ]
  });

  const getVal = (index: number, decimals: number = 18) => 
    data?.[index]?.result ? parseFloat(formatUnits(data[index].result as bigint, decimals)) : 0;

  const ethPrice = 2450; // Mock Price for stats
  
  // Calc Stats
  const tvl = getVal(0) + (getVal(1) * ethPrice);
  const walletBal = getVal(2) + (getVal(3) * ethPrice);
  const vaultBal = getVal(4) + (getVal(5) * ethPrice);

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
            value={`$${tvl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            badge="GLOBAL"
            badgeColor="text-blue-500 bg-blue-500/10"
            trend="Live TVL"
            trendPositive
          />
          <StatCard
            icon="account_balance_wallet"
            iconColor="text-[var(--primary)]"
            iconBg="bg-[var(--primary)]/10"
            label="Your Wallet"
            value={`$${walletBal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            badge="EXTERNAL"
            badgeColor="text-[var(--primary)] bg-[var(--primary)]/10"
            progressBar
          />
          <StatCard
            icon="shield_with_heart"
            iconColor="text-[var(--secondary)]"
            iconBg="bg-[var(--secondary)]/10"
            label="Dark Pool Balance"
            value={`$${vaultBal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
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
