import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { getUSDCBalance, getUSDCTransfers } from "@/lib/etherscanService.ts";

export function useEtherscan() {
  const { address } = useWallet();
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    (async () => {
      setLoading(true);
      try {
        const [bal, txs] = await Promise.all([
          getUSDCBalance(address),
          getUSDCTransfers(address),
        ]);
        setBalance(bal);
        setTransactions(txs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [address]);

  return { balance, transactions, loading };
}
