import { Button } from '@components/Button';
import { getClip } from '@utils/api/client/requestClip';
import { maximumCodeLength, minimumCodeLength } from '@utils/constants';
import { isValidClipCode } from '@utils/isClip';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Layout } from '../components/Layout';

const ReceivePage: NextPage = () => {
  const [clipCode, setClipCode] = useState<string>('');

  const router = useRouter();

  return (
    <Layout>
      <section className="my-auto w-full">
        <h1 className="text-center font-sans text-6xl font-semibold">
          Paste your code here!
        </h1>
        <div className="mx-5 max-w-xl lg:mx-auto lg:w-full">
          <form
            className="flex flex-col justify-center"
            onSubmit={async (e) => {
              e.preventDefault();
              getClip(clipCode).then(async (clip) => {
                if (clip.status === 'success') {
                  router.push(`/new/${clip.result.code}`);
                } else {
                  toast.error(clip.result);
                }
              });
            }}
          >
            <input
              type="text"
              minLength={minimumCodeLength}
              maxLength={maximumCodeLength}
              value={clipCode}
              autoCapitalize="off"
              autoComplete="off"
              onChange={(e) => setClipCode(e.target.value)}
              className="mt-12 w-full rounded-2xl px-3 py-2 text-center text-8xl text-black dark:text-dark-text"
              placeholder=""
              pattern="^[A-Za-z0-9]{5,99}$"
              autoFocus
            />
            {clipCode && (
              <Button
                disabled={!isValidClipCode(clipCode)}
                type="submit"
                hover_color="gray-500"
                content="Retrieve"
                focus_ring_color="blue-400"
                className="m-auto mt-4 h-16 w-1/2 text-xl"
              />
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ReceivePage;
