import { Button } from '@components/Button';
import { getClip } from '@utils/api/client/requestClip';
import {
  maximumCodeLength,
  minimumCodeLength,
  sampleURLs,
} from '@utils/constants';
import { getClipHash } from '@utils/generateID';
import { isValidClipCode } from '@utils/isClip';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Layout } from '../components/Layout';

const ReceivePage: NextPage = () => {
  const [clipCode, setClipCode] = useState<string>('');

  const generator = Math.random();
  const partSize = 1 / 36 ** 5; // 0.00000165% probability

  const randomURL =
    generator <= partSize
      ? 'interclip'
      : sampleURLs[Math.floor(Math.random() * sampleURLs.length)];

  const router = useRouter();

  return (
    <Layout titlePrefix="Receive clip">
      <main className="my-auto w-full" id="maincontent">
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
                  router.push(`/clip/${clip.result.code}`);
                } else {
                  toast.error(clip.result);
                }
              });
            }}
          >
            <input
              autoCapitalize="off"
              autoComplete="off"
              autoFocus
              className="mt-12 w-full rounded-2xl px-3 py-2 text-center text-8xl text-black dark:text-dark-text"
              maxLength={maximumCodeLength}
              minLength={minimumCodeLength}
              onChange={(e) => setClipCode(e.target.value)}
              pattern="^[A-Za-z0-9]{5,99}$"
              placeholder={getClipHash(randomURL).slice(0, 5)}
              type="text"
              value={clipCode}
            />
            {clipCode && (
              <Button
                className="m-auto mt-4 h-16 w-1/2 text-xl"
                content="Retrieve"
                disabled={!isValidClipCode(clipCode)}
                focus_ring_color="blue-400"
                hover_color="gray-500"
                type="submit"
              />
            )}
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default ReceivePage;
