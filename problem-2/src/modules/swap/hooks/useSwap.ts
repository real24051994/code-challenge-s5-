import { useSwapContext } from '../context/SwapProvider';

export function useSwap() {
  return useSwapContext();
}
