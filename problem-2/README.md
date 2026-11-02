# Problem 2 — Orbit token swap

A responsive token swap form built with React, TypeScript, Sass, and Vite. API access, wallet state, and swap state are separated into modules. It loads prices from the interview endpoint when available and uses sample rates as a fallback so the demo remains interactive offline.

SCSS classes follow BEM naming: component blocks, `__elements`, and `--modifiers`.

## Structure

```text
src/
  app/                    # App composition and providers
  modules/
    swap/
      api/                 # Price endpoint and response normalization
      context/             # Swap state and actions
      hooks/               # Swap access and token search
      components/          # Swap form, token picker, confirmation
    wallet/
      context/             # Mock wallet state
      hooks/               # Wallet access
  main.tsx
  style.scss
```

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run typecheck` to check TypeScript and `npm run build` to create a production build.

Wallet connection and transaction confirmation are simulated for this frontend challenge; no real assets are transferred.
