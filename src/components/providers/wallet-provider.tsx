"use client";

import type React from "react";

import { useEffect } from "react";
import { useWalletStore } from "@/stores/wallet-store";
import { useEtherscanStore } from "@/stores/etherscan-store";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const address = useWalletStore((state) => state.address);

  const fetchData = useEtherscanStore((state) => state.fetchData);

  useEffect(() => {
    if (address) {
      fetchData(address);
    }
  }, [address, fetchData]);

  return <>{children}</>;
}
