import { HDNode, isValidMnemonic } from '@ethersproject/hdnode';
import Web3 from 'web3';
import fetch from 'cross-fetch';
import { Network } from './networks';

// todo: deduplicate paths..
// todo: implement index counter for paths..

interface Token {
  balance: string;
  contractAddress: string;
  decimals: string;
  name: string;
  symbol: string;
  type: string;
}

async function getTokenlist(blockscoutBase:string, address: string): Promise<Token[]> {
  const resp = await fetch(`${blockscoutBase}/api?module=account&action=tokenlist&address=${address}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // todo: validate response
  return (await resp.json()).result;
}

export interface Entry {
  path: string;
  address: string;
  network: string;
  balance?: string;
  txCount?: number;
  tokens?: number;
}

async function bip44search(mnemonicOrPrivateKey: string, derivationPaths: string[], networks: Network[],
  callback: (msg: string) => void, callback2?: (entry: Entry) => void) {
  let hdnode;
  if (isValidMnemonic(mnemonicOrPrivateKey)) {
    hdnode = HDNode.fromMnemonic(mnemonicOrPrivateKey);
  } else {
    // throw Error('Only seed from Mnemonic supported');
    // todo: support private key.
    return;
  }

  let web3;

  // todo: fix for wird non bip44 conform paths...
  for (const deriPath of derivationPaths) {
    const firstIndex = parseInt((/[^/]*$/.exec(deriPath) || ['0'])[0], 10);
    let untilIndex = firstIndex + 1;
    for (let index = firstIndex; index < untilIndex; index += 1) {
      const deriPathIndex = `${deriPath.substring(0, deriPath.lastIndexOf('/'))}/${index}`;

      const deriNode = hdnode.derivePath(deriPathIndex);
      callback(`Searching ${deriPathIndex}: ${deriNode.address}`);

      for (const network of networks) {
        callback(`Searching ${network.name}`);
        web3 = new Web3(network.rpc);
        const entry: Entry = {
          path: deriPathIndex,
          address: deriNode.address,
          network: network.name,
        };

        const balance = await web3.eth.getBalance(deriNode.address);
        if (parseInt(balance, 10) > 0) {
          callback(`Native balance: ${balance}`);
          untilIndex = index + 2;
        }
        entry.balance = balance;

        const txCount = await web3.eth.getTransactionCount(deriNode.address);
        if (txCount > 0) {
          callback(`Transactions:   ${txCount}`);
          untilIndex = index + 2;
        }
        entry.txCount = txCount;

        if (network.blockscout) {
          const tokens = await getTokenlist(network.blockscout, deriNode.address);
          if (tokens.length > 0) {
            callback(`Tokens:         ${tokens.length}`);
            untilIndex = index + 2;
          }
          entry.tokens = tokens.length;

          // todo: check token events to check for historical activity..
          // ?module=account&action=tokentx&address={addressHash}
        }

        if (callback2) {
          callback2(entry);
        }
      }
    }
  }
  callback('Done');
}

export default bip44search;
