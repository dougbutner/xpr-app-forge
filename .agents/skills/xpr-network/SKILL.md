---
name: xpr-network
description: >-
  Index of XPR Network / EOSIO reference markdown in skill/: wallets (WebAuth, web SDK),
  RPC, contracts, NFTs, oracles, CLI, DeFi. Use when building on XPR, unsure which skill/
  module applies, or when the task spans wallets, chain reads, and on-chain state.
---

# XPR Network (`skill/` index)

## Instructions

1. Open **[`skill/README.md`](../../../skill/README.md)** for the full module map.
2. Then open the matching topic file under **`skill/`** (do not invent chain APIs from memory).
3. For **on-chain contracts**, prefer the **`smart-contracts`** skill and **`skill/safety-guidelines.md`** (testnet first).
4. For **Alcor DEX/AMM**, prefer the **`alcor-exchange`** skill — not MetalX.

## Quick map

| Need | Start here |
|------|------------|
| Wallet / `@proton/web-sdk` | [`skill/web-sdk.md`](../../../skill/web-sdk.md), [`skill/webauth-identity.md`](../../../skill/webauth-identity.md) |
| RPC / table reads | [`skill/rpc-queries.md`](../../../skill/rpc-queries.md) |
| Contracts / deploy | **`smart-contracts`** skill → [`skill/smart-contracts.md`](../../../skill/smart-contracts.md) |
| NFTs / AtomicAssets | [`skill/nfts-atomicassets.md`](../../../skill/nfts-atomicassets.md) |
| Randomness / oracles | [`skill/oracles-randomness.md`](../../../skill/oracles-randomness.md) |
| Alcor swap / orderbook | **`alcor-exchange`** skill |
| Safety | [`skill/safety-guidelines.md`](../../../skill/safety-guidelines.md) |

App UI and wallet wiring live in **`src/`** and **`src/services/walletConstants.ts`** — keep those intact unless fixing a wallet bug.
