"use client";

import { Navbar } from "../../../components/app-ui/app-components";
import { Footer } from "../../../components/app-ui/app-components";
import {
  HistoryHeader,
  TimelineItem,
} from "../../../components/history-ui/history-components";
import { motion } from "framer-motion";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-light)] text-slate-800 font-sans selection:bg-[var(--primary)] selection:text-white pb-20 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-200px] left-[-100px] w-[600px] h-[600px] bg-[var(--primary)] rounded-full filter blur-[100px] opacity-30 -z-10 animate-pulse" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[var(--secondary)] rounded-full filter blur-[100px] opacity-30 -z-10 animate-pulse delay-1000" />

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pb-20 pt-32">
        <HistoryHeader />

        <div className="relative pl-14 md:pl-20">
          {/* Timeline Line */}
          <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--primary),var(--primary)_4px,transparent_4px,transparent_8px)]" />

          <TimelineItem
            date="Dec 24, 2024 • 14:22:05 UTC"
            pair="WETH / USDC"
            price="$2,451.29"
            amount="12.50 WETH"
            status="EXECUTED"
            privacy="Maximum"
            isFirst
          />

          <TimelineItem
            date="Dec 23, 2024 • 09:15:42 UTC"
            pair="WETH / USDC"
            price="$2,388.50"
            amount="5.20 WETH"
            status="SETTLED"
            worker="SGX-Worker-v3"
          />

          <TimelineItem
            date="Dec 22, 2024 • 22:01:10 UTC"
            pair="WETH / USDC"
            price="$2,310.00"
            amount="20.00 WETH"
            status="ARCHIVE"
            matchType="Darkpool Direct"
          />
        </div>

        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-8 py-4 rounded-3xl font-bold text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined select-none">
              expand_more
            </span>
            Load More History
          </motion.button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
