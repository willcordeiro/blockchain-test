/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { EtherscanTransaction } from "@/types/transaction";
import { getUSDCBalance, getUSDCTransfers } from "@/lib/etherscan-service";

interface EtherscanStore {
  balance: string;
  transactions: EtherscanTransaction[];
  loading: boolean;
  error: string | null;
  lastAction: string | null;
  fetchData: (address: string) => Promise<void>;
  refresh: (address: string) => Promise<void>;
  clearError: () => void;
}

export const useEtherscanStore = create<EtherscanStore>((set) => ({
  balance: "0",
  transactions: [],
  loading: false,
  error: null,
  lastAction: null,

  fetchData: async (address: string) => {
    if (!address) return;

    console.log(" Fetching Etherscan data for:", address);
    set({ loading: true, error: null, lastAction: null });

    try {
      const [balance, transactions] = await Promise.all([
        getUSDCBalance(address),
        getUSDCTransfers(address),
      ]);

      console.log(" Etherscan data fetched successfully");
      set({
        balance,
        transactions,
        loading: false,
        lastAction: "data_loaded",
      });
    } catch (error: any) {
      console.error(" Etherscan fetch error:", error);
      const errorMsg = error.message || "Failed to fetch data";

      set({
        error: errorMsg,
        loading: false,
        lastAction: "fetch_failed",
      });
    }
  },

  refresh: async (address: string) => {
    if (!address) return;
    await useEtherscanStore.getState().fetchData(address);
  },

  clearError: () => {
    set({ error: null });
  },
}));
