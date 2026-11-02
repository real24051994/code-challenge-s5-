import type { WalletRowProps } from '../types/wallet';

const usdFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

export default function WalletRow({ balance, formattedAmount, usdValue }: WalletRowProps) {
  return (
    <div className="wallet-row">
      <div className="wallet-row__asset">
        <strong>{balance.currency}</strong>
        <small>{balance.blockchain}</small>
      </div>
      <span>{formattedAmount}</span>
      <span>{usdFormatter.format(usdValue)}</span>
    </div>
  );
}
