import React, { useEffect, useState } from 'react';
import { H1 } from '@components/Text/headings';
import { Layout } from '@components/Layout';
import ClipCard from '@components/Clips/ClipCard';
import { useRouter } from 'next/router';

interface ClipsResponse {
  status: 'error' | 'success';
  result: Clip[];
}

const MyClips = (): JSX.Element => {
  const [loadedClips, setClips] = useState<null | Clip[]>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/clip/myclips')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          router.push('/auth/login');
          throw new Error('Unauthenticated');
        } else {
          alert('Error fetching clips');
        }
      })
      .then((clips: ClipsResponse) => {
        setClips(clips.result);
      })
      .catch((e) => {});
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
