import { H1 } from '@components/Text/headings';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

interface Clip {
  code: string;
  url: string;
  createdAt: string;
  expiresAt: string;
}

interface ClipsResponse {
  status: 'error' | 'success';
  result: Clip[];
}

const ClipCard = ({ clip }: { clip: Clip }) => {
  const relativeTimeDiff = dayjs().to(dayjs(clip.createdAt));

  return (
    <Link href={`/${clip.code}+`} passHref>
      <div className="max-w-sm bg-white border-2 cursor-pointer border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
        <>
          <div id="header" className="flex items-center mb-4">
            <div id="header-text" className="leading-5 sm">
              <h4 id="name" className="text-xl font-semibold text-gray-800">
                Code: {clip.code}
              </h4>
              <h5 id="job" className="font-semibold text-blue-600">
                Created {relativeTimeDiff}
              </h5>
            </div>
          </div>
          <div id="quote">
            <span className="italic break-words text-gray-600">{clip.url}</span>
          </div>
        </>
      </div>
    </Link>
  );
};

const MyClips = (): JSX.Element => {
  const [loadedClips, setClips] = useState<null | Clip[]>(null);

  useEffect(() => {
    fetch('/api/clip/myclips')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          alert('Bruh');
        }
      })
      .then((clips: ClipsResponse) => {
        setClips(clips.result);
      });
  }, []);

  return (
    <Layout>
      <section className="w-full flex flex-col items-center">
        <div className="w-[50em] max-w-[93vw]">
          <H1>Clips you made</H1>
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mx-auto">
            {loadedClips === null ? (
              <>Loading..</>
            ) : loadedClips.length === 0 ? (
              <>You didn't make any clips yet..</>
            ) : (
              loadedClips
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((clip) => {
                  return <ClipCard key={clip.code} clip={clip} />;
                })
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyClips;
