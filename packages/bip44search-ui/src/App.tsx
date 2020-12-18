import React, { useState } from 'react';
import { Button, Input, Table } from 'reactstrap';
import bip44search, { Entry } from 'bip44search-cli';
import { Network } from 'bip44search-cli/build/networks';

export default function App(): JSX.Element {
  const [seed, setSeed] = useState<string>('');
  const [deriPaths, setDeriPaths] = useState<string[]>([
    "m/44'/60'/0'/0/0",
    "m/44'/60'/0'/0",
    "m/44'/60'/0'",
    "m/44'/1'/0'/0",
  ]);
  const [networks, setNetworks] = useState<Network[]>([
    {
      name: 'ARTIS sigma1',
      rpc: 'https://rpc.sigma1.artis.network',
      blockscout: 'https://blockscout.com/artis/sigma1',
    },
    {
      name: 'xDai Chain',
      rpc: 'https://dai.poa.network',
      blockscout: 'https://blockscout.com/poa/xdai',
    },
    {
      name: 'POA Network',
      rpc: 'https://core.poa.network',
      blockscout: 'https://blockscout.com/poa/core',
    },
  ]);
  const [currentMsg, setCurrentMsg] = useState<string>('');
  const [results, setResults] = useState<Entry[]>([]);
  const search = async () => {
    console.log('w00t');

    if (!seed || seed === '') {
      console.error('no seed: do nothing. :(');
      return;
    }
    setResults([]);
    await bip44search(seed, deriPaths, networks, (msg) => {
      setCurrentMsg(msg);
    }, (entry) => {
      setResults((re) => [...re, entry]);
    });
  };

  return (
    <div>
      <div>
        <h1>bip44search</h1>
        <p>*desc*</p>
      </div>
      <div>
        <h2>Seed Phrase</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <Input value={seed} onChange={(e) => setSeed(e.currentTarget.value)} />
          <Button type="submit">Search</Button>
        </form>
        <p>todo</p>
      </div>
      <div>
        <h2>Networks</h2>
        <p>todo</p>
      </div>
      <div>
        <h2>Derivation Paths</h2>
        <p>todo</p>
      </div>
      <div>
        <h2>Results</h2>
        <p>
          {currentMsg}
        </p>
        <Table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Network</th>
              <th>Address</th>
              <th>Balance</th>
              <th>Transactions</th>
              <th>Tokens</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.path + result.network + result.address}>
                <td>{result.path}</td>
                <td>{result.network}</td>
                <td>{result.address}</td>
                <td>{result.balance}</td>
                <td>{result.txCount}</td>
                <td>{result.tokens}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
