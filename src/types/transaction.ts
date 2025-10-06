export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  confirmations: string;
}

export interface TransactionFilter {
  type: "all" | "sent" | "received";
  sortBy: "date" | "value";
  sortOrder: "asc" | "desc";
}

export interface TransferStatus {
  status: "idle" | "pending" | "confirmed" | "failed";
  txHash?: string;
  error?: string;
}
