# Alcor Exchange — developer & integration reference

Condensed from **[Alcor documentation](https://docs.alcor.exchange/)** (GitBook). For verbatim, up-to-date text use the site or the **[full LLM export](https://docs.alcor.exchange/llms-full.txt)** / **[sitemap](https://docs.alcor.exchange/sitemap.md)**. Docs are **work in progress** and **not financial advice**.

---

## 1. What Alcor is

- Multi-chain **EOSIO / Antelope** DEX marketed heavily around **WAX**; also **EOS, Telos, BOS, Proton (XPR)**.
- **No project whitelisting** to open new markets—self-listing.
- Product surface (from docs):
  - **Liquidity pools** (AMM, **concentrated liquidity**)
  - **Orderbook DEX**
  - **Yield farming** (Alcor Farms)
  - **Limit / market** trading (Markets tab)
  - **OTC** trading
  - **NFT** trading (docs sections may be under construction)
  - **Token creation**, **market pair creation**
  - **Token / NFT wallet** view in UI

---

## 2. UI map (desktop)

| Area | Role |
|------|------|
| **Swap** | AMM swaps (= **market-style** execution via pools); charts; add/remove **Pool** liquidity |
| **Markets** | All pairs; **open new market**; click pair → **Market Exchange** (order book + TradingView chart) |
| **OTC** | User-listed offers at chosen prices (section may be under construction) |
| **NFT** | NFT marketplace (under construction in docs) |
| **Wallet** | Balances; tokens in open orders **do not** show until filled/cancelled |
| **Mainnet** | Switch chain (WAX / EOS / Telos / Proton, etc.) |

**Swap vs Markets:** limit/market **order book** trades live under **Markets**, not Swap.

---

## 3. Orderbook DEX — on-chain contracts

Order books are **on-chain**; trade/cancel via wallet, **cleos**, or explorers (e.g. bloks.io).

### DEX contract accounts (by chain)

| Chain | Contract account |
|-------|------------------|
| EOS | `eostokensdex` |
| Telos | `eostokensdex` |
| WAX | `alcordexmain` |
| BOS | `alcordexmain` |
| Proton (XPR) | `alcor` |

### Core tables (examples linked for EOS in docs)

- `markets`
- `sellorder`
- `buyorder`

Use **scope = market id** where applicable when querying `buyorder` / `sellorder` (see Node API example in docs).

### Market row (conceptual)

- `id`, `base_token` / `quote_token` (`extended_symbol`), `min_buy` / `min_sell`, `frozen`, `fee`, secondary indexes for pair lookup (`bytokens` / 256-bit key helpers—see docs for C++ struct and [JS make256key helper](https://github.com/avral/alcor-ui/blob/7bd8483435c26bc3cdd1017d8f6efe1f5b0fe6e2/utils/index.js#L28)).

### Actions & memos (orderbook)

**New market** — transfer to **chain’s DEX account** with memo (example pattern from docs):

```text
new_market|0.00000000 WEED@weedcashnt
```

(Confirm **to** account = that chain’s dex contract from table above.)

**Submit order** — transfer **bid** token to DEX with memo = **ask** as extended asset string, e.g.:

```text
1000.0000 TKT@eossanguotkt
```

**Cancel** — call `cancelsell` or `cancelbuy` with `executor`, `market_id`, `order_id`.

---

## 4. Alcor Swap (AMM) — `swap.alcor`

**Same contract account name on all supported chains:** `swap.alcor`.

### Swap types (via transfer memo)

- **`swapexactin`** — spend full input, max output.
- **`swapexactout`** — spend input until **exact** output, return change.

**Memo format:**

```text
<swapexactin|swapexactout>#<poolIds>#<recipient>#<Output extended asset>#<deadline>[#market.account]
```

Example:

```text
swapexactin#0#alcordexfund#3.9167 TLM@alien.worlds#0
```

Optional trailing **`#market.contract`** (or registered market account) for **custom market / referral fee** (see §6).

**Parameters:** swap mode, **pool ID path** (comma-separated for multi-hop), **recipient**, **output token** string, **deadline** (seconds), optional **market** fee receiver.

### Pool price (low-level)

Docs give sqrt-price formulas; for apps prefer **[alcor-v2-sdk](https://github.com/alcorexchange/alcor-v2-sdk)**.

### Gists (examples)

- Pool X/Y price: [gist](https://gist.github.com/avral/239e31232eb9a173b77c56dc537ddb6d)
- Liquidity by wallet: [gist](https://gist.github.com/avral/43a6dacbad1f3db3fe3b0e56b53ba7e7)

### Pairs table (conceptual)

`pairs` / `pairs_struct`: `id`, `supply`, `pool1` / `pool2` as `extended_asset`, `fee`, `fee_contract`, indexes for pair lookup.

---

## 5. Market creation (UI + economics)

- From **Markets** → **Open new market**; **Auto select** or **Manual** token entry; **RAM** cost shown.
- Only tokens **in the connected wallet** appear in dropdowns for selection.

---

## 6. Referral / custom market fee (Swap)

1. Register with **`regmarket`** on `swap.alcor`: `marketName` (fee receiver), `marketFee` in parts per **10⁶** (e.g. `1000` = 0.1%, `500` = 0.05%; **max 10000** = 1%). Example explorer link in docs uses WAX bloks.
2. **Deep-link:** `https://alcor.exchange/swap?market=<marketAccount>` (add `&market=` to swap URL).
3. **Iframe widget:** same `market` query param on widget URL (see §12).
4. **Custom UI:** append `#<marketAccount>` to swap memo (see §4).

---

## 7. HTTP API (read-mostly UI data)

**v2 docs:** [api.alcor.exchange](https://api.alcor.exchange/)

**Base URLs** (per chain):

```text
<chain>.alcor.exchange/api
```

Chains: `wax`, `proton`, `telos`; **EOS** is default on `alcor.exchange/api` (no chain prefix).

**Examples:**

- `GET https://wax.alcor.exchange/api/markets` — all markets  
- `GET https://wax.alcor.exchange/api/markets/:id` — one market (tokens, mins, fee, last price, volumes, changes)  
- `GET .../markets/:id/deals` — recent deals (`limit`, default 200)  
- `GET .../markets/:id/charts` — candles: query `to`, `from`, `resolution` (`1/5/15/30/60/240`, `1D`/`1W`/`1M`)  
- `GET .../api/account/:name/deals` — account deal history (`market`, `limit`, `skip`)  
- `GET .../api/account/:name/liquidity_positions` — AMM positions  

**Writes** (orders, swap transfers, etc.) go through **chain RPC + wallet**, not necessarily these REST routes.

### Public data backups

Daily Mongo-style backups: **[alcor.exchange/backups](https://alcor.exchange/backups)**

---

## 8. WebSocket API (Socket.IO)

**Endpoint pattern:**

```text
wss://<chain>.alcor.exchange/socket.io/
```

(e.g. `wss://wax.alcor.exchange/socket.io/`)

**Commands:** `subscribe` / `unsubscribe` with `{ room, params }`.

| Room | Params | Purpose |
|------|--------|---------|
| `deals` | `chain`, `market` | New trades (first payload ~last 200) |
| `ticker` | `chain`, `market`, `resolution` | Chart ticker updates |
| `account` | `chain`, `name` | Account notifications (order matches, etc.) |
| `orderbook` | `chain`, `market`, `side` (`buy`/`sell`) | Full book then deltas |

**Events:** `match`, `orderbook_sell`, `orderbook_buy`, `new_deals` (names as in docs).

**Example (from docs):**

```js
import { io } from 'socket.io-client'
const socket = io('https://alcor.exchange')
socket.emit('subscribe', { room: 'deals', params: { chain: 'wax', market: 26 } })
socket.on('new_deals', deals => { /* ... */ })
```

---

## 9. Node / RPC integration

Docs show **eosjs** patterns: `transfer` to `alcordexmain` with order memo; `get_table_rows` on `buyorder` with `scope: marketId`, `index_position`, `key_type: 'i128'` for price-sorted book. **Treat snippets as illustrative**—confirm against current contract ABI.

---

## 10. Concentrated liquidity & pools (Swap AMM)

- **Fee tiers** (docs): e.g. **0.05%–1%** range mentioned for new positions.
- **Range orders:** liquidity in a band; out-of-range → position is **100% one asset**, **no fees** until price re-enters range.
- **Lock liquidity permanently:** **Transfer Position** to **`eosio.null`** (burns control; no further transfer/claim/remove).
- **Manage liquidity:** claim fees only, or remove % of position; changing range = close position and open new (per docs).

Docs pages: *Introduction, Swap Page, Locking Liquidity, Providing liquidity, Ranges, Pool Page, LP FAQ, Concentrated liquidity FAQ.*

---

## 11. AlcorSwap v2 price oracles (TWAP)

- **TWAP** over pool observations (Uniswap V3–style idea); manipulations costly vs fees—use **rolling window**, not spot, in DeFi logic.
- Historical observations stored in array; can **extend history** by **RAM**: transfer WAX to `swap.alcor` with memo `addoraclerow#<poolId>` (WAX example in docs).
- **vs DelphiOracle:** Alcor TWAP from **on-chain DEX**; Delphi from **CEX aggregation**; TWAP gives **timestamped** history for many pairs; Delphi limited pairs, “last price” style.
- Contract integration helper repo: **[alcorexchange/alcor-oracle-price](https://github.com/alcorexchange/alcor-oracle-price)** (`getPriceTwapX64(poolId, twapInterval)` style usage—see docs).

---

## 12. Embed: Swap widget & chart widget

### Swap iframe

Per-chain widget origins:

- WAX: `http://wax.alcor.exchange/swap-widget`
- EOS: `http://eos.alcor.exchange/swap-widget`
- Telos: `http://telos.alcor.exchange/swap-widget`
- XPR / Proton: `http://proton.alcor.exchange/swap-widget`

```html
<iframe src="http://alcor.exchange/swap-widget" width="445" height="600"></iframe>
```

**Query params** (token id = `symbol-contract`, e.g. `wax-eosio.token`):

- `input` — default sell token  
- `output` — default buy token  
- `only` — comma-separated allowlist for dropdown  
- `market` — registered market fee account (see §6)  

### Chart widget

Path: **`/chart-widget`** with `input` and `output` token ids:

`/chart-widget?output=TLM-alien.worlds&input=WAX-eosio.token`

---

## 13. Alcor Farms (yield farming)

- Liquidity → farm incentives; **on-chain** reward math; claim anytime; pause/resume participation.
- **Create incentives:** e.g. `https://wax.alcor.exchange/farm/create` — need authority on a token in the pair; **reward tokens must be whitelisted** (contact **[@alcorexchange](https://t.me/alcorexchange)** Telegram per docs).
- **Filter farm list by project:** `https://alcor.exchange/farm?contracts=martia` or comma-separated contracts.
- **Tables on `swap.alcor`:** `incentives`, `stakingpos`, `stakes` (scoped by incentive id).

---

## 14. LSW — Liquid Staked WAX (WAX-specific)

- Stake WAX → receive **LSW**; rate starts **1:1**, updates with rewards (`TotalLiquidStakedWAX` / `TotalNativeWAX` style formula in docs).
- Staking routed via Alcor contracts / **`liquid.alcor`** to top guilds; compounding described in docs.
- **Withdraw:** 3-day unbond on Alcor **or** instant via **LSW/WAX** swap on DEX.

---

## 15. Listing tokens in the Alcor UI

### Metadata JSON (fundamentals)

- Repo: **[github.com/avral/alcor-ui](https://github.com/avral/alcor-ui)** — `assets/fundamentals/<chain>.json` (`wax.json`, `eos.json`, `telos.json`, `proton.json`).
- Keys: **`SYMBOL@contract`** (symbol **uppercase**), value object: `name`, `website`, `tags`, `socials`, `github`, `description`, etc.

### Logos

- **alcor-ui:** `assets/tokens/<chain>/<symbol>_<contract>.png` (**lowercase**, **64×64** PNG).  
- Legacy: **[eos-airdrops](https://github.com/eoscafe/eos-airdrops)**.  
- Non-technical: ask in **[Telegram](https://t.me/alcorexchange)**.

### USD price in UI / tokens API

Need a **pool to WAX or USDT** with **TVL ≥ ~$1** (per docs).

---

## 16. WAX — Alcor USDT & bridge

- **USDT on WAX** via **IBC**; bridge UI: **[alcor.exchange/bridge](https://alcor.exchange/bridge)**.  
- Docs mention **`ibc.alcor`** bridge and **`usdt.alcor`** wrapped token.  
- IBC overview: [ibc-docs.uxnetwork.io](https://ibc-docs.uxnetwork.io/) (linked from docs).

---

## 17. Definitions (from docs)

- **Mainnet** — live deployed protocol.  
- **Market order** — execute now; price not guaranteed.  
- **Slippage** — executed vs expected price difference; worse in volatile/thin markets.

---

## 18. FAQ — fees (summarized)

| Mode | Fee notes (from docs) |
|------|------------------------|
| **Swap (AMM)** | ~**0.3%** to LPs |
| **Market** | ~**0.2%** on **four** WAX pairs only (WAX/TLM, WAX/Aether, WAX/Void, WAX/PGL) → dev fund |
| **OTC** | **0.25%** each side when amount sufficient; tiny trades may be free |

---

## 19. Community / support

- **Telegram:** [t.me/alcorexchange](https://t.me/alcorexchange)  
- **Twitter / X:** [@alcorexchange](https://twitter.com/alcorexchange)  
- **Discord:** [discord.gg/kAYNMAKU](https://discord.gg/kAYNMAKU)  

---

## 20. When building in this repo (XPR template)

- **Proton / XPR** frontends: use **`proton.alcor.exchange`** for widget/API paths where docs list Proton.  
- **Signing:** use this app’s **WebAuth / Anchor** session to push `transfer` actions with correct memos to `swap.alcor` or chain `alcor` / `alcordexmain` as required.  
- Always **re-verify** contract names, memos, and ABIs on **[explorer.xprnetwork.org](https://explorer.xprnetwork.org/)** or the chain’s explorer before mainnet.

---

*This skill file is a structured index; protocol parameters and URLs may change—prefer [docs.alcor.exchange](https://docs.alcor.exchange/) for authoritative updates.*
