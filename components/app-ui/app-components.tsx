"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useSwitchChain,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits } from "viem";
import { CONTRACTS, ORACLE_ABI, VAULT_ABI, ERC20_ABI } from "@/constants";
import { AVAILABLE_TOKENS } from "@/components/portfolio-ui/portfolio-components";

// --- Types ---
type OrderSide = "BUY" | "SELL";
type OrderStatus = "IDLE" | "ENCRYPTING" | "SENDING" | "SUCCESS";

interface Order {
  id: string;
  pair: string;
  side: OrderSide;
  price: string;
  amount: string;
  status: "Encrypted" | "Queued" | "Filled";
  timestamp: Date;
}

// --- Icons (Material Symbols wrapper) ---
const Icon = ({ name, className }: { name: string; className?: string }) => (
  <span className={clsx("material-symbols-outlined select-none", className)}>
    {name}
  </span>
);

// --- Navbar Component ---
export function Navbar() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConnected && chainId !== 421614) {
      switchChain({ chainId: 421614 });
    }
  }, [isConnected, chainId, switchChain]);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-2 sm:py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-3 shadow-sm pointer-events-auto relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 pastel-gradient rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Icon name="blur_on" className="text-white text-xl sm:text-2xl" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              OPAQUE{" "}
              <span className="text-slate-400 font-medium hidden sm:inline">
                TERMINAL
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              href="/app"
              className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            >
              Trade
            </Link>
            <Link
              href="/app/portfolio"
              className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/app/history"
              className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            >
              History
            </Link>
            <a
              href="#"
              className="text-slate-500 hover:text-[var(--primary)] transition-colors"
            >
              Docs
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ConnectButton chainStatus="icon" showBalance={false} />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-500 hover:text-[var(--primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon
                name={isMobileMenuOpen ? "close" : "menu"}
                className="text-2xl"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-4 glass rounded-2xl p-4 flex flex-col gap-4 md:hidden shadow-xl"
            >
              <Link
                href="/app"
                className="text-slate-600 hover:text-[var(--primary)] font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trade
              </Link>
              <Link
                href="/app/portfolio"
                className="text-slate-600 hover:text-[var(--primary)] font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/app/history"
                className="text-slate-600 hover:text-[var(--primary)] font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                History
              </Link>
              <a
                href="#"
                className="text-slate-600 hover:text-[var(--primary)] font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// --- Market Stats (Left Column) ---
export function MarketStats() {
  const [priceIndex, setPriceIndex] = useState(0);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  const oracleAddress = CONTRACTS.ARBITRUM_SEPOLIA.ORACLE as `0x${string}`;

  const priceContracts = useMemo(
    () =>
      AVAILABLE_TOKENS.map((token) => {
        const tokenAddr =
          CONTRACTS.ARBITRUM_SEPOLIA[
            token.symbol as keyof typeof CONTRACTS.ARBITRUM_SEPOLIA
          ] as `0x${string}`;
        return {
          address: oracleAddress,
          abi: ORACLE_ABI,
          functionName: "getPrice",
          args: [tokenAddr],
        };
      }),
    [oracleAddress]
  );

  const { data: oraclePrices } = useReadContracts({
    contracts: priceContracts,
    query: { refetchInterval: 8000 },
  });

  const activeToken = AVAILABLE_TOKENS[priceIndex % AVAILABLE_TOKENS.length];
  const activePriceRaw = oraclePrices?.[priceIndex]?.result as bigint | undefined;
  const activePrice = activePriceRaw ? formatUnits(activePriceRaw, 8) : "0";

  useEffect(() => {
    const timer = setInterval(() => {
      setPriceIndex((prev) => (prev + 1) % AVAILABLE_TOKENS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Price Card */}
      <div
        className="glass p-6 rounded-2xl cursor-pointer relative"
        onClick={() => setIsPriceListOpen((v) => !v)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
              {activeToken.logo}
            </div>
            <span className="font-bold">{activeToken.symbol} / USD</span>
          </div>
          <span className="text-xs font-bold text-[var(--secondary)] bg-[var(--secondary)]/10 px-2 py-1 rounded-md">
            ORACLE
          </span>
        </div>
        <div className="mb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToken.symbol}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-3xl font-extrabold"
            >
              ${parseFloat(activePrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </motion.div>
          </AnimatePresence>
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1">
            <Icon name="swap_horiz" className="text-sm" />
            Tap to view all prices
          </div>
        </div>
        {/* Mock Chart Bars */}
        <div className="h-16 w-full flex items-end gap-1 overflow-hidden mt-4">
          {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={clsx(
                "w-full rounded-t-sm",
                i === 5 ? "bg-[var(--secondary)]" : "bg-[var(--secondary)]/30"
              )}
            />
          ))}
        </div>

        <AnimatePresence>
          {isPriceListOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-6 right-6 top-full mt-3 bg-white/90 backdrop-blur rounded-2xl border border-slate-100 shadow-xl p-4 z-20"
            >
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_TOKENS.map((token, idx) => {
                  const priceRaw = oraclePrices?.[idx]?.result as bigint | undefined;
                  const price = priceRaw ? formatUnits(priceRaw, 8) : "0";
                  return (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{token.logo}</span>
                        <span className="text-xs font-bold">{token.symbol}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        ${parseFloat(price).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Privacy Status */}
      <div className="glass p-6 rounded-2xl bg-gradient-to-br from-[var(--accent)]/30 to-white/10">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Icon name="security" className="text-[var(--primary)]" />
          Privacy Status
        </h3>
        <div className="space-y-4">
          <StatusRow label="TEE Verification" value="PASSED" success />
          <StatusRow label="Anonymity Set" value="1,429 Participants" />
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-[var(--secondary)] h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({
  label,
  value,
  success,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={clsx(
          "font-mono font-medium",
          success ? "text-green-500" : "text-slate-700"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// --- Trading Panel (Center Column) ---
export function TradingPanel({
  onPlaceOrder,
}: {
  onPlaceOrder: (order: Order) => void;
}) {
  const { address } = useAccount();
  const [side, setSide] = useState<OrderSide>("BUY");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("2450.00");
  const [status, setStatus] = useState<OrderStatus>("IDLE");
  const [payToken, setPayToken] = useState(AVAILABLE_TOKENS[0]);
  const [receiveToken, setReceiveToken] = useState(AVAILABLE_TOKENS[1]);

  useEffect(() => {
    if (side === "BUY") {
      setPayToken(AVAILABLE_TOKENS[0]);
      setReceiveToken(AVAILABLE_TOKENS[1]);
    } else {
      setPayToken(AVAILABLE_TOKENS[1]);
      setReceiveToken(AVAILABLE_TOKENS[0]);
    }
  }, [side]);

  const payTokenAddress =
    CONTRACTS.ARBITRUM_SEPOLIA[
      payToken.symbol as keyof typeof CONTRACTS.ARBITRUM_SEPOLIA
    ] as `0x${string}`;

  const { data: payBalance } = useReadContract({
    address: payTokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 8000 },
  });

  const vaultAddress = CONTRACTS.ARBITRUM_SEPOLIA.VAULT as `0x${string}`;
  const { data: payVaultBalance } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: "balances",
    args: [address as `0x${string}`, payTokenAddress],
    query: { enabled: !!address, refetchInterval: 8000 },
  });

  const displayBalance = payVaultBalance
    ? formatUnits(payVaultBalance as bigint, payToken.decimals)
    : "0";

  const quickTokens = AVAILABLE_TOKENS.slice(0, 5);

  const swapTokens = () => {
    setSide((prev) => (prev === "BUY" ? "SELL" : "BUY"));
    setPayToken(receiveToken);
    setReceiveToken(payToken);
  };

  const handleTrade = async () => {
    if (!amount || !address) return;

    try {
      setStatus("ENCRYPTING");
      
      // Calculate Amounts (Simplified for Demo)
      // BUY/SELL are UI semantics. The actual trade uses the selected tokens.
      const amountSell = parseUnits(amount, payToken.decimals).toString();
      let amountBuy = "0";
      
      // Demo pricing only; use oracle later for real quotes.
      const computed = side === "BUY"
        ? parseFloat(amount) / parseFloat(price)
        : parseFloat(amount) * parseFloat(price);
      amountBuy = parseUnits(computed.toFixed(receiveToken.decimals), receiveToken.decimals).toString();

      // Construct Order Object
      const orderData = {
        id: Math.random().toString(36).substr(2, 9),
        owner: address,
        pair: `${receiveToken.symbol}/${payToken.symbol}`,
        side,
        tokenBuy: CONTRACTS.ARBITRUM_SEPOLIA[
          receiveToken.symbol as keyof typeof CONTRACTS.ARBITRUM_SEPOLIA
        ],
        tokenSell: CONTRACTS.ARBITRUM_SEPOLIA[
          payToken.symbol as keyof typeof CONTRACTS.ARBITRUM_SEPOLIA
        ],
        amountBuy,
        amountSell,
        price,
        timestamp: new Date().toISOString(),
      };

      // Initialize iExec Data Protector
      // @ts-ignore - window.ethereum is not typed by default
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet provider found");
      }
      
      // @ts-ignore
      const dataProtector = new IExecDataProtector(window.ethereum);
      
      const protectedData = await dataProtector.protectData({
        data: { order: JSON.stringify(orderData) },
        name: `Opaque Order ${orderData.id}`,
      });

      console.log("Protected Data Address:", protectedData.address);

      setStatus("SENDING");
      // Simulate sending to OrderBook / iExec Task
      await new Promise((r) => setTimeout(r, 1000));
      
      setStatus("SUCCESS");

      // Add Order to Table (Visual only for now)
      onPlaceOrder({
        id: orderData.id,
        pair: `${receiveToken.symbol}/${payToken.symbol}`,
        side,
        amount,
        price,
        status: "Encrypted",
        timestamp: new Date(),
      });

      // Reset
      setTimeout(() => {
        setStatus("IDLE");
        setAmount("");
      }, 2000);

    } catch (e) {
      console.error(e);
      setStatus("IDLE");
      alert("Encryption Failed: " + (e as Error).message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 rounded-[2.5rem] shadow-2xl border-white/50 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
        <Icon name="lock_reset" className="text-[180px] text-[var(--primary)]" />
      </div>

      <div className="relative z-10">
        {/* Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 relative">
          <div className="absolute inset-0 p-1.5 flex pointer-events-none">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={clsx(
                "w-1/2 h-full rounded-xl shadow-md",
                side === "BUY" ? "bg-[var(--secondary)]" : "translate-x-full bg-[var(--primary)]"
              )}
            />
          </div>
          <button
            onClick={() => setSide("BUY")}
            className={clsx(
              "flex-1 py-3 rounded-xl font-bold transition-colors z-10 relative",
              side === "BUY" ? "text-white" : "text-slate-500 hover:text-slate-700"
            )}
          >
            BUY
          </button>
          <button
            onClick={() => setSide("SELL")}
            className={clsx(
              "flex-1 py-3 rounded-xl font-bold transition-colors z-10 relative",
              side === "SELL" ? "text-white" : "text-slate-500 hover:text-slate-700"
            )}
          >
            SELL
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <InputGroup
            label="You Pay (Dark Pool)"
            value={amount}
            onChange={setAmount}
            placeholder="0.00"
            ticker={payToken.symbol}
            balance={displayBalance}
          />

          <div className="flex justify-center -my-3 relative z-20">
            <motion.button
              type="button"
              whileHover={{ rotate: 180 }}
              onClick={swapTokens}
              className="bg-white p-2 rounded-full shadow-lg border border-slate-100 cursor-pointer"
            >
              <Icon name="swap_vert" className="text-[var(--primary)]" />
            </motion.button>
          </div>

          <InputGroup
            label="Limit Price"
            value={price}
            onChange={setPrice}
            placeholder="0.00"
            ticker={`${payToken.symbol} per ${receiveToken.symbol}`}
          />

          {/* Action Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTrade}
              disabled={status !== "IDLE" || !amount}
              className={clsx(
                "w-full py-5 rounded-2xl text-lg font-extrabold shadow-xl flex items-center justify-center gap-3 transition-all",
                side === "BUY" 
                  ? "bg-[var(--secondary)] shadow-[var(--secondary)]/30 text-slate-800" 
                  : "bg-[var(--primary)] shadow-[var(--primary)]/30 text-white",
                (!amount && status === "IDLE") && "opacity-50 cursor-not-allowed"
              )}
            >
              <AnimatePresence mode="wait">
                {status === "IDLE" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="lock_open" className="text-2xl" />
                    ENCRYPT & PLACE ORDER
                  </motion.div>
                )}
                {status === "ENCRYPTING" && (
                  <motion.div
                    key="encrypting"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="sync" className="animate-spin text-2xl" />
                    Encrypting Data...
                  </motion.div>
                )}
                {status === "SENDING" && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="verified_user" className="animate-bounce text-2xl" />
                    Sending to TEE...
                  </motion.div>
                )}
                {status === "SUCCESS" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="check_circle" className="text-2xl" />
                    Order Placed!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <p className="text-center text-xs text-slate-400 font-medium px-8">
            Your order parameters will be encrypted locally using ECIES before
            being routed to our Intel SGX enclave.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  placeholder,
  ticker,
  balance,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ticker: string;
  balance?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ml-1">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </label>
        {balance && (
          <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-md">
            Balance: {parseFloat(balance).toFixed(4)}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-2xl font-bold focus:border-[var(--secondary)] focus:ring-0 transition-all outline-none text-slate-800 placeholder:text-slate-300"
          placeholder={placeholder}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm bg-slate-50 px-2 py-1 rounded-lg pointer-events-none">
          {ticker}
        </div>
      </div>
    </div>
  );
}

// --- Order Table (Center Column - Bottom) ---
export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Active Encrypted Trades</h2>
        <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full uppercase">
          {orders.length} Orders Queued
        </span>
      </div>
      <div className="glass overflow-hidden rounded-2xl min-h-[150px] overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2 min-w-[500px]">
            <Icon name="inbox" className="text-4xl opacity-50" />
            <span className="text-sm font-medium">No active encrypted orders</span>
          </div>
        ) : (
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-white/40 text-xs font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4">Pair</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/20">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="hover:bg-white/20 transition-colors"
                  >
                    <td className="p-4 font-bold">{order.pair}</td>
                    <td
                      className={clsx(
                        "p-4 font-bold",
                        order.side === "BUY" ? "text-[var(--secondary)]" : "text-[var(--primary)]"
                      )}
                    >
                      {order.side}
                    </td>
                    <td className="p-4 font-mono">{order.amount}</td>
                    <td className="p-4 font-mono">${order.price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[var(--primary)] font-semibold">
                        <Icon name="lock" className="text-base" />
                        {order.status}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

// --- Protocol Info (Right Column) ---
export function ProtocolInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* Rebranded Card (No Manta) */}
      <div className="bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl group cursor-pointer">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-4">Hardware Secured</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            Execution guarantees powered by Intel SGX. Zero leakage, 100% privacy.
          </p>
          <button className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            VIEW PROOF <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-20 transition-transform group-hover:scale-110 duration-500">
          <Icon name="memory" className="text-[150px]" />
        </div>
      </div>

      {/* Stats */}
      <div className="glass p-6 rounded-2xl">
        <h4 className="font-bold text-sm mb-4">Protocol Health</h4>
        <div className="space-y-6">
          <HealthRow
            icon="bolt"
            color="text-cyan-500"
            bg="bg-cyan-100"
            label="Gas Cost"
            value="~0.0002 ETH"
          />
          <HealthRow
            icon="layers"
            color="text-pink-500"
            bg="bg-pink-100"
            label="Total TVL"
            value="$12.4M"
          />
        </div>
      </div>

      {/* Guardian Badge */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white/40 border-2 border-dashed border-[var(--primary)]/30 flex flex-col items-center text-center select-none"
      >
        <div className="w-24 h-24 mb-4 relative">
          <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-full animate-ping"></div>
          <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-inner">
            <Icon name="verified_user" className="text-5xl text-[var(--primary)]" />
          </div>
        </div>
        <h5 className="font-bold text-sm mb-1">Your Privacy Guardian</h5>
        <p className="text-xs text-slate-500">
          All data stays within the TEE until execution.
        </p>
      </motion.div>
    </motion.div>
  );
}

function HealthRow({
  icon,
  color,
  bg,
  label,
  value,
}: {
  icon: string;
  color: string;
  bg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
        <Icon name={icon} className={color} />
      </div>
      <div>
        <div className="text-xs text-slate-400 font-bold uppercase">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

// --- Footer ---
export function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-12">
      <div className="text-xs text-slate-400 font-medium">
        © 2025 Opaque Protocol. Powered by{" "}
        <span className="text-[var(--secondary)]">Intel SGX</span> &{" "}
        <span className="text-[var(--primary)]">Ethereum</span>.
      </div>
      <div className="flex gap-6">
        {["language", "hub", "chat"].map((icon) => (
          <a
            key={icon}
            href="#"
            className="text-slate-400 hover:text-[var(--primary)] transition-colors hover:scale-110"
          >
            <Icon name={icon} />
          </a>
        ))}
      </div>
    </footer>
  );
}
