import InfoCard from '@components/Admin/InfoCard';
import TabHeader from '@components/Admin/TabHeader';
import UserCard from '@components/Admin/UserCard';
import { Button } from '@components/Button';
import ClipCard from '@components/Clips/ClipCard';
import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { Tab } from '@headlessui/react';
import { User } from '@prisma/client';
import {
  fetchClips,
  fetchUsers,
  initialItemsToLoad,
} from '@utils/api/client/admin';
import {
  flushRedis,
  generatePreviews,
  testRedis,
} from '@utils/api/client/redis';
import { githubRepo } from '@utils/constants';
import { db } from '@utils/prisma';
import {
  GIT_COMMIT_AUTHOR,
  GIT_COMMIT_MESSAGE,
  GIT_COMMIT_REF,
  GIT_COMMIT_SHA,
} from '@utils/runtimeInfo';
import clsx from 'clsx';
import { NextApiRequest } from 'next';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroller';
import { SyncLoader } from 'react-spinners';
import { ClipWithPreview } from 'src/typings/interclip';

import { Layout } from '../components/Layout';
import { getUserDetails } from './api/account/getDetails';

interface AboutPageProps {
  clipCount: number;
  version: string;
  allUsers: any[];
  commitSHA: string;
  commitRef: string;
  commitMessage: string;
  commitAuthor: string;
  user: User;
}

