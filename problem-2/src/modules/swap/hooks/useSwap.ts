import { useSwapContext } from '@/modules/swap/context/SwapProvider';

export function useSwap() {
  return useSwapContext();
}
