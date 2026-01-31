"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

// --- Icons (Material Symbols wrapper) ---
const Icon = ({ name, className }: { name: string; className?: string }) => (
  <span className={clsx("material-symbols-outlined select-none", className)}>
    {name}
  </span>
);

// --- Header ---
export function HistoryHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
    >
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Trade History
        </h1>
        <p className="text-slate-500 font-medium">
          Verified settlement timeline powered by TEE proof-of-execution.
        </p>
      </div>
      <div className="flex gap-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass px-4 py-2 rounded-2xl flex items-center gap-2"
        >
          <Icon name="verified" className="text-[var(--secondary)] text-xl" />
          <span className="text-sm font-bold">142 Settlements</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="glass px-4 py-2 rounded-2xl flex items-center gap-2"
        >
          <Icon name="security" className="text-[var(--primary)] text-xl" />
          <span className="text-sm font-bold">100% Privacy</span>
        </motion.div>
      </div>
    </motion.header>
  );
}

// --- Timeline Item ---
interface TimelineItemProps {
  date: string;
  pair: string;
  price: string;
  amount: string;
  status: "EXECUTED" | "SETTLED" | "ARCHIVE";
  privacy?: string;
  worker?: string;
  matchType?: string;
  isFirst?: boolean;
}

export function TimelineItem({
  date,
  pair,
  price,
  amount,
  status,
  privacy,
  worker,
  matchType,
  isFirst,
}: TimelineItemProps) {
  const statusConfig = {
    EXECUTED: {
      color: "text-[var(--secondary)]",
      bg: "bg-[var(--secondary)]/10",
      border: "border-[var(--secondary)]/20",
      icon: "pets",
      iconColor: "text-[var(--primary)]",
      borderColor: "border-[var(--primary)]",
    },
    SETTLED: {
      color: "text-[var(--secondary)]",
      bg: "bg-[var(--secondary)]/10",
      border: "border-[var(--secondary)]/20",
      icon: "policy",
      iconColor: "text-[var(--secondary)]",
      borderColor: "border-[var(--secondary)]",
    },
    ARCHIVE: {
      color: "text-slate-400",
      bg: "bg-slate-100",
      border: "border-slate-200",
      icon: "lock",
      iconColor: "text-slate-400",
      borderColor: "border-slate-200",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative mb-12"
    >
      <div
        className={clsx(
          "absolute -left-[42px] md:-left-[48px] top-4 w-12 h-12 bg-white rounded-full border-4 shadow-lg flex items-center justify-center z-10",
          config.borderColor
        )}
      >
        <Icon name={config.icon} className={clsx("font-bold", config.iconColor)} />
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className={clsx(
          "glass p-6 md:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-white/40",
          status === "ARCHIVE" && "opacity-70"
        )}
      >
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                  Ξ
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center font-bold text-xs text-white">
                  $
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black">{pair}</h2>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                  {date}
                </p>
              </div>
              <span
                className={clsx(
                  "text-[10px] font-black px-2 py-1 rounded-md border uppercase tracking-tighter",
                  config.color,
                  config.bg,
                  config.border
                )}
              >
                {status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Executed Price
                </label>
                <div className="text-xl font-mono font-bold">{price}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Fill Amount
                </label>
                <div className="text-xl font-mono font-bold">{amount}</div>
              </div>
              <div className="hidden md:block">
                {privacy && (
                  <>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Privacy Grade
                    </label>
                    <div className="flex items-center gap-1 text-green-500 font-bold">
                      <Icon name="shield" className="text-sm" />
                      {privacy}
                    </div>
                  </>
                )}
                {worker && (
                  <>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      TEE Worker
                    </label>
                    <div className="flex items-center gap-1 text-slate-600 font-mono text-sm">
                      {worker}
                    </div>
                  </>
                )}
                {matchType && (
                  <>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Match Type
                    </label>
                    <div className="text-slate-600 font-bold text-sm">
                      {matchType}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Icon
                name="analytics"
                className="text-lg text-[var(--primary)]"
              />
              View TEE Proof
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              <Icon
                name="open_in_new"
                className="text-lg text-[var(--secondary)]"
              />
              View Transaction
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
