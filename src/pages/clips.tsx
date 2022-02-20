import ClipCard from '@components/Clips/ClipCard';
import { Layout } from '@components/Layout';
import { H1 } from '@components/Text/headings';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SyncLoader } from 'react-spinners';
import { ClipWithPreview } from 'src/typings/interclip';

interface ClipsResponse {
  status: 'error' | 'success';
  result: ClipWithPreview[];
}

class AuthError extends Error {
  constructor() {
    super();
    this.name = 'AthenticationError';
  }
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
          throw new AuthError();
        }
      })
      .then((clips: ClipsResponse) => {
        setClips(clips.result);
      })
      .catch((error) => {
        if (error instanceof AuthError) {
          toast.error('You must log in to access this page');
          return;
        }
        toast.error('There was an error when fetching your clips');
        setClips([]);
      });
  }, [router]);

  return (
    <Layout titlePrefix="My clips">
      <section className="grid w-full justify-center">
        <div className="w-[50em] max-w-[93vw]">
          <H1>Clips you made</H1>
          <div
            className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2"
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
