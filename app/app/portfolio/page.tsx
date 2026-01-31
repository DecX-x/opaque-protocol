"use client";

import { Navbar } from "../../../components/app-ui/app-components";
import { Footer } from "../../../components/app-ui/app-components";
import {
  StatCard,
  FundManagement,
  AssetTable,
} from "../../../components/portfolio-ui/portfolio-components";
import { motion } from "framer-motion";

export default function PortfolioPage() {
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
            value="$412.8M"
            badge="GLOBAL"
            badgeColor="text-blue-500 bg-blue-500/10"
            trend="+12.5% this week"
            trendPositive
          />
          <StatCard
            icon="account_balance_wallet"
            iconColor="text-[var(--primary)]"
            iconBg="bg-[var(--primary)]/10"
            label="Your Wallet"
            value="$12,450.00"
            badge="EXTERNAL"
            badgeColor="text-[var(--primary)] bg-[var(--primary)]/10"
            progressBar
          />
          <StatCard
            icon="shield_with_heart"
            iconColor="text-[var(--secondary)]"
            iconBg="bg-[var(--secondary)]/10"
            label="Dark Pool Balance"
            value="$84,120.50"
            badge="PRIVATE"
            badgeColor="text-[var(--secondary)] bg-[var(--secondary)]/10"
            isPrivate
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4">
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
