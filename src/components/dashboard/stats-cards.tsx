"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpDown, Clock, Wallet } from "lucide-react";
import { useEtherscanStore } from "@/stores/etherscan-store";
import { useWalletStore } from "@/stores/wallet-store";
import {
  formatUSDC,
  formatTimestamp,
  parseUSDCValue,
} from "@/lib/wallet-utils";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards() {
  const { balance, transactions, loading } = useEtherscanStore();
  const { address } = useWalletStore();

  const lastTransaction = transactions[0];

  if (!address) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 mb-6">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Connect your wallet to view your USDC balance and transaction history
        </p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-36 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-3"
    >
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {formatUSDC(balance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              USDC on Sepolia
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ArrowUpDown className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {Array.isArray(transactions) && transactions.length > 0
                ? transactions.length
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Transaction
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {lastTransaction &&
            lastTransaction.value &&
            lastTransaction.tokenDecimal &&
            lastTransaction.timeStamp &&
            !isNaN(Number(lastTransaction.timeStamp)) &&
            Number(lastTransaction.timeStamp) > 0 ? (
              <>
                <div className="text-3xl font-bold tracking-tight">
                  {formatUSDC(
                    parseUSDCValue(
                      lastTransaction.value,
                      lastTransaction.tokenDecimal
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    const ts = Number(lastTransaction.timeStamp);
                    if (isNaN(ts) || ts <= 0) return "-";
                    const formatted = formatTimestamp(ts);
                    return formatted === "Invalid date" ? "-" : formatted;
                  })()}
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold tracking-tight text-muted-foreground">
                  —
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No last transaction found
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
