import { requestClip } from '@utils/api/client/requestClip';
import { minimumCodeLength } from '@utils/constants';
import { getClipHash } from '@utils/generateID';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import isEthereumAddress from 'validator/lib/isEthereumAddress';
import isURL from 'validator/lib/isURL';

import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const [clipURL, setURL] = useState<string>('');
  const estimatedCode = getClipHash(clipURL).slice(0, minimumCodeLength);
  const [shouldSignClip, setShouldSignClip] = useState<boolean>(false);

  const { status, data: session } = useSession();
  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.email &&
      isEthereumAddress(session?.user?.email)
    ) {
      fetch('/api/account/getDetails?params=clipSign').then(async (res) => {
        if (res.ok) {
          const response = await res.json();
          setShouldSignClip(response.clipSign);
        }
      });
    }
  }, [session?.user?.email, status]);

  const router = useRouter();
  return (
    <Layout>
      <section className="my-auto w-full">
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
              if (!(window as any).ethereum) {
                toast.error('Missing web3 provider, not signing');
                providerAvailable = false;
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
                    .catch((err) => {
                      if (err.code === 4001) {
                        toast.error(
                          'Signature request rejected, proceeding without signing',
                        );
                        return;
                      }
                      toast.error(err.message);
                    })) || undefined;
              }

              await toast.promise(
                new Promise((resolve, reject) => {
                  requestClip(
                    clipURL,
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
              type="url"
              value={clipURL}
              onChange={(e) => setURL(e.target.value)}
              className="mt-12 w-full rounded-2xl px-3 py-2 text-3xl text-black dark:text-dark-text"
              placeholder="https://www.histories.cc/krystofex"
              autoFocus
            />
          </form>
          {isURL(clipURL) && (
            <>
              <ReactTooltip effect="solid" place="bottom" />
              <span
                className="ml-2"
                data-tip="This will be your clip code after you create the clip, until then, it won't work"
              >
                Code:{' '}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(estimatedCode);
                    toast(
                      'Successfully copied to clipboard, but it will only work after you create the clip',
                      { icon: '⚠️' },
                    );
                  }}
                >
                  {estimatedCode}
                </span>
              </span>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Home;
