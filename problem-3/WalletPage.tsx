import { useMemo } from 'react';

// These app-specific values are expected from the host application:
// BoxProps, WalletRow, classes, useWalletBalances, and usePrices.

interface WalletBalance {
  blockchain: string;
  currency: string;
  amount: number;
}

interface PrioritizedBalance {
  balance: WalletBalance;
  priority: number | undefined;
}

type Props = BoxProps;

const BLOCKCHAIN_PRIORITY = new Map<string, number>([
  ['Osmosis', 100],
  ['Ethereum', 50],
  ['Arbitrum', 30],
  ['Zilliqa', 20],
  ['Neo', 20],
]);

const amountFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 6,
});

const WalletPage = ({ children, ...rest }: Props) => {
  const balances: WalletBalance[] = useWalletBalances();
  const prices: Record<string, number> = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance): PrioritizedBalance => ({
        balance,
        priority: BLOCKCHAIN_PRIORITY.get(balance.blockchain),
      }))
      .filter(
        (entry): entry is { balance: WalletBalance; priority: number } =>
          entry.priority !== undefined && entry.balance.amount > 0,
      )
      .sort((a, b) => b.priority - a.priority)
      .map(({ balance }) => balance);
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance) => {
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount;

        return (
          <WalletRow
            className={classes.row}
            key={`${balance.blockchain}:${balance.currency}`}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={amountFormatter.format(balance.amount)}
          />
        );
      })}
      {children}
    </div>
  );
};

export default WalletPage;
