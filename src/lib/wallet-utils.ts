import type { ethers } from "ethers";

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatUSDC(value: string | number): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatTimestamp(timestamp: string | number): string {
  const ts = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
  if (isNaN(ts)) return "Invalid date";

  const date = new Date(ts * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function parseUSDCValue(value: string, decimals = "6"): string {
  const divisor = Math.pow(10, Number.parseInt(decimals));
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return "0.00";
  return (num / divisor).toFixed(2);
}

export async function switchToSepolia(provider: ethers.BrowserProvider) {
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: "0xaa36a7" },
    ]);
  } catch (error: any) {
    if (error.code === 4902) {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: "0xaa36a7",
          chainName: "Sepolia Testnet",
          nativeCurrency: {
            name: "Sepolia ETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.sepolia.org"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ]);
    } else {
      throw error;
    }
  }
}
