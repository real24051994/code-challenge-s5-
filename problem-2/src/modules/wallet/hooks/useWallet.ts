import { useWalletContext } from '@/modules/wallet/context/WalletProvider';

export function useWallet() {
  return useWalletContext();
}
