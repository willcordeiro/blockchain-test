"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useWallet } from "./WalletContext";
import { getUSDCBalance, getUSDCTransfers } from "@/lib/etherscanService.ts";
import { EtherscanTransaction } from "@/types/transaction";

interface EtherscanContextProps {
  balance: string;
  transactions: EtherscanTransaction[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const EtherscanContext = createContext<EtherscanContextProps | undefined>(
  undefined
);

export const EtherscanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { address } = useWallet();
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const [bal, txs] = await Promise.all([
        getUSDCBalance(address),
        getUSDCTransfers(address),
      ]);
      setBalance(bal);
      setTransactions(txs);
    } catch (error) {
      console.error("Etherscan error:", error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) fetchData();
  }, [address, fetchData]);

  return (
    <EtherscanContext.Provider
      value={{ balance, transactions, loading, refresh: fetchData }}
    >
      {children}
    </EtherscanContext.Provider>
  );
};

export const useEtherscan = () => {
  const context = useContext(EtherscanContext);
  if (!context)
    throw new Error("useEtherscan must be used inside EtherscanProvider");
  return context;
};
