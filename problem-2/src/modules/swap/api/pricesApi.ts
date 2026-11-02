export interface Token {
  symbol: string;
  name: string;
  price: number;
}

interface PriceRecord {
  currency?: unknown;
  symbol?: unknown;
  date?: unknown;
  price?: unknown;
}

const PRICE_URL = 'https://interview.switcheo.com/prices.json';

export const fallbackTokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', price: 3248.72 },
  { symbol: 'USDC', name: 'USD Coin', price: 1 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', price: 67420.18 },
  { symbol: 'ATOM', name: 'Cosmos', price: 8.42 },
  { symbol: 'OSMO', name: 'Osmosis', price: 0.73 },
  { symbol: 'SWTH', name: 'Switcheo', price: 0.0042 },
  { symbol: 'DAI', name: 'Dai', price: 1 },
  { symbol: 'BLUR', name: 'Blur', price: 0.31 },
  { symbol: 'GMX', name: 'GMX', price: 37.6 },
  { symbol: 'LUNA', name: 'Terra', price: 0.62 },
];

const tokenNames = new Map<string, string>(
  fallbackTokens.map((token) => [token.symbol.toUpperCase(), token.name] as const),
);

function latestPricesByCurrency(rows: unknown[]): Map<string, { symbol: string; price: number; timestamp: number }> {
  const latest = new Map<string, { symbol: string; price: number; timestamp: number }>();

  for (const entry of rows) {
    if (!entry || typeof entry !== 'object') continue;
    const row = entry as PriceRecord;
    const symbol = String(row.currency || row.symbol || '').trim();
    const value = Number(row.price);
    const timestamp = typeof row.date === 'string' ? Date.parse(row.date) || 0 : 0;
    const key = symbol.toUpperCase();
    const previous = latest.get(key);

    if (!symbol || !Number.isFinite(value) || value <= 0) continue;
    if (!previous || timestamp >= previous.timestamp) {
      latest.set(key, { symbol, price: value, timestamp });
    }
  }

  return latest;
}

export async function fetchTokenPrices(options: { signal?: AbortSignal } = {}): Promise<Token[]> {
  const response = await fetch(PRICE_URL, { signal: options.signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Price API returned ${response.status}`);

  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error('Unexpected price API response');

  const latest = latestPricesByCurrency(rows);
  if (latest.size === 0) throw new Error('Price API returned no usable prices');

  const merged = new Map<string, Token>(
    fallbackTokens.map((token) => [token.symbol.toUpperCase(), token] as const),
  );
  for (const [key, item] of latest) {
    const fallback = merged.get(key);
    merged.set(key, {
      symbol: fallback?.symbol || item.symbol,
      name: tokenNames.get(key) || item.symbol,
      price: item.price,
    });
  }

  return [...merged.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
}
