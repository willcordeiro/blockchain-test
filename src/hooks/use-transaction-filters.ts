"use client";

import { useState, useMemo } from "react";
import type {
  EtherscanTransaction,
  TransactionFilter,
} from "@/types/transaction";
import { parseUSDCValue } from "@/lib/wallet-utils";

export function useTransactionFilters(
  transactions: EtherscanTransaction[],
  userAddress: string | null
) {
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions || !userAddress) return [];

    let filtered = [...transactions];

    if (filter.type === "sent") {
      filtered = filtered.filter(
        (tx) => tx.from.toLowerCase() === userAddress.toLowerCase()
      );
    } else if (filter.type === "received") {
      filtered = filtered.filter(
        (tx) => tx.to.toLowerCase() === userAddress.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (filter.sortBy === "date") {
        const comparison =
          Number.parseInt(b.timeStamp) - Number.parseInt(a.timeStamp);
        return filter.sortOrder === "asc" ? -comparison : comparison;
      } else {
        const aValue = Number.parseFloat(
          parseUSDCValue(a.value, a.tokenDecimal)
        );
        const bValue = Number.parseFloat(
          parseUSDCValue(b.value, b.tokenDecimal)
        );
        const comparison = bValue - aValue;
        return filter.sortOrder === "asc" ? -comparison : comparison;
      }
    });

    return filtered;
  }, [transactions, userAddress, filter]);

  return {
    filter,
    setFilter,
    filteredTransactions,
  };
}
