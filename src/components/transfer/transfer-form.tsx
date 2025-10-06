/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWalletStore } from "@/stores/wallet-store";
import { useEtherscanStore } from "@/stores/etherscan-store";
import { CONTRACTS } from "@/constants/contracts";
import type { TransferStatus } from "@/types/transaction";
import { toast } from "@/hooks/use-toast";

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

export function TransferForm() {
  const { provider, address } = useWalletStore();
  const { refresh } = useEtherscanStore();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransferStatus>({ status: "idle" });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider || !address) {
      const errorMsg = "Wallet not connected";
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: errorMsg,
      });
      return;
    }

    if (!ethers.isAddress(recipient)) {
      const errorMsg = "Invalid recipient address";
      toast({
        variant: "destructive",
        title: "Invalid Address",
        description: errorMsg,
      });
      return;
    }

    const amountNum = Number.parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      const errorMsg = "Invalid amount";
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: errorMsg,
      });
      return;
    }

    setStatus({ status: "pending" });

    try {
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(
        CONTRACTS.USDC_SEPOLIA,
        USDC_ABI,
        signer
      );
      const amountInWei = ethers.parseUnits(amount, 6);
      const tx = await usdcContract.transfer(recipient, amountInWei);

      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted to the network.",
      });
      await tx.wait();

      toast({
        title: "Transfer Successful",
        description: `Successfully sent ${amount} USDC to ${recipient.slice(
          0,
          6
        )}...${recipient.slice(-4)}`,
      });

      if (address) refresh(address);
      setRecipient("");
      setAmount("");
      setStatus({ status: "idle" });
    } catch (error: any) {
      console.error("Transfer error:", error);
      let errorMsg = "Transaction failed";
      errorMsg = error?.reason || error?.message || errorMsg;
      errorMsg = errorMsg.replace(/^execution reverted: /, "");
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: errorMsg,
      });
      setStatus({ status: "idle" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Send USDC</CardTitle>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Send className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-medium">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={status.status === "pending"}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (USDC)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={status.status === "pending"}
                className="text-sm tabular-nums"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={
                !provider ||
                !address ||
                status.status === "pending" ||
                !recipient ||
                !amount
              }
            >
              {status.status === "pending" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send USDC
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
