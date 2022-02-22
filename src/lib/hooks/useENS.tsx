import { getDefaultProvider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import isEthereumAddress from 'validator/lib/isEthereumAddress';

export function useENS(address: string | null | undefined) {
  const [ensName, setENSName] = useState<string | null>();

  useEffect(() => {
    async function resolveENS() {
      if (address && isEthereumAddress(address)) {
        const provider = getDefaultProvider();
        const name = await provider.lookupAddress(address);
        if (name) setENSName(name);
      }
    }
    resolveENS();
  }, [address]);

  return { ensName };
}
