import { getClipHash } from '@utils/generateID';
import type { NextPage } from 'next';
import router from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const [clipURL, setURL] = useState<string>('');

  const { status, data: session } = useSession();

  return (
    <Layout>
      <main className="my-auto w-full" id="maincontent">
        <h1 className="text-center font-sans text-6xl font-semibold">
          Paste your link here!
        </h1>
        <div className="mx-5 max-w-5xl lg:mx-auto lg:w-full">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              let signature: string | undefined;
              let address: string | undefined;
              let providerAvailable = true;
              let shouldSignClip = false;

              const toast = (await import('react-hot-toast')).default;

              if (!(window as any).ethereum) {
                toast.error('Missing web3 provider, not signing');
                providerAvailable = false;
              }

              if (status === 'authenticated' && session?.user?.email) {
                const isEthereumAddress = (
                  await import('validator/lib/isEthereumAddress')
                ).default;
                if (isEthereumAddress(session?.user?.email))
                  fetch('/api/account/getDetails?params=clipSign').then(
                    async (res) => {
                      if (res.ok) {
                        const response = await res.json();
                        shouldSignClip = response.clipSign;
                      }
                    },
                  );
              }

              /* Signs the clip code */
              if (
                shouldSignClip &&
                status === 'authenticated' &&
                providerAvailable
              ) {
                const Web3 = (await import('web3')).default;
                const web3 = new Web3((window as any).ethereum as any);

                address = session?.user?.email || undefined;

                const msg = getClipHash(clipURL);
                if (!address) {
                  toast.error("Can't get wallet address from session");
                  return;
                }

                signature =
                  (await web3.eth.personal
                    .sign(msg, address, '')
                    .catch((error) => {
                      if (error.code === 4001) {
                        toast.error(
                          'Signature request rejected, proceeding without signing',
                        );
                        return;
                      }
                      toast.error(error.message);
                    })) || undefined;
              }

              const requestClip = (
                await import('@utils/api/client/requestClip')
              ).requestClip;

              await toast.promise(
                new Promise((resolve, reject) => {
                  requestClip(
                    clipURL.trim(),
                    signature
                      ? {
                          signature,
                          address,
                        }
                      : undefined,
                  ).then(async (clip) => {
                    if (clip.status === 'success') {
                      router.push(
                        `/clip/${clip.result.code.slice(
                          0,
                          clip.result.hashLength,
                        )}`,
                      );
                      resolve('Success');
                    } else {
                      if (!clip) {
                        reject(new Error('No clip returned'));
                      }
                      toast.error(clip.result);
                      reject();
                    }
                  });
                }),
                {
                  loading: 'Creating clip',
                  success: 'Clip created',
                  error: 'Error creating clip',
                },
              );
            }}
          >
            <input
              autoFocus
              className="mt-12 w-full rounded-2xl px-3 py-2 text-3xl text-black dark:text-dark-text"
              onChange={(e) => setURL(e.target.value)}
              placeholder="https://www.histories.cc/krystofex"
              type="url"
              value={clipURL}
            />
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
