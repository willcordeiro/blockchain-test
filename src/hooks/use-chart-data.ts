import { parseUSDCValue } from "@/lib/wallet-utils";
import { EtherscanTransaction } from "@/types/transaction";
import { useMemo } from "react";

export function useChartData(transactions: EtherscanTransaction[] | undefined) {
  const chartData = useMemo(() => {
    const txArray = Array.isArray(transactions) ? transactions : [];

    const groupedByDay = txArray.reduce((acc, tx) => {
      const ts = parseInt(tx.timeStamp);
      if (isNaN(ts)) return acc;

      const date = new Date(ts * 1000);
      const dateKey = date.toISOString().split("T")[0];

      if (!acc[dateKey]) acc[dateKey] = 0;
      acc[dateKey] += Number.parseFloat(
        parseUSDCValue(tx.value, tx.tokenDecimal)
      );
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(groupedByDay).sort().slice(-30);
    const values = sortedDates.map((date) => groupedByDay[date]);

    return {
      labels: sortedDates.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Transaction Volume (USDC)",
          data: values,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [transactions]);

  return chartData;
}