const About = ({
  clipCount,
  version,
  user,
  commitSHA,
  commitMessage,
  commitAuthor,
}: AboutPageProps): React.ReactNode => {
  const panelClassNames = clsx(
    'bg-white dark:bg-[#4c4c4c] dark:text-dark-text rounded-xl p-3',
    'focus:outline-none focus:ring-2 text-black ring-offset-2 ring-offset-blue-400 dark:ring-transparent ring-white ring-opacity-60',
  );

  const [users, setUsers] = useState<User[]>([]);
  const [loadedUsersCount, setLoadedUsersCount] = useState<number>(0);
  const [moreUsersToLoad, setMoreUsersToLoad] = useState<boolean>(true);

  const [clips, setClips] = useState<ClipWithPreview[]>([]);
  const [loadedClipsCount, setLoadedClipsCount] = useState<number>(0);
  const [moreClipsToLoad, setMoreClipsToLoad] = useState<boolean>(true);

  let fixed = 0;
  return (
    <Layout titlePrefix="Admin">
      <main className="flex w-full flex-col items-center" id="maincontent">
        <div className="w-[60em] max-w-[93vw]">
          <H1>Interclip Admin</H1>
          <H2>Hi {user.name || user.username} </H2>

          <div className="w-full px-2 py-16 sm:px-0">
            <Tab.Group
              defaultIndex={0}
              onChange={(index) => {
                switch (index) {
                  default:
                }
              }}
            >
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                <TabHeader title="Statistics"></TabHeader>
                <TabHeader title="Controls"></TabHeader>
                <TabHeader title="Users"></TabHeader>
                <TabHeader title="Clips"></TabHeader>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className={panelClassNames}>
                  <div className="mx-auto grid grid-cols-1 items-center justify-around gap-8 space-y-2 md:grid-cols-2 lg:grid-cols-3">
                    <InfoCard
                      description="Total clips"
                      name="Clips"
                      value={clipCount.toString()}
                    />
                    <InfoCard
                      description="Interclip's version"
                      name="Version"
                      value={version}
                    />
                    <InfoCard
                      description="Commit of this preview"
                      name="Commit"
                    >
                      {commitSHA && commitAuthor && commitMessage ? (
                        <>
                          <Link href={`${githubRepo}/commit/${commitSHA}`}>
                            {commitMessage}
                          </Link>{' '}
                          by {commitAuthor}
                        </>
                      ) : (
                        <>'N/A'</>
                      )}
                    </InfoCard>
                  </div>
                </Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  <H2>Controls</H2>
                  <Button
                    content="Test Redis"
                    onClick={async () => {
                      const resp = await testRedis();
                      if (resp.status === 'error') {
                        toast.error(resp.result);
                      } else if (resp.status === 'success') {
                        if (resp.result.up) {
                          toast.success('Redis is up!');
                        } else {
                          toast.error('Redis is down');
                        }
                      }
                    }}
                  />
                  <Button
                    content="Flush cache"
                    onClick={async () => {
                      const resp = await flushRedis();
                      if (resp.status === 'error') {
                        toast.error(resp.result);
                      } else if (resp.status === 'success') {
                        toast.success('Flushed Redis cache');
                      }
                    }}
                  />
                  <Button
                    content="Fix missing oembeds"
                    onClick={async () => {
                      fetchClips(loadedClipsCount, clipCount).then(
                        async (newClips) => {
                          for (const clip of newClips) {
                            const resp = await generatePreviews(clip.code);
                            if (resp.status === 'error') {
                              toast.error(resp.result);
                            } else if (resp.status === 'success') {
                              toast.success(
                                `Generated preview ${++fixed}/${clipCount}`,
                              );
                            }
                          }
                        },
                      );
                    }}
                  />
                </Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  <InfiniteScroll
                    hasMore={moreUsersToLoad}
                    loadMore={() => {
                      fetchUsers(loadedUsersCount, setMoreUsersToLoad).then(
                        (newUsers) => {
                          setUsers(
                            Array.from(
                              new Set(
                                // @ts-ignore
                                [...users, ...newUsers].map(JSON.stringify),
                              ),
                              // @ts-ignore
                            ).map(JSON.parse),
                          );
                          setLoadedUsersCount(
                            loadedUsersCount + initialItemsToLoad,
                          );
                        },
                      );
                    }}
                    loader={
                      <div className="loader" key={0}>
                        Loading ...
                      </div>
                    }
                    pageStart={0}
                  >
                    {users.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </InfiniteScroll>
                </Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  <section className="grid w-full justify-center">
                    <div className="m-16 w-[50em] max-w-[93vw]">
                      <div
                        className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2"
                        style={{
                          gridAutoRows: '1fr',
                        }}
                      >
                        {clips.map((clip) => (
                          <ClipCard clip={clip} key={clip.code} />
                        ))}
                        <InfiniteScroll
                          hasMore={moreClipsToLoad}
                          loadMore={() => {
                            fetchClips(
                              loadedClipsCount,
                              loadedClipsCount === 0 ? initialItemsToLoad : 5,
                              setMoreClipsToLoad,
                            ).then((newClips) => {
                              setClips(
                                Array.from(
                                  new Set(
                                    // @ts-ignore
                                    [...clips, ...newClips].map(JSON.stringify),
                                  ),
                                  // @ts-ignore
                                ).map(JSON.parse),
                              );
                              setLoadedClipsCount(
                                loadedClipsCount + initialItemsToLoad,
                              );
                            });
                          }}
                          loader={
                            <div className="m-auto mt-20">
                              <SyncLoader
                                color="#FFFFFF"
                                speedMultiplier={0.75}
                              />
                            </div>
                          }
                          pageStart={0}
                        ></InfiniteScroll>
                      </div>
                    </div>
                  </section>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export async function getServerSideProps(context: { req: NextApiRequest }) {
  try {
    // @ts-ignore
    const userData: {
      isStaff: boolean;
      name: string;
      username: string;
    } | null = await getUserDetails(['isStaff', 'name'], context.req);
    const clipCount = await db.clip.count();
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;

    // Return 404 if user is not an admin
    if (!userData || !userData.isStaff) {
      return { notFound: true };
    }

    return {
      props: {
        clipCount,
        version,
        user: userData,
        commitSHA: GIT_COMMIT_SHA || '',
        commitRef: GIT_COMMIT_REF || '',
        commitAuthor: GIT_COMMIT_AUTHOR || '',
        commitMessage: GIT_COMMIT_MESSAGE || '',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default About;
