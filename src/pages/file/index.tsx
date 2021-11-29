import 'tailwindcss/tailwind.css';

import { Layout } from '@components/Layout';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Loading } from '@nextui-org/react';
import React, { Fragment, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import WebTorrent from 'webtorrent';
const remoteOptions = [
  { name: 'Peer to Peer' },
  { name: 'IPFS' },
  { name: 'Interclip file server' },
];
import { web3StorageToken } from '@utils/constants';
import { requestClip } from '@utils/requestClip';
import uploadFile from '@utils/uploadFile';
import { Web3Storage } from 'web3.storage';

const RemoteOptionsSelect = () => {
  const [selected, setSelected] = useState(remoteOptions[0]);

  return (
    <div className="w-72">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
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
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white shadow-lg rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {remoteOptions.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                    cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
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
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
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

export default function HomePage() {
  const filesEndpoint = 'https://files.interclip.app';

  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileURL, setFileURL] = useState<null | string>(null);
  const [code, setCode] = useState<null | string>(null);
  const client = new WebTorrent();

  const seedHandler = async (e: any) => {
    if (WebTorrent.WEBRTC_SUPPORT) {
      client.seed(
        e?.dataTransfer?.files || e.target?.file,
        (torrent: WebTorrent.Torrent) => {
          setFileURL(torrent.magnetURI);
          setLoading(false);
          setCode('g');
        },
      );
    }
  };

  interface DropEvent {
    dataTransfer?: { files: File[] };
    target?: { files: File[] };
  }

  const ipfsHandler = async (e: DropEvent) => {
    if (web3StorageToken) {
      const client = new Web3Storage({ token: web3StorageToken });
      const files = e?.dataTransfer?.files || e.target?.files;
      const rootCID = await client.put(files!, {
        maxRetries: 3,
        wrapWithDirectory: false,
      });
      const url = `https://ipfs.interclip.app/ipfs/${rootCID}?filename=${
        files![0]?.name
      }`;
      setFileURL(url);
      const clipResponse = await requestClip(url);

      if (clipResponse) {
        setCode(clipResponse.result.code);
      }
    }
  };

  const uploadHandler = async (e: any) => {
    setShowOverlay(false);
    setLoading(true);

    const storage: string = 'ipfs';

    try {
      switch (storage) {
        case 'ipfs':
          await ipfsHandler(e);
          break;
        case 'iss':
          const fileURL = await uploadFile(filesEndpoint, e);
          const clipResponse = await requestClip(fileURL);
          if (clipResponse) {
            setCode(clipResponse.result.code);
          }
          setFileURL(fileURL);
          break;
        case 'torrent':
          await seedHandler(e);
          break;
      }
    } catch (e) {
      toast.error(e as string);
    }

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
      <section className="w-full my-auto">
        <Toaster />
        <div className="w-screen h-full bg-[#005AC7] dark:bg-dark-bg sm:px-8 md:px-16 sm:py-8">
          <main className="container h-full mx-auto max-w-screen-lg">
            <RemoteOptionsSelect />
            {!fileURL ? (
              <article
                aria-label="File Upload Modal"
                className="relative flex flex-col h-full mt-32 bg-white shadow-xl dark:bg-dark-secondary dark:text-white rounded-md"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDragEnter={dragEnterHandler}
              >
                {showOverlay && (
                  <div
                    id="overlay"
                    className="absolute top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full pointer-events-none rounded-md"
                  >
                    <i>
                      <svg
                        className="w-12 h-12 mb-3 text-blue-700 fill-current"
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

                <section className="flex flex-col w-full h-64 p-8 overflow-auto">
                  <header className="flex flex-col items-center justify-center h-full py-12 border-2 border-dashed border-[#157EFB]">
                    {!showOverlay && (
                      <>
                        {loading ? (
                          <p className="flex flex-col justify-center mb-3 font-semibold text-gray-900 dark:text-gray-200 gap-8">
                            <span>Uploading your file...</span>
                            <Loading />
                          </p>
                        ) : (
                          <>
                            <p className="flex flex-wrap justify-center mb-3 font-semibold text-gray-900 dark:text-gray-200">
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
                              className="px-3 py-1 mt-2 rounded-xl bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
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
              <article className="relative flex flex-col h-full bg-white shadow-xl dark:bg-dark-secondary dark:text-white rounded-md">
                <section className="flex flex-col w-full h-full p-8 overflow-auto">
                  <header className="flex flex-col items-center justify-center h-full py-12 border-2 border-gray-400 border-solid">
                    <p className="flex flex-wrap justify-center mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>Your file has been uploaded to</span>
                    </p>
                    <p className="flex flex-wrap justify-center mb-3 text-3xl font-semibold text-center text-gray-900 dark:text-gray-200 hover:underline">
                      <span>
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileURL.replace('https://', '')}
                        </a>
                      </span>
                    </p>
                    <p className="flex flex-wrap justify-center mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>as the code</span>
                    </p>
                    <p className="flex flex-wrap justify-center mb-3 text-3xl font-semibold text-gray-900 dark:text-gray-200">
                      <span>
                        <a
                          href={`https://interclip.app/${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {code}
                        </a>
                      </span>
                    </p>
                    <button
                      className="px-3 py-1 mt-2 rounded-xl bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
                      onClick={() => {
                        setShowOverlay(false);
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
