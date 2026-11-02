import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

interface WalletContextValue {
  isConnected: boolean;
  address: string | null;
  toggleConnection: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: PropsWithChildren) {
  const [isConnected, setIsConnected] = useState(false);

  const toggleConnection = useCallback(() => {
    setIsConnected((connected) => !connected);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({ isConnected, toggleConnection, address: isConnected ? '0x71…9A2c' : null }),
    [isConnected, toggleConnection],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWalletContext must be used inside WalletProvider');
  return context;
}
