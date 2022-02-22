import ClipCard from '@components/Clips/ClipCard';
import { Layout } from '@components/Layout';
import { H1 } from '@components/Text/headings';
import { storageAvailable } from '@utils/featureDetection';
import crypto from 'crypto';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
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

interface CachedClips {
  lastUpdated: number;
  clips: ClipWithPreview[];
}

export const getCachedClips = (email: string): ClipWithPreview[] | null => {
  const key = crypto.createHash('sha256').update(email).digest('hex');
  const rawCache = localStorage.getItem(`${key}-myclips`);
  const storedCache: CachedClips | null = rawCache
    ? JSON.parse(rawCache)
    : null;

  return storedCache?.clips ?? null;
};

export const storeCachedClips = (email: string, clips: ClipWithPreview[]) => {
  const key = crypto.createHash('sha256').update(email).digest('hex');
  if (storageAvailable('localStorage')) {
    const value: CachedClips = { lastUpdated: Date.now(), clips };
    localStorage.setItem(`${key}-myclips`, JSON.stringify(value));
  }
};

const MyClips = (): React.ReactNode => {
  const [loadedClips, setClips] = useState<null | ClipWithPreview[]>(null);
  const router = useRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    switch (status) {
      case 'loading':
        break;

      case 'unauthenticated': {
        toast.error('You must log in to access this page');
      }

      case 'authenticated': {
        if (session?.user?.email) {
          setClips(getCachedClips(session?.user?.email));
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
              storeCachedClips(session.user!.email!, clips.result);
            })
            .catch((error) => {
              if (error instanceof AuthError) {
                toast.error('You must log in to access this page');
                return;
              }
              toast.error('There was an error when fetching your clips');
              setClips([]);
            });
        } else {
          toast.error('You must log in to access this page');
        }
        break;
      }
    }
  }, [router, session?.user, session?.user?.email, status]);

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
