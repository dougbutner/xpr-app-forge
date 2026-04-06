# Flextokens on XPR Network

Use this module when building dApps that interact with **Flex tokens**—reflection-style assets on XPR where transfer tax funds **proportional rewards** to holders (and sometimes burns). Holders often **choose which token they receive** as a daily reward (BTC, SOL, other Flex tokens, etc.).

> **Full reference in-repo:** see [`flex-tokens.md`](../flex-tokens.md) in the project root (links, explorer actions, community notes).  
> **Intro course (Notion):** [Flex Tokens Liftoff: EASY, GRAMS, WON & MEME](https://aquariusacademy.notion.site/Flex-Tokens-Liftoff-EASY-GRAMS-WON-MEME-206ac693574b80e5aca2ddd57156b265)  
> **Ecosystem index:** [flex.report](https://flex.report)

---

## Tokens you will see most often

| Token | Notes (high level) |
|-------|-------------------|
| **EASY** | “Take it EASY” — e.g. ~2% reflection (see live docs for current params) |
| **WON** | Reflection + team allocation; reward choice via `w3won` patterns |
| **MEME** | Reflection + burn split |
| **GRAMS** | Same family; confirm tokenomics on Notion / explorer |

Symbols on DEXs often look like **EASY-mon3y**, **WON-w3won**, **MEME-m3m3** (pair naming on Alcor-style UIs).

---

## Contracts & actions (integration surface)

Always **verify** `account`, `action`, and ABI on [XPR Network Explorer](https://explorer.xprnetwork.org/) before mainnet calls.

| Area | Contract hints | Typical actions |
|------|----------------|-----------------|
| EASY / MEME flows | `mon3y`, `m3m3` | `setflextoken`, `distribute`, `noflexzone` (one-way opt-out of fees/rewards) |
| WON | `w3won` | `sprouttoken`, `radiate`, `optoutoftax` |

**Patterns for UIs:** read pending reward context via explorer or tables; let users **change reward token** through `setflextoken` / `sprouttoken` with the correct symbol format; never assume opt-out is reversible.

---

## DeFi touchpoints

- Swaps: Alcor / proton.alcor-style swap URLs (input often `XUSDC-xtokens` or similar).
- Optional **farm** rewards may exist per token—check current farm UIs and docs.

---

## Building with this template

- Wallet: **WebAuth** + **Anchor**, multi-account — use the active signer for `transact` when pushing Flex-related actions.
- Prefer **small test transactions** on testnet or with minimal amounts when exploring new action parameters.

---

## Disclaimer

Flex token mechanics and parameters can change. **Not financial or legal advice.** Confirm every action name, authority, and memo requirement on-chain before shipping production UIs.
