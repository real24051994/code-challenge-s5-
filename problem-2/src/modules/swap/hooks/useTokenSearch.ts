import { useMemo } from 'react';
import type { Token } from '../api/pricesApi';

export function useTokenSearch(tokens: Token[], query: string): Token[] {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return tokens;

    return tokens.filter((token) =>
      `${token.symbol} ${token.name}`.toLowerCase().includes(normalizedQuery),
    );
  }, [tokens, query]);
}
