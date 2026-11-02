import { useSwap } from '../hooks/useSwap';

const number = (value: number): string => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);

export default function SwapConfirmationModal() {
  const { isConfirmed, dismissConfirmation, amount, fromSymbol, toSymbol, receiveAmount } = useSwap();
  if (!isConfirmed) return null;

  return (
    <div className="modal-backdrop modal-backdrop--success">
      <section className="swap-result" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className="swap-result__icon"><span>✓</span></div>
        <span className="swap-result__eyebrow">DEMO</span>
        <h2 id="success-title">Swap complete</h2>
        <p>You swapped <b>{number(Number(amount))} {fromSymbol}</b> for <b>{number(receiveAmount)} {toSymbol}</b>.</p>
        <p className="swap-result__note">This is a simulated swap. No assets were transferred.</p>
        <button className="swap-result__done" onClick={dismissConfirmation}>Done</button>
      </section>
    </div>
  );
}
