"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";
import { StreamProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: StreamProvider;
  }
}

interface WalletContextType {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  async function connect() {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const accounts = await prov.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      setProvider(prov);
    } else {
      alert("MetaMask not found!");
    }
  }

  function disconnect() {
    setAddress(null);
    setProvider(null);
  }

  return (
    <WalletContext.Provider value={{ address, provider, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
