import {
  mumbaiChain,
  polygonChain,
  platonTest2Chain,
  platonChain,
  moonbeamChain,
  moonbeamTestChain,
  ethereumChain,
  bscChain,
} from './../constants/chains';
import { ethers, providers } from 'ethers';

// 默认链
const defaultChain =
  import.meta.env.MODE === 'production' ? polygonChain : mumbaiChain;
const chainMap: any = {
  1: ethereumChain,

  137: polygonChain,
  80001: mumbaiChain,

  56: bscChain,

  210425: platonChain,
  2206132: platonTest2Chain,

  1284: moonbeamChain,
  1287: moonbeamTestChain,
};

export const getCurChain = async () => {
  const walletProvider = window.ethereum;
  const provider = new providers.Web3Provider(walletProvider);

  const curChainId = parseInt(await provider.send('eth_chainId', []));
  return curChainId;
};

export const checkChain = async (
  targetChainId: string | number,
): Promise<boolean> => {
  console.log('checkChain', targetChainId);

  const walletProvider = window.ethereum;
  const provider = new providers.Web3Provider(walletProvider);

  const curChainId = parseInt(await provider.send('eth_chainId', []));

  const tarChainId = parseInt(targetChainId + '');

  console.log(tarChainId);

  const chain = chainMap[tarChainId];
  console.log(
    '%c [ chain ]-73',
    'font-size:13px; background:pink; color:#bf2c9f;',
    chain,
  );
  const chainName = chain.chainName;
  if (curChainId === tarChainId) return true;

  walletProvider.on('chainChanged', (changedChain: any) => {
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have good reason not to.
    // window.location.reload()
  });

  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: chain.chainId },
    ]);
    return true;
  } catch (switchError: any) {
    // User rejected
    if (switchError.code === 4001) {
      return false;
    }
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.send('wallet_addEthereumChain', [chain]);
        const curChainId = parseInt(await provider.send('eth_chainId', []));
        return curChainId === parseInt(targetChainId + '');
      } catch (addError) {
        // handle "add" error
        return false;
      }
    }
    // handle other "switch" errors
    return false;
  }
};
