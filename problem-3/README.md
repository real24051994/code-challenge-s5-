# Problem 3 — Wallet page code review

## Issues in the original snippet

- `lhsPriority` is undefined; the declared variable is `balancePriority`.
- The filter condition is reversed: it keeps zero/negative balances and drops positive ones.
- `WalletBalance` omits `blockchain`; `getPriority` also uses `any`.
- As shown, `React`, `BoxProps`, `WalletRow`, `classes`, `useWalletBalances`, and `usePrices` are not imported or declared.
- `getPriority` is recreated each render and called repeatedly while sorting. The comparator also lacks an explicit equal-priority result.
- `prices` is an unnecessary `useMemo` dependency. `formattedBalances` is unused while `rows` reads `formatted` from unformatted data; `toFixed()` without arguments also rounds to an integer.
- The index key is unstable, and `children` is destructured but never rendered.

## Refactor

The standalone component is in [src/WalletPage.tsx](./src/WalletPage.tsx). It accepts balances and prices as props, uses native `div` props, filters positive balances on supported chains, computes each priority once, and renders children. Types and the row component live in separate files under `src/`.

Run `npm install` followed by `npm run typecheck` to check the standalone component.
