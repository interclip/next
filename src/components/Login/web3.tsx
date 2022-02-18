import { signIn } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Web3 from 'web3';

export let web3: Web3 | undefined;

interface State {
  started: boolean;
  connected: boolean;
}

const MetaMaskLoginButton = () => {
  const [state, setState] = useState<State>({
    started: false,
    connected: false,
  });

  const checkConnectedWallet = useCallback(() => {
    web3?.eth?.getAccounts((err, accounts) => {
      if (err !== null) return setState((s) => ({ ...s, started: true }));
      else if (!accounts.length)
        return setState((s) => ({ ...s, started: true }));
      return setState({ started: true, connected: true });
    });
  }, [setState]);

  const signInWithWallet = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error(
        'You need to install the Metamask browser extension for this to work',
      );
    } else {
      web3?.eth.requestAccounts().then(async (accounts) => {
        try {
          const nonce = `sign_in_${Math.random().toString(16).slice(2, 18)}`;
          const signedToken = await web3?.eth.personal.sign(
            nonce,
            accounts[0],
            '',
          );

          if (!signedToken) {
            toast.error('Signing failed');
            return;
          }

          toast.promise(
            new Promise((_resolve, reject) => {
              setTimeout(() => {
                reject('timeout');
              }, 20000);
            }),
            {
              loading: 'Signing you in...',
              success: <b>Signed you in!</b>,
              error: <b>Could not sign you in, please try again.</b>,
            },
          );
          signIn('web3', {
            nonce,
            address: accounts[0],
            signature: signedToken,
          });
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, []);

  useEffect(() => {
    web3 = new Web3(Web3.givenProvider);
    checkConnectedWallet();
  }, [checkConnectedWallet]);

  if (!state.started || typeof window === 'undefined') return null;

  return (
    <button
      className="mb-4 h-12 w-full rounded-lg bg-[#f6851b] font-bold text-white transition hover:bg-[#cd6116]"
      onClick={signInWithWallet}
      disabled={!!(window as any).etherum}
    >
      Authenticate with Metamask
    </button>
  );
};

export default MetaMaskLoginButton;
