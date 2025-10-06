import { create } from "zustand";
import { ethers } from "ethers";
import { switchToSepolia } from "@/lib/wallet-utils";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface WalletStore {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  isConnecting: boolean;
  error: string | null;
  lastAction: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletStore>((set) => {
  const autoConnect = async () => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const manuallyDisconnected = localStorage.getItem("wallet_disconnected");
    if (manuallyDisconnected === "true") return;

    try {
      const accounts = (await provider.send("eth_accounts", [])) as string[];
      if (accounts.length > 0) {
        set({
          address: accounts[0],
          provider,
          lastAction: "auto_connected",
        });
      }
    } catch (err) {
      console.error("Auto-connect failed:", err);
    }
  };

  if (typeof window !== "undefined") {
    autoConnect();
  }

  return {
    address: null,
    provider: null,
    isConnecting: false,
    error: null,
    lastAction: null,

    connect: async () => {
      if (typeof window === "undefined") return;

      set({ isConnecting: true, error: null, lastAction: null });

      if (!window.ethereum) {
        set({
          error: "MetaMask not installed. Please install MetaMask to continue.",
          isConnecting: false,
          lastAction: "metamask_not_installed",
        });
        return;
      }

      localStorage.removeItem("wallet_disconnected");

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        const accounts = (await provider.send(
          "eth_requestAccounts",
          []
        )) as string[];
        if (accounts.length === 0) {
          set({
            error: "No accounts found",
            isConnecting: false,
            lastAction: "no_accounts",
          });
          return;
        }

        await switchToSepolia(provider);

        set({
          address: accounts[0],
          provider,
          isConnecting: false,
          lastAction: "connected",
        });

        window.ethereum.on("accountsChanged", (...args: unknown[]) => {
          const accounts = args[0] as string[];
          if (accounts.length === 0) {
            set({ address: null, provider: null, lastAction: "disconnected" });
          } else {
            set({ address: accounts[0], lastAction: "account_changed" });
          }
        });

        window.ethereum.on("chainChanged", () => {
          set({ lastAction: "chain_changed" });
          setTimeout(() => window.location.reload(), 1000);
        });
      } catch (error) {
        const err = error as { code?: number; message?: string };
        if (err.code === 4001) {
          set({
            error: "User rejected connection",
            isConnecting: false,
            lastAction: "connection_rejected",
          });
        } else {
          set({
            error: err.message || "Failed to connect wallet",
            isConnecting: false,
            lastAction: "connection_failed",
          });
        }
      }
    },

    disconnect: () => {
      set({
        address: null,
        provider: null,
        error: null,
        lastAction: "manual_disconnect",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("wallet_disconnected", "true");
      }
    },

    clearError: () => {
      set({ error: null });
    },
  };
});
