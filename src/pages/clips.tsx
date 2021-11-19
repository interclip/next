import ClipCard from '@components/Clips/ClipCard';
import { Layout } from '@components/Layout';
import { H1 } from '@components/Text/headings';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';

interface ClipsResponse {
  status: 'error' | 'success';
  result: ClipWithPreview[];
}

const MyClips = (): React.ReactNode => {
  const [loadedClips, setClips] = useState<null | ClipWithPreview[]>(null);
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
      .catch(() => {
        toast.error('There was an error when fetching your clips');
      });
  }, [router]);

  return (
    <Layout titlePrefix="My clips">
      <section className="justify-center w-full grid">
        <div className="w-[50em] max-w-[93vw]">
          <H1>Clips you made</H1>
          <div
            className="mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2"
            style={{
              gridAutoRows: '1fr',
            }}
          >
            {loadedClips === null ? (
              <div className="m-auto mt-20">
                <SyncLoader color="#FFFFFF" speedMultiplier={0.75} />
              </div>
            ) : loadedClips.length === 0 ? (
              <>You didn't make any clips yet..</>
            ) : (
              loadedClips.map((clip) => {
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
