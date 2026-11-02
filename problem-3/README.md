# Problem 3

## Main issues

- `lhsPriority` is undefined; the variable declared in the filter is `balancePriority`.
- The filter condition is reversed: it keeps balances `<= 0` and excludes positive balances.
- `WalletBalance` omits `blockchain`, even though the code uses it. Using `any` in `getPriority` also weakens type checking.
- `getPriority` is called repeatedly during sorting. Compute each priority once, then sort by it.
- The comparator does not explicitly return `0` when priorities are equal.
- `useMemo` depends on `prices`, although prices are not used for sorting, causing unnecessary recalculation.
- `formattedBalances` is created but ignored; `rows` reads `formatted` from unformatted data. `toFixed()` without arguments also rounds to an integer.
- `key={index}` is unstable when the list changes order, and `children` is extracted but never rendered.

## Refactor

The refactored code is in [WalletPage.tsx](./WalletPage.tsx). It keeps positive balances on supported blockchains, computes priorities once, uses the correct `useMemo` dependency, preserves decimal places, and assigns stable keys.
