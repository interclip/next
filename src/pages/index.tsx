import { getClip } from '@utils/requestClip';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const [clipURL, setURL] = useState<string>('');
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
              getClip(clipURL).then((clip) => {
                if (clip && clip.status !== 'error') {
                  router.push(`/new/${clip?.result.code}`);
                } else {
                  console.log(clip);
                  if (!clip) {
                    return;
                  }
                  //@ts-ignore
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
        </div>
      </section>
    </Layout>
  );
};

export default Home;
