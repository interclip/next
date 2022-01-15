import { requestClip } from '@utils/api/requestClip';
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
      <section className="w-full my-auto">
        <h1 className="font-sans text-6xl font-semibold text-center">
          Paste your link here!
        </h1>
        <div className="max-w-5xl mx-5 lg:w-full lg:mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              requestClip(clipURL).then((clip) => {
                if (clip && clip.status !== 'error') {
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
              className="w-full px-3 py-2 mt-12 text-3xl text-black dark:text-dark-text rounded-2xl"
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
