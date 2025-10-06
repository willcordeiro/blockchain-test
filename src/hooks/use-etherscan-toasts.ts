"use client";

import { useEffect, useRef } from "react";
import { useEtherscanStore } from "@/stores/etherscan-store";
import { useToast } from "@/hooks/use-toast";

export function useEtherscanToasts() {
  const { lastAction, error } = useEtherscanStore();
  const { toast } = useToast();
  const lastActionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastAction || lastAction === lastActionRef.current) return;

    console.log(" Etherscan toast triggered for action:", lastAction);
    lastActionRef.current = lastAction;

    switch (lastAction) {
      case "fetch_failed":
        toast({
          variant: "destructive",
          title: "Failed to Load Data",
          description:
            error ||
            "Could not fetch transaction data. Please check your API key and try again.",
        });
        break;
    }
  }, [lastAction, error, toast]);
}
