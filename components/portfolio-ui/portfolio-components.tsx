"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACTS, ERC20_ABI, VAULT_ABI } from "@/constants";

// --- Icons (Material Symbols wrapper) ---
const Icon = ({ name, className }: { name: string; className?: string }) => (
  <span className={clsx("material-symbols-outlined select-none", className)}>
    {name}
  </span>
);

// --- Stat Card ---
export function StatCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  badge,
  badgeColor,
  trend,
  trendPositive,
  progressBar,
  isPrivate,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
  trend?: string;
  trendPositive?: boolean;
  progressBar?: boolean;
  isPrivate?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={clsx(
        "glass p-6 rounded-3xl relative overflow-hidden group transition-all",
        isPrivate && "border-2 border-[var(--secondary)]/30"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-3 rounded-2xl", iconBg, iconColor)}>
          <Icon name={icon} className="text-3xl" />
        </div>
        <span
          className={clsx(
            "text-xs font-bold px-2 py-1 rounded-lg",
            badgeColor
          )}
        >
          {badge}
        </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
        {label}
      </h3>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
      {trend && (
        <div
          className={clsx(
            "mt-4 flex items-center gap-1 text-xs font-bold",
            trendPositive ? "text-green-500" : "text-red-500"
          )}
        >
          <Icon
            name={trendPositive ? "trending_up" : "trending_down"}
            className="text-xs"
          />
          {trend}
        </div>
      )}
      {progressBar && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "66%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-[var(--primary)]"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">Mainnet</span>
        </div>
      )}
      {isPrivate && (
        <div className="mt-4 flex items-center gap-1 text-[var(--secondary)] text-xs font-bold">
          <Icon name="verified_user" className="text-xs" /> TEE Protected
        </div>
      )}
    </motion.div>
  );
}

// --- Fund Management ---
export function FundManagement() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!amount) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(2);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(3);
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
    setAmount("");
    setStep(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-8 rounded-3xl h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl flex items-center justify-center">
          <Icon name="account_balance" />
        </div>
        <h2 className="text-xl font-bold">Fund Management</h2>
      </div>

      <div className="space-y-10 flex-grow relative">
        <StepItem
          number={1}
          title="Select Asset"
          desc="Choose token and amount"
          active={step >= 1}
          current={step === 1}
        />
        <StepItem
          number={2}
          title="Approve Transaction"
          desc="Grant permission in wallet"
          active={step >= 2}
          current={step === 2}
        />
        <StepItem
          number={3}
          title="Move to Dark Pool"
          desc="Encrypt and transfer funds"
          active={step >= 3}
          current={step === 3}
          last
        />
      </div>

      <div className="mt-12 space-y-4">
        <div className="bg-slate-700 dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-600 dark:border-slate-700 transition-colors focus-within:border-[var(--secondary)]">
          <div className="flex justify-between text-xs font-bold mb-4 uppercase text-slate-400">
            <span>Input</span>
            <span>Max: 2.5 ETH</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none p-0 text-xl font-bold w-full focus:ring-0 outline-none text-white placeholder:text-slate-500"
              placeholder="0.0"
              type="number"
            />
            <button className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-600 hover:border-[var(--secondary)] transition-colors">
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] font-bold">
                Ξ
              </div>
              <span className="font-bold text-sm">WETH</span>
            </button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeposit}
          disabled={isProcessing || !amount}
          className={clsx(
            "w-full py-4 rounded-2xl font-extrabold shadow-xl flex items-center justify-center gap-2 transition-all",
            !amount || isProcessing
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[var(--secondary)] text-slate-900 shadow-[var(--secondary)]/20 hover:shadow-[var(--secondary)]/40"
          )}
        >
          {isProcessing ? (
            <>
              <Icon name="sync" className="animate-spin" /> Processing...
            </>
          ) : (
            "INITIATE DEPOSIT"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

function StepItem({
  number,
  title,
  desc,
  active,
  current,
  last,
}: {
  number: number;
  title: string;
  desc: string;
  active: boolean;
  current: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-4 group">
      <motion.div
        animate={{
          scale: current ? 1.1 : 1,
          borderColor: active ? "var(--secondary)" : "rgba(226, 232, 240, 1)", // slate-200
          backgroundColor: active
            ? "rgba(72, 255, 217, 0.1)"
            : "rgba(255, 255, 255, 1)",
          color: active ? "var(--secondary-foreground)" : "rgba(148, 163, 184, 1)",
        }}
        className={clsx(
          "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors",
          active ? "border-[var(--secondary)] text-slate-900" : "border-slate-200"
        )}
      >
        <span className="font-bold">{active ? <Icon name="check" className="text-sm font-bold" /> : number}</span>
      </motion.div>
      {!last && (
        <div className="absolute left-5 top-10 w-0.5 h-10 bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: active ? "100%" : "0%" }}
            className="w-full bg-[var(--secondary)]"
          />
        </div>
      )}
      <motion.div animate={{ opacity: active || current ? 1 : 0.5 }}>
        <h4 className="font-bold text-sm">{title}</h4>
        <p className="text-xs text-slate-400">{desc}</p>
      </motion.div>
    </div>
  );
}

// --- Asset Table ---
export function AssetTable() {
  const assets = [
    {
      symbol: "WETH",
      name: "Wrapped Ethereum",
      price: 2451.29,
      balanceWallet: 2.45,
      balanceDark: 15.2,
      logo: "Ξ",
      color: "bg-indigo-500",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      price: 1.0,
      balanceWallet: 6444.34,
      balanceDark: 46860.9,
      logo: "$",
      color: "bg-blue-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl overflow-hidden h-full flex flex-col"
    >
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Assets</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors">
            <Icon name="filter_list" className="text-xl" />
          </button>
          <button className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors">
            <Icon name="search" className="text-xl" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase">
            <tr>
              <th className="px-8 py-5">Asset</th>
              <th className="px-8 py-5">Price</th>
              <th className="px-8 py-5 text-center">Wallet Balance</th>
              <th className="px-8 py-5 text-center">Dark Pool Balance</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {assets.map((asset, i) => (
              <motion.tr
                key={asset.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm", asset.color)}>
                      {asset.logo}
                    </div>
                    <div>
                      <div className="font-bold">{asset.symbol}</div>
                      <div className="text-xs text-slate-400">{asset.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-sm font-medium">
                  ${asset.price.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="font-bold">{asset.balanceWallet.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">
                    ${(asset.balanceWallet * asset.price).toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="font-bold text-[var(--secondary)]">
                    {asset.balanceDark.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">
                    ${(asset.balanceDark * asset.price).toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl border border-[var(--secondary)] text-[var(--secondary)] text-xs font-bold hover:bg-[var(--secondary)] hover:text-slate-900 transition-colors"
                    >
                      Deposit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Withdraw
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
