import bip44search from './index';
import derivationPaths from './dpaths';
import networks from './networks';

bip44search(process.argv.slice(2)[0], derivationPaths, networks, (msg) => {
  console.log(msg);
});
