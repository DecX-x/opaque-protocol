"use client";

import { useState } from "react";
import {
  Navbar,
  MarketStats,
  TradingPanel,
  OrderTable,
  ProtocolInfo,
  Footer,
} from "../../components/app-ui/app-components";

export default function AppPage() {
  const [orders, setOrders] = useState<any[]>([
    {
      id: "1",
      pair: "WETH/USDC",
      side: "BUY",
      amount: "5.5",
      price: "2448.00",
      status: "Encrypted",
      timestamp: new Date(),
    },
    {
      id: "2",
      pair: "WETH/USDC",
      side: "SELL",
      amount: "10.0",
      price: "2510.50",
      status: "Queued",
      timestamp: new Date(),
    },
  ]);

  const handlePlaceOrder = (newOrder: any) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-light)] text-slate-800 font-sans selection:bg-[var(--primary)] selection:text-white pb-20 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[var(--primary)] rounded-full filter blur-[80px] opacity-40 -z-10 animate-pulse" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[var(--secondary)] rounded-full filter blur-[80px] opacity-40 -z-10 animate-pulse delay-1000" />

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <MarketStats />
        </div>

        {/* Center Main */}
        <div className="col-span-12 lg:col-span-6">
          <TradingPanel onPlaceOrder={handlePlaceOrder} />
          <OrderTable orders={orders} />
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <ProtocolInfo />
        </div>
      </main>

      <Footer />
    </div>
  );
}
