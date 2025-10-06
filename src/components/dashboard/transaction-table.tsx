"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUpDown,
} from "lucide-react";
import { useEtherscanStore } from "@/stores/etherscan-store";
import { useWalletStore } from "@/stores/wallet-store";
import { useTransactionFilters } from "@/hooks/use-transaction-filters";
import {
  shortenAddress,
  formatUSDC,
  formatTimestamp,
  parseUSDCValue,
} from "@/lib/wallet-utils";

const ITEMS_PER_PAGE = 10;

export function TransactionTable() {
  const { transactions } = useEtherscanStore();
  const { address } = useWalletStore();
  const { filter, setFilter, filteredTransactions } = useTransactionFilters(
    transactions,
    address
  );
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const validTransactions = filteredTransactions.filter(
    (tx) =>
      tx &&
      tx.hash &&
      tx.from &&
      tx.to &&
      tx.timeStamp &&
      !isNaN(Number(tx.timeStamp))
  );
  const paginatedTransactions = validTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFilterChange = (type: "all" | "sent" | "received") => {
    setFilter({ ...filter, type });
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: "date" | "value") => {
    setFilter({ ...filter, sortBy });
  };

  if (!address) return null;

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              View and filter your USDC transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              value={filter.type}
              onValueChange={(value: "all" | "sent" | "received") =>
                handleFilterChange(value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filter.sortBy}
              onValueChange={(value: "date" | "value") =>
                handleSortChange(value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="value">Sort by Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {validTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted/50 mb-4">
              <ArrowUpDown className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-border/40 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">From/To</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="text-right font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="wait">
                    {paginatedTransactions.map((tx, index) => {
                      const fromAddress = tx.from || "";
                      const toAddress = tx.to || "";
                      const timeStamp = tx.timeStamp || "";
                      const hash = tx.hash || "";

                      const isSent =
                        fromAddress.toLowerCase() === address?.toLowerCase();
                      const amount = parseUSDCValue(
                        tx.value || "0",
                        tx.tokenDecimal || "6"
                      );

                      return (
                        <motion.tr
                          key={hash}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <Badge
                              variant={isSent ? "destructive" : "default"}
                              className="gap-1.5 font-medium"
                            >
                              {isSent ? (
                                <>
                                  <ArrowUpRight className="h-3 w-3" />
                                  Sent
                                </>
                              ) : (
                                <>
                                  <ArrowDownLeft className="h-3 w-3" />
                                  Received
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {shortenAddress(isSent ? toAddress : fromAddress)}
                          </TableCell>
                          <TableCell className="font-semibold tabular-nums">
                            {formatUSDC(amount)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {(() => {
                              const ts = Number(timeStamp);
                              if (isNaN(ts) || ts <= 0) return "-";
                              const formatted = formatTimestamp(ts);
                              return formatted === "Invalid date"
                                ? "-"
                                : formatted;
                            })()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <a
                                href={`https://sepolia.etherscan.io/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {Math.ceil(validTransactions.length / ITEMS_PER_PAGE) > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + ITEMS_PER_PAGE,
                    validTransactions.length
                  )}{" "}
                  of {validTransactions.length} transactions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(validTransactions.length / ITEMS_PER_PAGE)
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
