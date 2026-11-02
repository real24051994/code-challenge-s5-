import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';
import { fallbackTokens, fetchTokenPrices, type Token } from '@/modules/swap/api/pricesApi';

export type PriceStatus = 'loading' | 'live' | 'fallback';
export type PickerSide = 'from' | 'to' | null;

interface SwapContextValue {
  tokens: Token[];
  priceStatus: PriceStatus;
  fromToken: Token;
  toToken: Token;
  fromSymbol: string;
  toSymbol: string;
  amount: string;
  numericAmount: number;
  fromBalance: number;
  rate: number;
  receiveAmount: number;
  hasValidAmount: boolean;
  overBalance: boolean;
  canSubmit: boolean;
  slippage: string;
  pickerSide: PickerSide;
  searchQuery: string;
  notice: string;
  isSubmitting: boolean;
  isConfirmed: boolean;
  setAmount: Dispatch<SetStateAction<string>>;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string>>;
  openPicker: (side: Exclude<PickerSide, null>) => void;
  closePicker: () => void;
  chooseToken: (symbol: string) => void;
  switchTokens: () => void;
  setMaxAmount: () => void;
  cycleSlippage: () => void;
  submitSwap: () => Promise<void>;
  dismissConfirmation: () => void;
}

const SwapContext = createContext<SwapContextValue | undefined>(undefined);
const SWAP_FEE = 0.003;
const DEMO_BALANCES: Record<string, number> = { ETH: 2.48, USDC: 4280, WBTC: 0.08, ATOM: 1240.58 };
const balanceFor = (symbol: string): number => DEMO_BALANCES[symbol.toUpperCase()] ?? 1240.58;

export function SwapProvider({ children }: PropsWithChildren) {
  const [tokens, setTokens] = useState<Token[]>(fallbackTokens);
  const [priceStatus, setPriceStatus] = useState<PriceStatus>('loading');
  const [fromSymbol, setFromSymbol] = useState('ETH');
  const [toSymbol, setToSymbol] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5%');
  const [pickerSide, setPickerSide] = useState<PickerSide>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    fetchTokenPrices({ signal: controller.signal })
      .then((nextTokens) => {
        setTokens(nextTokens);
        setPriceStatus('live');
      })
      .catch(() => setPriceStatus('fallback'))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  const findToken = useCallback((symbol: string): Token => {
    return tokens.find((item) => item.symbol.toUpperCase() === symbol.toUpperCase()) ?? fallbackTokens[0];
  }, [tokens]);

  const fromToken = findToken(fromSymbol);
  const toToken = findToken(toSymbol);
  const numericAmount = Number(amount) || 0;
  const fromBalance = balanceFor(fromSymbol);
  const overBalance = numericAmount > fromBalance;
  const rate = toToken.price > 0 ? fromToken.price / toToken.price : 0;
  const grossReceiveAmount = numericAmount * rate * (1 - SWAP_FEE);
  const receiveAmount = Number.isFinite(grossReceiveAmount) ? grossReceiveAmount : 0;
  const hasValidAmount = numericAmount > 0 && Number.isFinite(numericAmount);
  const canSubmit = hasValidAmount && !overBalance && fromSymbol !== toSymbol && !isSubmitting;

  const openPicker = useCallback((side: Exclude<PickerSide, null>) => {
    setPickerSide(side);
    setSearchQuery('');
  }, []);

  const closePicker = useCallback(() => {
    setPickerSide(null);
    setSearchQuery('');
  }, []);

  const chooseToken = useCallback((symbol: string) => {
    if (pickerSide === 'from') setFromSymbol(symbol);
    if (pickerSide === 'to') setToSymbol(symbol);
    setPickerSide(null);
    setSearchQuery('');
    setNotice('');
  }, [pickerSide]);

  const switchTokens = useCallback(() => {
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setNotice('');
  }, [fromSymbol, toSymbol]);

  const setMaxAmount = useCallback(() => {
    setAmount(String(fromBalance));
    setNotice('');
  }, [fromBalance]);

  const cycleSlippage = useCallback(() => {
    const next = slippage === '0.5%' ? '1.0%' : slippage === '1.0%' ? '0.1%' : '0.5%';
    setSlippage(next);
    setNotice(`Slippage tolerance set to ${next}.`);
  }, [slippage]);

  const submitSwap = useCallback(async () => {
    if (!canSubmit) return;
    setNotice('');
    setIsSubmitting(true);
    await new Promise<void>((resolve) => window.setTimeout(() => resolve(), 1100));
    setIsSubmitting(false);
    setIsConfirmed(true);
  }, [canSubmit]);

  const dismissConfirmation = useCallback(() => {
    setIsConfirmed(false);
    setAmount('');
  }, []);

  const value = useMemo<SwapContextValue>(() => ({
    tokens,
    priceStatus,
    fromToken,
    toToken,
    fromSymbol,
    toSymbol,
    amount,
    numericAmount,
    fromBalance,
    rate,
    receiveAmount,
    hasValidAmount,
    overBalance,
    canSubmit,
    slippage,
    pickerSide,
    searchQuery,
    notice,
    isSubmitting,
    isConfirmed,
    setAmount,
    setSearchQuery,
    setNotice,
    openPicker,
    closePicker,
    chooseToken,
    switchTokens,
    setMaxAmount,
    cycleSlippage,
    submitSwap,
    dismissConfirmation,
  }), [
    tokens, priceStatus, fromToken, toToken, fromSymbol, toSymbol, amount,
    numericAmount, fromBalance, rate, receiveAmount, hasValidAmount,
    overBalance, canSubmit, slippage, pickerSide, searchQuery, notice,
    isSubmitting, isConfirmed, openPicker, closePicker, chooseToken,
    switchTokens, setMaxAmount, cycleSlippage, submitSwap, dismissConfirmation,
  ]);

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}

export function useSwapContext(): SwapContextValue {
  const context = useContext(SwapContext);
  if (!context) throw new Error('useSwapContext must be used inside SwapProvider');
  return context;
}
