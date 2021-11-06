import 'tailwindcss/tailwind.css';

import { Layout } from '@components/Layout';
import { Loading } from '@nextui-org/react';
import { requestClip } from '@utils/requestClip';
import uploadFile from '@utils/uploadFile';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const filesEndpoint = 'https://files.interclip.app';

  const [showOverlay, setShowOverlay] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileURL, setFileURL] = useState(filesEndpoint);
  const [code, setCode] = useState<null | string>(null);

  // reset counter and append file to gallery when file is dropped
  const dropHandler = async (e: any) => {
    e.preventDefault();
    const fileURL = await uploadFile(filesEndpoint, e);
    const clipResponse = await requestClip(fileURL);
    if (clipResponse) {
      setCode(clipResponse.result.code);
    }
    setFileURL(fileURL);
    setLoading(false);
    setUploaded(true);
    setShowOverlay(false);
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
        <div className="bg-[#005AC7] h-full w-screen sm:px-8 md:px-16 sm:py-8">
          <main className="container mx-auto max-w-screen-lg h-full">
            {!uploaded ? (
              <article
                aria-label="File Upload Modal"
                className="relative h-full flex flex-col bg-white shadow-xl rounded-md"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDragEnter={dragEnterHandler}
              >
                {showOverlay && (
                  <div
                    id="overlay"
                    className="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
                  >
                    <i>
                      <svg
                        className="fill-current w-12 h-12 mb-3 text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                      </svg>
                    </i>
                    <p className="text-lg text-blue-700">Drop your file here</p>
                  </div>
                )}

                <section className="overflow-auto p-8 w-full h-64 flex flex-col">
                  <header className="border-dashed border-2 h-full border-[#157EFB] py-12 flex flex-col justify-center items-center">
                    {!showOverlay && (
                      <>
                        {loading ? (
                          <p className="mb-3 font-semibold text-gray-900 flex flex-col justify-center gap-8">
                            <span>Uploading your file...</span>
                            <Loading />
                          </p>
                        ) : (
                          <>
                            <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                              <span>Drag and drop your</span>&nbsp;
                              <span>file anywhere or</span>
                            </p>

                            <input
                              id="hidden-input"
                              type="file"
                              onChange={async (e) => {
                                const fileURL = await uploadFile(
                                  filesEndpoint,
                                  e,
                                );
                                const clipResponse = await requestClip(fileURL);
                                if (clipResponse) {
                                  setCode(clipResponse.result.code);
                                }
                                setFileURL(fileURL);
                                setLoading(false);
                                setUploaded(true);
                                setShowOverlay(false);
                              }}
                              className="hidden"
                            />
                            <button
                              id="button"
                              className="mt-2 rounded-xl px-3 py-1 bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
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
              <article className="relative h-full flex flex-col bg-white shadow-xl rounded-md">
                <section className="h-full overflow-auto p-8 w-full flex flex-col">
                  <header className="border-solid border-2 h-full border-gray-400 py-12 flex flex-col justify-center items-center">
                    <p className="mb-3 font-semibold text-gray-900 text-2xl flex flex-wrap justify-center">
                      <span>Your file has been uploaded to</span>
                    </p>
                    <p className="mb-3 font-semibold text-gray-900 text-3xl flex flex-wrap justify-center text-center hover:underline">
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
                    <p className="mb-3 font-semibold text-gray-900 text-2xl flex flex-wrap justify-center">
                      <span>as the code</span>
                    </p>
                    <p className="mb-3 font-semibold text-gray-900 text-3xl flex flex-wrap justify-center">
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
                      className="mt-2 rounded-xl px-3 py-1 bg-[#157EFB] hover:bg-[#5DA5FB] focus:shadow-outline focus:outline-none"
                      onClick={() => {
                        setUploaded(false);
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
