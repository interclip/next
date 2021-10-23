import { H1 } from '@components/Text/headings';
import { Link } from '@components/Text/link';
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
          <H1>Clips that you made</H1>
          {loadedClips === null ? (
            <>Loading..</>
          ) : loadedClips.length === 0 ? (
            <>You didn't make any clips yet..</>
          ) : (
            loadedClips.map((clip) => {
              const relativeTimeDiff = dayjs().to(dayjs(clip.createdAt));
              return (
                <>
                  <Link href={`/${clip.code}+`}>{clip.url}</Link> ({clip.code}){' '}
                  {relativeTimeDiff}
                </>
              );
            })
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyClips;
