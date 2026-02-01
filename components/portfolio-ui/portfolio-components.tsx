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

// --- Faucet Card ---
export function FaucetCard() {
  const { address, chainId } = useAccount();
  const [tokenSymbol, setTokenSymbol] = useState<"USDC" | "WETH">("USDC");
  const { data: hash, writeContract, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isProcessing = isWritePending || isConfirming;

  const handleMint = () => {
    if (!address) return;
    if (chainId !== 421614) {
        alert("Please switch to Arbitrum Sepolia");
        return;
    }
    
    try {
        console.log(`Minting ${tokenSymbol} to ${address}...`);
        writeContract({
            address: CONTRACTS.ARBITRUM_SEPOLIA[tokenSymbol] as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "mint",
            args: [address, parseUnits("1000", 18)],
        });
    } catch (err) {
        console.error("Mint Error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-6 rounded-3xl relative overflow-hidden group mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Icon name="water_drop" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Testnet Faucet</h3>
            <p className="text-xs text-slate-400">Get mock tokens for testing</p>
          </div>
        </div>
      </div>

      {writeError && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl break-all">
            {writeError.message.slice(0, 100)}...
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex relative">
           <div className="absolute inset-y-1 w-1/2 bg-white dark:bg-slate-700 shadow-sm rounded-lg transition-all" 
                style={{ left: tokenSymbol === "USDC" ? "4px" : "calc(50% - 4px)" }} />
           <button 
             onClick={() => setTokenSymbol("USDC")}
             className="flex-1 relative z-10 text-xs font-bold py-2 text-center"
           >
             USDC
           </button>
           <button 
             onClick={() => setTokenSymbol("WETH")}
             className="flex-1 relative z-10 text-xs font-bold py-2 text-center"
           >
             WETH
           </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMint}
          disabled={isProcessing}
          className="flex-1 bg-purple-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-500/20 disabled:opacity-50"
        >
          {isProcessing ? (
             <span className="flex items-center justify-center gap-1"><Icon name="sync" className="animate-spin text-sm" /> Minting...</span>
          ) : isSuccess ? (
             <span className="flex items-center justify-center gap-1"><Icon name="check" className="text-sm" /> Done</span>
          ) : (
             "Mint 1000"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// --- Fund Management ---
export function FundManagement() {
  const { address, chainId } = useAccount();
  const [mode, setMode] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState<"USDC" | "WETH">("USDC");
  
  const tokenAddress = CONTRACTS.ARBITRUM_SEPOLIA[tokenSymbol] as `0x${string}`;
  const vaultAddress = CONTRACTS.ARBITRUM_SEPOLIA.VAULT as `0x${string}`;

  const { data: hash, writeContract, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const isProcessing = isWritePending || isConfirming;

  // Check Allowance (Only relevant for Deposit)
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [address || '0x0000000000000000000000000000000000000000', vaultAddress],
  });

  useEffect(() => {
    if (isConfirmed) {
      if (mode === "DEPOSIT") {
        refetchAllowance();
        // Auto-advance logic
        if (step === 2) setStep(3);
        if (step === 3) {
          setAmount("");
          setStep(1);
        }
      } else {
        setAmount("");
      }
    }
  }, [isConfirmed, step, mode, refetchAllowance]);

  const validateChain = () => {
      if (chainId !== 421614) {
          alert("Please switch to Arbitrum Sepolia");
          return false;
      }
      return true;
  }

  const handleApprove = () => {
    if (!amount || !validateChain()) return;
    setStep(2);
    try {
        writeContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [vaultAddress, parseUnits(amount, 18)],
        });
    } catch (e) { console.error(e); }
  };

  const handleDeposit = () => {
    if (!amount || !validateChain()) return;
    setStep(3);
    try {
        writeContract({
            address: vaultAddress,
            abi: VAULT_ABI,
            functionName: "deposit",
            args: [tokenAddress, parseUnits(amount, 18)],
        });
    } catch (e) { console.error(e); }
  };

  const handleWithdraw = () => {
    if (!amount || !validateChain()) return;
    try {
        writeContract({
            address: vaultAddress,
            abi: VAULT_ABI,
            functionName: "withdraw",
            args: [tokenAddress, parseUnits(amount, 18)],
        });
    } catch (e) { console.error(e); }
  };

  const parsedAmount = amount ? parseUnits(amount, 18) : BigInt(0);
  const currentAllowance = allowance ? (allowance as bigint) : BigInt(0);
  const needsApproval = mode === "DEPOSIT" && currentAllowance < parsedAmount;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-8 rounded-3xl h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl flex items-center justify-center">
            <Icon name="account_balance" />
          </div>
          <h2 className="text-xl font-bold">Manage Funds</h2>
        </div>
      </div>

      {writeError && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl break-all">
            Error: {writeError.message.slice(0, 100)}...
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
        <button
          onClick={() => { setMode("DEPOSIT"); setStep(1); }}
          className={clsx(
            "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
            mode === "DEPOSIT" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Deposit
        </button>
        <button
          onClick={() => { setMode("WITHDRAW"); setStep(1); }}
          className={clsx(
            "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
            mode === "WITHDRAW" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
          )}
        >
          Withdraw
        </button>
      </div>

      {mode === "DEPOSIT" ? (
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
      ) : (
        <div className="flex-grow flex flex-col justify-center items-center text-center space-y-4 opacity-50">
           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
             <Icon name="outbound" className="text-2xl text-slate-400" />
           </div>
           <div>
             <h3 className="font-bold">Withdraw to Wallet</h3>
             <p className="text-xs text-slate-400">Funds will be moved from Vault to your Wallet</p>
           </div>
        </div>
      )}

      <div className="mt-12 space-y-4">
        <div className="bg-slate-700 dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-600 dark:border-slate-700 transition-colors focus-within:border-[var(--secondary)]">
          <div className="flex justify-between text-xs font-bold mb-4 uppercase text-slate-400">
            <span>Amount</span>
            <span>{mode}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none p-0 text-xl font-bold w-full focus:ring-0 outline-none text-white placeholder:text-slate-500"
              placeholder="0.0"
              type="number"
            />
            <button 
                onClick={() => setTokenSymbol(tokenSymbol === "USDC" ? "WETH" : "USDC")}
                className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-xl border border-slate-600 hover:border-[var(--secondary)] transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[8px] font-bold">
                {tokenSymbol === "WETH" ? "Ξ" : "$"}
              </div>
              <span className="font-bold text-sm">{tokenSymbol}</span>
            </button>
          </div>
        </div>
        
        {mode === "DEPOSIT" ? (
            needsApproval ? (
                <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprove}
                disabled={isProcessing || !amount}
                className={clsx(
                "w-full py-4 rounded-2xl font-extrabold shadow-xl flex items-center justify-center gap-2 transition-all",
                !amount || isProcessing
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[var(--primary)] text-white shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/40"
                )}
            >
                {isProcessing ? (
                <>
                    <Icon name="sync" className="animate-spin" /> Processing...
                </>
                ) : (
                "APPROVE TOKEN"
                )}
            </motion.button>
            ) : (
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
                    "DEPOSIT TO VAULT"
                )}
                </motion.button>
            )
        ) : (
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={isProcessing || !amount}
            className={clsx(
                "w-full py-4 rounded-2xl font-extrabold shadow-xl flex items-center justify-center gap-2 transition-all",
                !amount || isProcessing
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-red-500 text-white shadow-red-500/20 hover:shadow-red-500/40"
            )}
            >
            {isProcessing ? (
                <>
                <Icon name="sync" className="animate-spin" /> Processing...
                </>
            ) : (
                "WITHDRAW FUNDS"
            )}
            </motion.button>
        )}
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
  const { address } = useAccount();
  const vaultAddress = CONTRACTS.ARBITRUM_SEPOLIA.VAULT as `0x${string}`;
  
  const tokens = [
    { symbol: "WETH", address: CONTRACTS.ARBITRUM_SEPOLIA.WETH, logo: "Ξ", color: "bg-indigo-500", decimals: 18 },
    { symbol: "USDC", address: CONTRACTS.ARBITRUM_SEPOLIA.USDC, logo: "$", color: "bg-blue-500", decimals: 18 },
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
              <th className="px-8 py-5 text-center">Wallet Balance</th>
              <th className="px-8 py-5 text-center">Dark Pool Balance</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tokens.map((token, i) => (
              <AssetRow 
                key={token.symbol} 
                token={token} 
                index={i} 
                userAddress={address} 
                vaultAddress={vaultAddress} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AssetRow({ token, index, userAddress, vaultAddress }: { token: any, index: number, userAddress?: `0x${string}`, vaultAddress: `0x${string}` }) {
  // Wallet Balance
  const { data: walletBal } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress || '0x0000000000000000000000000000000000000000'],
  });

  // Vault Balance
  const { data: vaultBal } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "balances",
    args: [userAddress || '0x0000000000000000000000000000000000000000', token.address],
  });

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm", token.color)}>
            {token.logo}
          </div>
          <div>
            <div className="font-bold">{token.symbol}</div>
            <div className="text-xs text-slate-400">Mock Token</div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <div className="font-bold">
            {walletBal ? parseFloat(formatUnits(walletBal as bigint, token.decimals)).toFixed(4) : "0.0000"}
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <div className="font-bold text-[var(--secondary)]">
            {vaultBal ? parseFloat(formatUnits(vaultBal as bigint, token.decimals)).toFixed(4) : "0.0000"}
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <span className="text-xs text-slate-400 font-medium">Manage above</span>
      </td>
    </motion.tr>
  );
}
