import { HDNode, isValidMnemonic } from '@ethersproject/hdnode';
import Web3 from 'web3';
import fetch from 'cross-fetch';
import derivationPaths from './dpaths';
import networks from './networks';

// todo: deduplicate paths..
// todo: implement index counter for paths..

start();

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

async function start() {
  const mnemonicOrPrivateKey = process.argv.slice(2)[0];

  let hdnode;
  if (isValidMnemonic(mnemonicOrPrivateKey)) {
    hdnode = HDNode.fromMnemonic(mnemonicOrPrivateKey);
  } else {
    throw Error('Only seed from Mnemonic supported');
    // todo: support private key.
  }

  let web3;

  for (const deriPath of derivationPaths) {
    const deriNode = hdnode.derivePath(deriPath);
    console.log(`Searching ${deriPath}: ${deriNode.address}`);

    for (const network of networks) {
      console.log(`Searching ${network.name}`);
      web3 = new Web3(network.rpc);

      const balance = await web3.eth.getBalance(deriNode.address);
      if (parseInt(balance, 10) > 0) {
        console.log(`Native balance: ${balance}`);
      }

      const txCount = await web3.eth.getTransactionCount(deriNode.address);
      if (txCount > 0) {
        console.log(`Transactions:   ${txCount}`);
      }

      if (network.blockscout) {
        const tokens = await getTokenlist(network.blockscout, deriNode.address);
        if (tokens.length > 0) {
          console.log(`Tokens:         ${tokens.length}`);
        }

        // todo: check token events to check for historical activity..
        // ?module=account&action=tokentx&address={addressHash}
      }
    }
  }
}
