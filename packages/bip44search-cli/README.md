bip44search-cli
===============

is a node.js commandline tool that searches for assets on a list of blockchains
and derivation paths starting from a seed phrase. Uses JSON RPC APIs and Blockscout APIs 
if available.

Configured Networks:
- ARTIS sigma1
- xDai Chain
- POA Network

Configured Derivation Paths:
- `m/44'/60'/0'/0/0`,
- `m/44'/60'/0'/0`,
- `m/44'/60'/0'`,
- `m/44'/1'/0'/0`,

run
---

```
npm ci
npm run start 'buzz hero bullet work supreme night earth carpet cancel road forest scan'
```
