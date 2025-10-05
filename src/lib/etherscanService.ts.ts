import axios from "axios";

const API_URL = "https://api-sepolia.etherscan.io/api";
const USDC_CONTRACT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export async function getUSDCBalance(address: string) {
  const { data } = await axios.get(API_URL, {
    params: {
      module: "account",
      action: "tokenbalance",
      contractaddress: USDC_CONTRACT,
      address,
      tag: "latest",
      apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    },
  });
  return (Number(data.result) / 1e6).toFixed(2);
}

export async function getUSDCTransfers(address: string) {
  const { data } = await axios.get(API_URL, {
    params: {
      module: "account",
      action: "tokentx",
      contractaddress: USDC_CONTRACT,
      address,
      sort: "desc",
      apikey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    },
  });
  return data.result;
}
