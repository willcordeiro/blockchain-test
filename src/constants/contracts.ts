export const CONTRACTS = {
  USDC_MAINNET: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDC_SEPOLIA: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
} as const;

export const NETWORKS = {
  MAINNET: {
    chainId: "0x1",
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
  },
  SEPOLIA: {
    chainId: "0xaa36a7",
    name: "Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia.org",
  },
} as const;

export const ETHERSCAN_API = {
  MAINNET: "https://api.etherscan.io/api",
  SEPOLIA: "https://api-sepolia.etherscan.io/api",
} as const;
