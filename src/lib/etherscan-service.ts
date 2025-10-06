import axios from "axios";
import type { EtherscanTransaction } from "@/types/transaction";
import { CONTRACTS, ETHERSCAN_API } from "@/constants/contracts";
import { ethers } from "ethers";

const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

export async function getUSDCBalance(address: string): Promise<string> {
  const checksumAddress = ethers.getAddress(address);

  const url = `${ETHERSCAN_API.SEPOLIA}?module=account&action=tokenbalance&contractaddress=${CONTRACTS.USDC_SEPOLIA}&address=${checksumAddress}&tag=latest&apikey=${API_KEY}`;

  const { data } = await axios.get(url);

  if (data.status === "0") {
    throw new Error(data.message || "Failed to fetch balance");
  }

  return (Number(data.result) / 1e6).toFixed(2);
}

export async function getUSDCTransfers(
  address: string
): Promise<EtherscanTransaction[]> {
  const checksumAddress = ethers.getAddress(address);

  const url = `${ETHERSCAN_API.SEPOLIA}?module=account&action=tokentx&contractaddress=${CONTRACTS.USDC_SEPOLIA}&address=${checksumAddress}&page=1&offset=100&sort=desc&apikey=${API_KEY}`;

  const { data } = await axios.get(url);

  if (data.status === "0" && data.message !== "No transactions found") {
    throw new Error(data.message || "Failed to fetch transactions");
  }

  return data.result || [];
}
