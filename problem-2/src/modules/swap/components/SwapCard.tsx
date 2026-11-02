import type { ChangeEvent } from 'react';
import { useSwap } from '@/modules/swap/hooks/useSwap';
import { useWallet } from '@/modules/wallet/hooks/useWallet';
import TokenIcon from '@/modules/swap/components/TokenIcon';

const number = (value: number, max = 6): string => {
  if (!Number.isFinite(value)) return '—';
  const options: Intl.NumberFormatOptions = Math.abs(value) >= 1e9
    ? { notation: 'compact', maximumSignificantDigits: 7 }
    : { maximumFractionDigits: max };
  return new Intl.NumberFormat('en-US', options).format(value);
};
const money = (value: number): string => `$${number(value, 2)}`;

export default function SwapCard() {
  const {
    fromToken, toToken, fromSymbol, toSymbol, amount, setAmount, fromBalance,
    numericAmount, rate, receiveAmount, hasValidAmount, overBalance, canSubmit,
    notice, isSubmitting, openPicker, switchTokens, setMaxAmount,
    submitSwap, priceStatus, setNotice,
  } = useSwap();
  const { isConnected } = useWallet();

  const onAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const cleaned = event.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
    setAmount(cleaned);
    setNotice('');
  };

  return (
    <section className="swap-card" aria-label="Token swap form">
      <div className="swap-card__header">
        <h2>Swap tokens</h2>
      </div>

      <div className={`swap-card__field${overBalance ? ' swap-card__field--invalid' : ''}`}>
        <div className="swap-card__field-label">
          <span>Pay</span>
          <span>Balance: {number(fromBalance, 4)} {fromSymbol} <button className="swap-card__max" onClick={setMaxAmount}>Max</button></span>
        </div>
        <div className="swap-card__field-main">
          <input inputMode="decimal" autoComplete="off" maxLength={32} placeholder="0.00" value={amount} onChange={onAmountChange} aria-label="Amount to swap" />
          <button className="swap-card__token-select" onClick={() => openPicker('from')}>
            <TokenIcon symbol={fromSymbol} /><span>{fromSymbol}</span><span className="swap-card__token-chevron">⌄</span>
          </button>
        </div>
        <div className="swap-card__field-foot">{hasValidAmount ? money(numericAmount * fromToken.price) : '≈ $0.00'}</div>
      </div>

      <button className="swap-card__switch" onClick={switchTokens} aria-label="Switch currencies"><span>↕</span></button>

      <div className="swap-card__field swap-card__field--receive">
        <div className="swap-card__field-label"><span>Receive</span><span className="swap-card__estimate">ESTIMATED</span></div>
        <div className="swap-card__field-main">
          <div className="swap-card__output">{receiveAmount ? number(receiveAmount) : '0.00'}</div>
          <button className="swap-card__token-select" onClick={() => openPicker('to')}>
            <TokenIcon symbol={toSymbol} /><span>{toSymbol}</span><span className="swap-card__token-chevron">⌄</span>
          </button>
        </div>
        <div className="swap-card__field-foot">
          <span>{receiveAmount ? `≈ ${money(receiveAmount * toToken.price)}` : '≈ $0.00'}</span>
        </div>
      </div>

      <div className="swap-card__quote">
        <div className="swap-card__quote-row"><span>Rate</span><span>1 {fromSymbol} ≈ {number(rate)} {toSymbol}</span></div>
      </div>

      {overBalance && <p className="swap-card__error" role="alert">Amount exceeds your available balance.</p>}
      {fromSymbol === toSymbol && <p className="swap-card__error" role="alert">Choose two different tokens to swap.</p>}
      {notice && <p className="swap-card__notice" role="status">{notice}</p>}
      {priceStatus === 'fallback' && <p className="swap-card__notice" role="status">Using sample prices; live prices are unavailable.</p>}

      <button className="swap-card__submit" onClick={submitSwap} disabled={!isConnected || isSubmitting || !canSubmit}>
        <span>{isSubmitting ? 'Preparing swap…' : !isConnected ? 'Connect wallet first' : overBalance ? 'Insufficient balance' : fromSymbol === toSymbol ? 'Choose different tokens' : hasValidAmount ? 'Review swap' : 'Enter an amount'}</span>
        <span className="swap-card__submit-arrow" aria-hidden="true">↗</span>
      </button>
      <p className="swap-card__footnote">Swap preview is an estimate. No assets are transferred in this demo.</p>
    </section>
  );
}
