import { useMemo, type ComponentProps } from 'react';
import WalletRow from './components/WalletRow';
import type { PriceMap, WalletBalance } from './types/wallet';

type WalletPageProps = ComponentProps<'div'> & {
  balances: WalletBalance[];
  prices: PriceMap;
};

interface PrioritizedBalance {
  balance: WalletBalance;
  priority: number;
  originalIndex: number;
}

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

export default function WalletPage({ balances, prices, children, ...divProps }: WalletPageProps) {
  const sortedBalances = useMemo(() => {
    const eligible: PrioritizedBalance[] = [];

    balances.forEach((balance, originalIndex) => {
      const priority = BLOCKCHAIN_PRIORITY.get(balance.blockchain);
      if (priority === undefined || balance.amount <= 0) return;
      eligible.push({ balance, priority, originalIndex });
    });

    return eligible
      .sort((a, b) => b.priority - a.priority || a.originalIndex - b.originalIndex)
      .map(({ balance }) => balance);
  }, [balances]);

  return (
    <div {...divProps}>
      {sortedBalances.map((balance) => (
        <WalletRow
          key={`${balance.blockchain}:${balance.currency}`}
          balance={balance}
          formattedAmount={amountFormatter.format(balance.amount)}
          usdValue={(prices[balance.currency] ?? 0) * balance.amount}
        />
      ))}
      {children}
    </div>
  );
}
