import { signIn } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';

export let web3: Web3 | undefined;

interface State {
  started: boolean;
  connected: boolean;
}

interface MetamaskButtonProps {
  csrfToken: string;
}

const LoginButton = (props: MetamaskButtonProps) => {
  const [state, setState] = useState<State>({
    started: false,
    connected: false,
  });

  const checkConnectedWallet = useCallback(() => {
    web3?.eth?.getAccounts((err, accounts) => {
      if (err != null) return setState((s) => ({ ...s, started: true }));
      else if (!accounts.length)
        return setState((s) => ({ ...s, started: true }));
      return setState({ started: true, connected: true });
    });
  }, [setState]);

  const signInWithWallet = useCallback(async () => {
    // @ts-ignore
    window.ethereum
      ?.request({ method: 'eth_requestAccounts' })
      // Returns an array of web3 addresses.
      .then(async (accounts: string[]) => {
        try {
          const nonce = `sign_in_${Math.random().toString(16).slice(2, 18)}`;
          // @ts-ignore
          const signedToken: string = await window.ethereum?.request({
            method: 'personal_sign',
            params: [nonce, accounts[0]],
          });

          signIn('web3', {
            nonce,
            address: accounts[0],
            signature: signedToken,
          });
        } catch (e) {
          console.error(e);
        }
      });
  }, []);

  useEffect(() => {
    //@ts-ignore
    web3 = new Web3(window.ethereum as any);
    checkConnectedWallet();
  }, [checkConnectedWallet]);

  if (!state.started || typeof window === 'undefined') return null;

  return (
    <div className="flex flex-col w-full h-full p-4">
      <button
        className="max-w-sm p-2 border-2 border-black rounded-sm"
        onClick={signInWithWallet}
      >
        Authenticate with Metamask
      </button>
    </div>
  );
};

export default LoginButton;
