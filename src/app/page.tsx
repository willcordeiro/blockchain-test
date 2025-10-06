"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { TransactionChart } from "@/components/dashboard/transaction-chart";
import { TransferForm } from "@/components/transfer/transfer-form";
import { useWalletStore } from "@/stores/wallet-store";
import { useEtherscanToasts } from "@/hooks/use-etherscan-toasts";

export default function HomePage() {
  const { address } = useWalletStore();

  useEtherscanToasts();

  return (
    <div className="p-8 py-10 space-y-10">
      <StatsCards />

      {address && (
        <>
          <div className="grid gap-8 lg:grid-cols-2">
            <TransactionChart />
            <TransferForm />
          </div>

          <TransactionTable />
        </>
      )}
    </div>
  );
}
