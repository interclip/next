import { Layout } from '@components/Layout';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Loading } from '@nextui-org/react';
import { requestClip } from '@utils/api/client/requestClip';
import {
  ipfsGateway,
  maxIPFSUploadSize,
  StorageProvider,
  web3StorageToken,
} from '@utils/constants';
import uploadFile, { ipfsCheckCID } from '@utils/uploadFile';
import { useSession } from 'next-auth/react';
import React, { Fragment, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { DropEvent } from 'src/typings/interclip';

//import type { Torrent } from 'webtorrent';
import { getCache, storeCache } from '../clips';

const remoteOptions: { name: StorageProvider }[] = [
  { name: StorageProvider.IPFS },
  { name: StorageProvider.S3 },
];

const RemoteOptionsSelect = ({
  setSelected,
  selected,
}: {
  setSelected: React.Dispatch<
    React.SetStateAction<{
      name: StorageProvider;
    }>
  >;
  selected: { name: string };
}) => {
  const { status, data: session } = useSession();
  useEffect(() => {
    if (status !== 'unauthenticated' && session?.user?.email) {
      const cachedPref = getCache<StorageProvider>(
        session.user.email,
        'storage',
      );
      if (cachedPref) {
        setSelected({ name: cachedPref });
      }
      fetch('/api/account/getDetails?params=storageProvider').then(
        async (res) => {
          if (res.ok) {
            const response = await res.json();
            setSelected({ name: response.storageProvider });
            if (session.user?.email) {
              storeCache(
                session.user.email,
                response.storageProvider,
                'storage',
              );
            }
          }
        },
      );
    }
  }, [session?.user?.email, setSelected, status]);

  return (
    <div className="w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left text-dark-text shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-dark-secondary sm:text-sm">
            <span className="block truncate text-black dark:text-gray-300">
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base text-dark-text shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-secondary sm:text-sm">
              {remoteOptions.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `${
                      active
                        ? 'bg-amber-100 text-amber-900 dark:bg-dark-bg dark:text-light-bg'
                        : 'dark:bg-dark-secondary'
                    }
                    relative cursor-default select-none py-2 pl-10 pr-4 text-dark-text`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate text-black dark:text-light-text`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-amber-600' : 'text-amber-600'
                          }
                          absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default function FilePage() {
  const filesEndpoint = 'https://files.interclip.app';

  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileURL, setFileURL] = useState<null | string>(null);
  const [code, setCode] = useState<null | string>(null);
  const [selected, setSelected] = useState<{ name: StorageProvider }>(
    remoteOptions[0],
  );
  const [progress, setProgress] = useState<number>(0);

  /*
  const seedHandler = async (e: any) => {
    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();

    if (WebTorrent.WEBRTC_SUPPORT) {
      client.seed(
        e?.dataTransfer?.files || e.target?.file,
        (torrent: Torrent) => {
          setFileURL(torrent.magnetURI);
          setLoading(false);
          setCode('g');
        },
      );
    }
  };
  */

  /*
  class DuplicateError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DuplicateError';
    }
  }
  */

  const ipfsHandler = async (e: DropEvent) => {
    if (web3StorageToken) {
      const Web3Storage = (await import('web3.storage')).Web3Storage;
      const client = new Web3Storage({ token: web3StorageToken });
      const files = e?.dataTransfer?.files || e.target?.files;

      if (!files || files.length === 0) {
        toast.error('Please select a file');
        return;
      }

      // show the root cid as soon as it's ready
      const onRootCidReady = async (cid: string) => {
        if (await ipfsCheckCID(cid)) {
          // Todo(ft): handle files already on IPFS, maybe by pinning them
          //throw new DuplicateError('Already on IPFS');
        }
      };

      // when each chunk is stored, update the percentage complete and display
      const totalSize = [...files]
        .map((f) => f.size)
        .reduce((a, b) => a + b, 0);
      let uploaded = 0;

      const onStoredChunk = (size: number) => {
        uploaded += size;
        const pct = uploaded / totalSize;
        setProgress(pct * 100);
      };

      const filesOverLimit = [...files].filter(
        (file) => file.size > maxIPFSUploadSize,
      );

      if (filesOverLimit.length > 0) {
        for (const file of filesOverLimit) {
          toast.error(`${file.name} is too large, aborting upload`);
        }
        return;
      }

      const rootCID = await client.put(files!, {
        maxRetries: 3,
        wrapWithDirectory: false,
        onRootCidReady,
        onStoredChunk,
      });

      setProgress(0);

      const isVideo = files[0].type.match(new RegExp('video/.{1,10}'));
      const url = `${
        isVideo ? 'https://ipfs.io' : ipfsGateway
      }/ipfs/${rootCID}?filename=${files![0]?.name}`;
      setFileURL(url);
      const clipResponse = await requestClip(url);

      if (clipResponse.status === 'error') {
        toast.error(`An error has occured: ${clipResponse.result}`);
        return;
      }

      setCode(
        clipResponse.result.code.slice(0, clipResponse.result.hashLength),
      );
    } else {
      toast.error('Web3.storage token not provided');
    }
  };

  const uploadHandler = async (e: any) => {
    setShowOverlay(false);
    setLoading(true);

    try {
      switch (selected.name) {
        case 'IPFS':
          await ipfsHandler(e);
          break;
        case 'S3':
          const fileURL = await uploadFile(filesEndpoint, e);
          const clipResponse = await requestClip(fileURL);
          if (clipResponse.status === 'success') {
            setCode(
              clipResponse.result.code.slice(0, clipResponse.result.hashLength),
            );
          }
          setFileURL(fileURL);
          break;
        /*
        case 'torrent':
          await seedHandler(e);
          break;
        */
      }
    } catch (error) {
      toast.error(error as string);
    }

    setProgress(0);
    setLoading(false);
  };

  // reset counter and append file to gallery when file is dropped
  const dropHandler = async (e: any) => {
    e.preventDefault();
    await uploadHandler(e);
  };

  // only react to actual files being dragged
  const dragEnterHandler = (e: any) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  const dragLeaveHandler = () => {
    setShowOverlay(false);
  };

  const dragOverHandler = (e: any) => {
    e.preventDefault();
    setShowOverlay(true);
  };

  return (
    <Layout titlePrefix="Upload a file">
      <section className="my-auto w-full">
        <Toaster />
        <div className="h-full w-screen bg-[#005AC7] dark:bg-dark-bg sm:px-8 sm:py-8 md:px-16">
          <main className="container mx-auto h-full max-w-screen-lg">
            <RemoteOptionsSelect
              setSelected={setSelected}
              selected={selected}
            />
            {!fileURL ? (
              <article
                aria-label="File Upload Modal"
                className="relative mt-32 flex h-full flex-col rounded-md bg-white shadow-xl dark:bg-dark-secondary dark:text-white"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDragEnter={dragEnterHandler}
              >
                {showOverlay && (
                  <div
                    id="overlay"
                    className="pointer-events-none absolute top-0 left-0 z-50 flex h-full w-full flex-col items-center justify-center rounded-md"
                  >
                    <i>
                      <svg
                        className="mb-3 h-12 w-12 fill-current text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                      </svg>
                    </i>
                    <p className="text-lg text-blue-700 dark:text-white">
                      Drop your file here
                    </p>
                  </div>
                )}

                <section className="flex h-64 w-full flex-col overflow-auto p-8">
                  <header className="flex h-full flex-col items-center justify-center border-2 border-dashed border-[#157EFB] py-12">
                    {!showOverlay && (
                      <>
                        {loading ? (
                          <div className="mb-3 flex flex-col justify-center gap-8 font-semibold text-gray-900 dark:text-gray-200">
                            <span>Uploading your file...</span>
                            <div className="gap flex flex-row items-center gap-2">
                              <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-4 rounded-full bg-gray-600 dark:bg-gray-300"
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                ></div>
                              </div>
                              {Math.min(progress, 100).toFixed(2)}%
                            </div>
                            <Loading />
                          </div>
                        ) : (
                          <>
                            <p className="mb-3 flex flex-wrap justify-center font-semibold text-gray-900 dark:text-gray-200">
                              <span>Drag and drop your</span>&nbsp;
                              <span>file anywhere or</span>
                            </p>

                            <input
                              id="hidden-input"
                              type="file"
                              onChange={async (e) => {
                                await uploadHandler(e);
                              }}
                              className="hidden"
                            />
                            <button
                              id="button"
                              className="focus:shadow-outline mt-2 rounded-xl bg-[#157EFB] px-3 py-1 hover:bg-[#5DA5FB] focus:outline-none"
                              onClick={() => {
                                window &&
                                  document
                                    .getElementById('hidden-input')!
                                    .click();
                              }}
                            >
                              Upload a file
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </header>
                </section>
              </article>
            ) : (
              <article className="relative flex h-full flex-col rounded-md bg-white shadow-xl dark:bg-dark-secondary dark:text-white">
                <section className="flex h-full w-full flex-col overflow-auto p-8">
                  <header className="flex h-full flex-col items-center justify-center border-2 border-solid border-gray-400 py-12">
                    <p className="mb-3 flex flex-wrap justify-center text-2xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>Your file has been uploaded to</span>
                    </p>
                    <div className="mb-3 flex max-w-[69%] flex-wrap justify-center overflow-hidden truncate text-center text-3xl font-semibold text-gray-900 hover:underline dark:text-gray-200">
                      <span>
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selected.name === 'S3'
                            ? fileURL.replace('https://', '')
                            : selected.name === 'IPFS'
                            ? new URL(fileURL).pathname.split('/').at(-1)
                            : fileURL}
                        </a>
                      </span>
                    </div>
                    <p className="mb-3 flex flex-wrap justify-center text-2xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>as the code</span>
                    </p>
                    <div className="mb-3 flex flex-wrap justify-center text-3xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>
                        <a
                          href={`https://interclip.app/${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {code}
                        </a>
                      </span>
                    </div>
                    <button
                      className="focus:shadow-outline mt-2 rounded-xl bg-[#157EFB] px-3 py-1 hover:bg-[#5DA5FB] focus:outline-none"
                      onClick={() => {
                        setShowOverlay(false);
                        setFileURL(null);
                      }}
                    >
                      Upload a new file
                    </button>
                  </header>
                </section>
              </article>
            )}
          </main>
        </div>
      </section>
    </Layout>
  );
}
