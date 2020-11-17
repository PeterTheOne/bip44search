bip44search
===========

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

todo
----

- [ ] support starting from private key
- [ ] move list of networks into some config file
- [ ] move list of derivation paths to some config file
- [ ] go through more than index 0 for derivation paths.
- [ ] dynamic search depth depending on what is found.
