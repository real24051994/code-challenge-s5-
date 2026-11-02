export interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

export type PriceMap = Readonly<Record<string, number | undefined>>;

export interface WalletRowProps {
  balance: WalletBalance;
  formattedAmount: string;
  usdValue: number;
}
