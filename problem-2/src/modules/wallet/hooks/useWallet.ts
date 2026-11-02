import { useWalletContext } from '../context/WalletProvider';

export function useWallet() {
  return useWalletContext();
}
