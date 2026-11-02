import { useEffect, useRef, type MouseEvent } from 'react';
import { useSwap } from '@/modules/swap/hooks/useSwap';
import { useTokenSearch } from '@/modules/swap/hooks/useTokenSearch';
import TokenIcon from '@/modules/swap/components/TokenIcon';

const money = (value: number): string => `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)}`;

export default function TokenPickerModal() {
  const {
    tokens, pickerSide, searchQuery, setSearchQuery, closePicker,
    chooseToken, fromSymbol, toSymbol,
  } = useSwap();
  const searchRef = useRef<HTMLInputElement>(null);
  const results = useTokenSearch(tokens, searchQuery);

  useEffect(() => {
    searchRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePicker();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePicker]);

  if (!pickerSide) return null;

  const closeOnBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closePicker();
  };

  return (
    <div className="modal-backdrop" onMouseDown={closeOnBackdrop}>
      <section className="token-picker" role="dialog" aria-modal="true" aria-labelledby="picker-title">
        <div className="token-picker__header">
          <div><span className="token-picker__eyebrow">SELECT ASSET</span><h2 id="picker-title">Choose token</h2></div>
          <button className="token-picker__close" onClick={closePicker} aria-label="Close">×</button>
        </div>
        <label className="token-picker__search">
          <span aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            placeholder="Search name or ticker"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
        <div className="token-picker__list">
          {results.length ? results.map((token) => {
            const isSelected = token.symbol === (pickerSide === 'from' ? fromSymbol : toSymbol);
            return (
              <button className={`token-picker__option${isSelected ? ' token-picker__option--selected' : ''}`} key={token.symbol} onClick={() => chooseToken(token.symbol)}>
                <span className="token-picker__asset">
                  <TokenIcon symbol={token.symbol} />
                  <span className="token-picker__asset-info"><b>{token.symbol}</b><small>{token.name}</small></span>
                </span>
                <span className="token-picker__price">{money(token.price)}</span>
              </button>
            );
          }) : <p className="token-picker__empty">No tokens found.</p>}
        </div>
      </section>
    </div>
  );
}
