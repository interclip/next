import InfoCard from '@components/Admin/InfoCard';
import TabHeader from '@components/Admin/TabHeader';
import UserCard from '@components/Admin/UserCard';
import ClipCard from '@components/Clips/ClipCard';
import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { Tab } from '@headlessui/react';
import { User } from '@prisma/client';
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
import InfiniteScroll from 'react-infinite-scroller';
import { SyncLoader } from 'react-spinners';

import { Layout } from '../components/Layout';
import { getUserDetails } from './api/account/getDetails';

interface UserResponse extends APIResponse {
  result: User[];
}

const initialItemsToLoad = 15;

const fetchUsers = async (
  from: number,
  setMoreUsersToLoad: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<User[]> => {
  const response = await fetch(
    `/api/admin/getUsers?from=${from}&limit=${from === 0 ? initialItemsToLoad : 5
    }`,
  );
  if (!response.ok) {
    throw new Error('Not ok');
  } else if (response.status === 204) {
    setMoreUsersToLoad(false);
    return [];
  }

  const data: UserResponse = await response.json();
  return data.result;
};

const fetchClips = async (
  from: number,
  setMoreClipsToLoad: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<User[]> => {
  const response = await fetch(
    `/api/admin/getClips?from=${from}&limit=${from === 0 ? initialItemsToLoad : 5
    }`,
  );
  if (!response.ok) {
    throw new Error('Not ok');
  } else if (response.status === 204) {
    setMoreClipsToLoad(false);
    return [];
  }

  const data: UserResponse = await response.json();
  return data.result;
};

interface AboutPageProps {
  clipCount: number;
  version: string;
  allUsers: any[];
  commitSHA: string;
  commitRef: string;
  commitMessage: string;
  commitAuthor: string;
  user: {
    name: string;
    username: string;
    isStaff: boolean;
  };
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

  return (
    <Layout titlePrefix="Admin">
      <section className="flex flex-col items-center w-full">
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
              <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                <TabHeader title="Statistics"></TabHeader>
                <TabHeader title="Controls"></TabHeader>
                <TabHeader title="Users"></TabHeader>
                <TabHeader title="Clips"></TabHeader>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className={panelClassNames}>
                  <div className="items-center justify-around mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-2">
                    <InfoCard
                      name="Clips"
                      value={clipCount.toString()}
                      description="Total clips"
                    />
                    <InfoCard
                      name="Version"
                      value={version}
                      description="Interclip's version"
                    />
                    <InfoCard
                      name="Commit"
                      description="Commit of this preview"
                    >
                      {commitSHA && commitAuthor && commitMessage ? (
                        <>
                          <Link
                            href={`https://github.com/interclip/interclip-next/commit/${commitSHA}`}
                          >
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
                <Tab.Panel className={panelClassNames}>WIP 🚧</Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  <InfiniteScroll
                    pageStart={0}
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
                    hasMore={moreUsersToLoad}
                    loader={
                      <div className="loader" key={0}>
                        Loading ...
                      </div>
                    }
                  >
                    {users.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </InfiniteScroll>
                </Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  <section className="justify-center w-full grid">
                    <div className="m-16 w-[50em] max-w-[93vw]">
                      <div
                        className="mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2"
                        style={{
                          gridAutoRows: '1fr',
                        }}
                      >
                        {clips.map((clip) => (
                          <ClipCard key={clip.code} clip={clip} />
                        ))}
                        <InfiniteScroll
                          pageStart={0}
                          loadMore={() => {
                            fetchClips(
                              loadedClipsCount,
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
                          hasMore={moreClipsToLoad}
                          loader={
                            <div className="m-auto mt-20">
                              <SyncLoader
                                color="#FFFFFF"
                                speedMultiplier={0.75}
                              />
                            </div>
                          }
                        ></InfiniteScroll>
                      </div>
                    </div>
                  </section>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </section>
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
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default About;
