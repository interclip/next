import { Clip } from '.prisma/client';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface ClipResponse {
  status: 'error' | 'success';
  result: Clip;
}

const requestClip = async (url: string) => {
  try {
    const clipResponse = await fetch(`/api/clip/set?url=${url}`);
    const clip: ClipResponse = await clipResponse.json();
    toast.success(clip.result.code);
    return clip;
  } catch (e: any) {
    toast.error(e);
  }
};

const Home: NextPage = () => {
  const [clipURL, setURL] = useState<string>('');
  const router = useRouter();
  return (
    <Layout>
      <Toaster />
      <section className="my-auto w-full">
        <h1 className="text-center font-semibold text-6xl font-sans">
          Paste your link here!
        </h1>
        <div className="max-w-5xl lg:w-full mx-5 lg:mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              requestClip(clipURL).then((clip) => {
                router.push(`/new/${clip?.result.code}`);
              });
            }}
          >
            <input
              type="url"
              value={clipURL}
              onChange={(e) => setURL(e.target.value)}
              className="mt-12 text-3xl w-full text-light-text dark:text-dark-text py-2 px-3 rounded-2xl"
              placeholder="https://www.histories.cc/krystofex"
            />
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
