import { requestClip } from '@utils/api/client/requestClip';
import { minimumCodeLength } from '@utils/constants';
import { getClipHash } from '@utils/generateID';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import isURL from 'validator/lib/isURL';

import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const [clipURL, setURL] = useState<string>('');
  const estimatedCode = getClipHash(clipURL).slice(0, minimumCodeLength);
  const router = useRouter();
  return (
    <Layout>
      <section className="my-auto w-full">
        <h1 className="text-center font-sans text-6xl font-semibold">
          Paste your link here!
        </h1>
        <div className="mx-5 max-w-5xl lg:mx-auto lg:w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              requestClip(clipURL).then((clip) => {
                if (clip.status !== 'error') {
                  router.push(`/new/${clip?.result.code}`);
                } else {
                  if (!clip) {
                    return;
                  }
                  toast.error(clip.result);
                }
              });
            }}
          >
            <input
              type="url"
              value={clipURL}
              onChange={(e) => setURL(e.target.value)}
              className="mt-12 w-full rounded-2xl px-3 py-2 text-3xl text-black dark:text-dark-text"
              placeholder="https://www.histories.cc/krystofex"
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
