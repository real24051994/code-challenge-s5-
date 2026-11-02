import { SwapProvider } from '../modules/swap/context/SwapProvider';
import { WalletProvider } from '../modules/wallet/context/WalletProvider';
import SwapPage from '../modules/swap/components/SwapPage';

export default function App() {
  return (
    <WalletProvider>
      <SwapProvider>
        <SwapPage />
      </SwapProvider>
    </WalletProvider>
  );
}
