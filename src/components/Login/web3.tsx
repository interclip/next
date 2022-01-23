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
    if (!(window as any).etherum) {
      toast.error(
        'You need to install the Metamask browser extension for this to work',
      );
    } else {
      (window as any).ethereum
        ?.request({ method: 'eth_requestAccounts' })
        // Returns an array of web3 addresses.
        .then(async (accounts: string[]) => {
          try {
            const nonce = `sign_in_${Math.random().toString(16).slice(2, 18)}`;
            const signedToken: string = await (window as any).ethereum?.request(
              {
                method: 'personal_sign',
                params: [nonce, accounts[0]],
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
    web3 = new Web3((window as any).etherum as any);
    checkConnectedWallet();
  }, [checkConnectedWallet]);

  if (!state.started || typeof window === 'undefined') return null;

  return (
    <button
      className="w-full h-12 mb-4 font-bold text-white rounded-lg bg-[#f6851b] hover:bg-[#cd6116] transition"
      onClick={signInWithWallet}
      disabled={!!(window as any).etherum}
    >
      Authenticate with Metamask
    </button>
  );
};

export default MetaMaskLoginButton;
