"use client";

import { useEffect, useRef } from "react";
import { useWalletStore } from "@/stores/wallet-store";
import { useToast } from "@/hooks/use-toast";

export function useWalletToasts() {
  const { lastAction, error } = useWalletStore();
  const { toast } = useToast();
  const lastActionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastAction || lastAction === lastActionRef.current) return;

    console.log(" Toast triggered for action:", lastAction);
    lastActionRef.current = lastAction;

    switch (lastAction) {
      case "metamask_not_installed":
        toast({
          variant: "destructive",
          title: "MetaMask Required",
          description:
            "Please install MetaMask extension to connect your wallet.",
        });
        break;

      case "connection_rejected":
        toast({
          variant: "destructive",
          title: "Connection Rejected",
          description: "You rejected the connection request. Please try again.",
        });
        break;

      case "network_switch_failed":
        toast({
          variant: "destructive",
          title: "Network Switch Failed",
          description: "Please switch to Sepolia network manually in MetaMask.",
        });
        break;

      case "connected":
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
        break;

      case "disconnected":
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected.",
        });
        break;

      case "account_changed":
        toast({
          title: "Account Changed",
          description: "Your active account has been changed.",
        });
        break;

      case "chain_changed":
        toast({
          title: "Network Changed",
          description: "Network changed. Reloading page...",
        });
        break;

      case "manual_disconnect":
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully.",
        });
        break;

      case "connection_failed":
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: error || "Failed to connect wallet. Please try again.",
        });
        break;
    }
  }, [lastAction, error, toast]);
}
