"use client";

import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEtherscanStore } from "@/stores/etherscan-store";
import { useChartData } from "@/hooks/use-chart-data";
import { useTheme } from "next-themes";
import { TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function TransactionChart() {
  const { transactions } = useEtherscanStore();
  const chartData = useChartData(transactions);
  const { theme } = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor:
          theme === "dark" ? "oklch(0.12 0.01 240)" : "oklch(1 0 0)",
        titleColor:
          theme === "dark" ? "oklch(0.98 0.005 240)" : "oklch(0.15 0 0)",
        bodyColor:
          theme === "dark" ? "oklch(0.98 0.005 240)" : "oklch(0.15 0 0)",
        borderColor:
          theme === "dark" ? "oklch(0.25 0.015 240)" : "oklch(0.90 0.005 240)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color:
            theme === "dark"
              ? "oklch(0.20 0.015 240 / 0.3)"
              : "oklch(0.92 0.005 240 / 0.5)",
          drawBorder: false,
        },
        ticks: {
          color:
            theme === "dark" ? "oklch(0.60 0.01 240)" : "oklch(0.50 0.01 240)",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color:
            theme === "dark"
              ? "oklch(0.20 0.015 240 / 0.3)"
              : "oklch(0.92 0.005 240 / 0.5)",
          drawBorder: false,
        },
        ticks: {
          color:
            theme === "dark" ? "oklch(0.60 0.01 240)" : "oklch(0.50 0.01 240)",
          font: {
            size: 11,
          },
          callback: (value: number | string) => `$${value}`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Transaction Volume</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            {chartData.labels.length > 0 ? (
              <Line data={chartData} options={options} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted/50 mb-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  No transaction data available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
