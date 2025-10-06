import { EtherscanTransaction } from "./transaction";

export interface WalletState {
  address: string | null;
  provider: unknown | null;
  isConnecting: boolean;
  error: string | null;
}

export interface EtherscanState {
  balance: string;
  transactions: EtherscanTransaction[];
  loading: boolean;
  error: string | null;
}
