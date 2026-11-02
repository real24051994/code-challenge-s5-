import { useWallet } from '../../wallet/hooks/useWallet';
import SwapCard from './SwapCard';
import TokenPickerModal from './TokenPickerModal';
import SwapConfirmationModal from './SwapConfirmationModal';

export default function SwapPage() {
  const { isConnected, address, toggleConnection } = useWallet();

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="site-brand" href="#swap" aria-label="Orbit home">
          <span className="site-brand__mark" aria-hidden="true">◈</span>
          <span>orbit</span>
        </a>
        <button className={`wallet-button${isConnected ? ' wallet-button--connected' : ''}`} onClick={toggleConnection}>
          <span className={`wallet-status${isConnected ? ' wallet-status--online' : ''}`} />
          {isConnected ? address : 'Connect wallet'}
        </button>
      </header>

      <main className="swap-page" id="swap">
        <div className="swap-page__heading">
          <span className="swap-page__eyebrow">ORBIT / EXCHANGE</span>
          <h1>Swap</h1>
          <p>Exchange one token for another.</p>
        </div>
        <SwapCard />
      </main>

      <TokenPickerModal />
      <SwapConfirmationModal />
    </div>
  );
}
