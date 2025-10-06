"use client";

import { motion } from "framer-motion";
import { WalletButton } from "@/components/wallet/wallet-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wallet } from "lucide-react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="p-8 flex h-20 items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">USDC Dashboard</h1>
            <p className="text-xs text-muted-foreground">Sepolia Testnet</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </motion.header>
  );
}
