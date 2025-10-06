"use client"

import { motion } from "framer-motion"
import { Wallet, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWalletStore } from "@/stores/wallet-store"
import { shortenAddress } from "@/lib/wallet-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWalletToasts } from "@/hooks/use-wallet-toasts"

export function WalletButton() {
  const { address, isConnecting, connect, disconnect } = useWalletStore()

  useWalletToasts()

  if (isConnecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (!address) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </motion.div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="outline">
            <Wallet className="mr-2 h-4 w-4" />
            {shortenAddress(address)}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={disconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
