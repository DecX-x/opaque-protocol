"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type TxGuardContextValue = {
  busy: boolean;
  setBusy: (busy: boolean) => void;
};

const TxGuardContext = createContext<TxGuardContextValue | null>(null);

export function TxGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);

  const value = useMemo(() => ({ busy, setBusy }), [busy]);
  return (
    <TxGuardContext.Provider value={value}>{children}</TxGuardContext.Provider>
  );
}

export function useTxGuard(): TxGuardContextValue {
  const ctx = useContext(TxGuardContext);
  if (!ctx) {
    throw new Error("useTxGuard must be used within TxGuardProvider");
  }
  return ctx;
}
