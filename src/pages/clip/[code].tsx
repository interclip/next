import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import { H3 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { Dialog, Transition } from '@headlessui/react';
import { ClockIcon, HeartIcon } from '@heroicons/react/outline';
import { EyeIcon } from '@heroicons/react/solid';
import { Clip } from '@prisma/client';
import { storeLinkPreviewInCache } from '@utils/clipPreview';
import { ipfsGateway } from '@utils/constants';
import { getEmbed } from '@utils/embed';
import { getClipHash } from '@utils/generateID';
import getBestFavicon from '@utils/highestResolutionFavicon';
import { proxied } from '@utils/image';
import { isValidClipCode } from '@utils/isClip';
import truncate from '@utils/smartTruncate';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { recoverPersonalSignature } from 'eth-sig-util';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import type { OEmbed } from 'src/typings/interclip';

const PreviewDialog = ({
  isOpen,
  setIsOpen,
  embedElement,
  url,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  embedElement: HTMLElement;
  url: Clip['url'];
}) => {
  return (
    <Transition appear as={Fragment} show={isOpen}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            aria-hidden="true"
            className="inline-block h-screen align-middle"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-secondary dark:text-dark-text">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                File preview
              </Dialog.Title>
              <div
                className="h-64 w-full"
                dangerouslySetInnerHTML={{ __html: embedElement.outerHTML }}
              ></div>

              <div className="mt-4">
                <button
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={() => {
                    const el = document.createElement('a');
                    el.href = url;
                    el.click();
                  }}
                  type="button"
                >
                  Download
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

dayjs.extend(relativeTime);

interface CodeViewPageProps {
  clip: string;
  oembed: string | null;
}

const CodeView = ({
  clip: returnedClip,
  oembed: returnedOembed,
}: CodeViewPageProps) => {
  const clip: Clip = JSON.parse(returnedClip);
  const oembed: OEmbed | null = returnedOembed && JSON.parse(returnedOembed);
  const urlObject = new URL(clip.url);
  const simplifiedURL = truncate(urlObject, 40);
  const bestFavicon = oembed && getBestFavicon(oembed.favicons);
  const embedElement = typeof window !== 'undefined' && getEmbed(clip.url);

  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFaviconShown, setIsFaviconShown] = useState<boolean>(true);
  const [previewOpen, setOpenPreview] = useState<boolean>(false);

  const address =
    clip.signature &&
    recoverPersonalSignature({ data: clip.code, sig: clip.signature });
  const code = clip.code.slice(0, clip.hashLength);

  const matchingHash = getClipHash(decodeURI(clip.url)) === clip.code;

  return (
    <Layout>
      <section className="flex h-full w-full max-w-2xl flex-col items-center justify-center pt-[100px]">
        {embedElement && (
          <PreviewDialog
            embedElement={embedElement}
            isOpen={previewOpen}
            setIsOpen={setOpenPreview}
            url={clip.url}
          />
        )}
        <div className="shadow-custom mb-8 flex rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="mr-6">
            <h2 className="mx-auto mb-2 text-center text-4xl">
              Created clip with code:{' '}
              <div
                className="flex cursor-pointer items-center justify-center"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 6900);
                }}
                title="Copy code to the clipboard"
              >
                <span>{code}</span>
                <svg
                  className="ml-2 h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isCopied ? (
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  ) : (
                    <path
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  )}
                </svg>
              </div>
            </h2>
          </div>
        </div>
        <div className="shadow-custom mb-8 flex w-full justify-between rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="mr-6">
            <h2 className="mb-2 max-w-[30rem] text-4xl">
              {oembed ? oembed.title || oembed?.siteName || code : code}
            </h2>
            <h3 className="text-2xl text-gray-400">
              <Link className="no-underline" href={clip.url} title={clip.url}>
                {simplifiedURL}
              </Link>
            </h3>
            <p>
              {oembed?.description?.slice(0, 250)}
              {(oembed?.description?.length ?? 0) > 250 && '...'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {oembed &&
              oembed.favicons.length > 0 &&
              isFaviconShown &&
              bestFavicon && (
                <Image
                  alt="The site's favicon"
                  className="rounded"
                  height={72}
                  onError={() => {
                    setIsFaviconShown(false);
                  }}
                  src={proxied(bestFavicon, 300, 300)}
                  width={72}
                />
              )}
            <QRIcon
              onClick={() => {
                setQrCodeZoom(true);
              }}
            />
          </div>
          {qrCodeZoom && (
            <QRModal setQrCodeZoom={setQrCodeZoom} url={clip.url} />
          )}
        </div>
        {(clip.ipfsHash ||
          clip.signature ||
          clip.expiresAt ||
          !matchingHash) && (
          <div className="shadow-custom mb-8 flex w-full flex-col justify-between rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
            <H3>Meta</H3>
            <div>
              {embedElement && (
                <div
                  className="mt-4 flex cursor-pointer flex-row items-center gap-1"
                  onClick={() => setOpenPreview(true)}
                >
                  <EyeIcon height={20} width={20} /> Preview file
                </div>
              )}
            </div>
            {clip.ipfsHash && (
              <div
                className="flex cursor-pointer flex-col"
                title="Copy code to the clipboard"
              >
                <a
                  className="mt-4 flex flex-row items-center gap-1 underline"
                  href={`${ipfsGateway}/ipfs/${clip.ipfsHash}`}
                  rel={'noopener noreferrer'}
                  target={'_blank'}
                  title="Backed up to IPFS"
                >
                  <Image
                    alt="IPFS logo"
                    height={20}
                    src={'/images/ipfs-logo.svg'}
                    width={20}
                  />
                  <span>Backed up to IPFS</span>
                  <svg
                    className="h-6 w-6"
                    data-darkreader-inline-stroke=""
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </a>
              </div>
            )}
            {clip.signature && (
              <div className="mt-4 flex flex-row items-center gap-1">
                <Image
                  alt="Ethereum logo"
                  height={20}
                  src={'/images/ethereum-logo.svg'}
                  width={20}
                />
                <span>Signed by </span>
                <ReactTooltip effect="solid" place="bottom" />
                <a
                  className="underline"
                  data-tip={address}
                  href={`https://debank.com/profile/${address}`}
                  rel={'noopener noreferrer'}
                  target={'_blank'}
                  title="Show wallet details"
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </a>
              </div>
            )}
            {clip.expiresAt && (
              <div className="mt-4 flex flex-row items-center gap-1">
                <ClockIcon height={20} width={20} /> This clip expires{' '}
                <span
                  title={dayjs(clip.expiresAt).format('MMM D, YYYY hh:mm:ss Z')}
                >
                  {dayjs(clip.expiresAt).fromNow()}
                </span>
              </div>
            )}
            {!matchingHash && (
              <div className="mt-4 flex flex-row items-center gap-1">
                <HeartIcon height={20} width={20} /> This clip has a custom code{' '}
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export async function getStaticPaths() {
  const db =
    process.env.DATABASE_URL && !process.env.CI
      ? (await import('@utils/prisma')).db
      : null;
  // Pre-render the 100 most recent clips
  const clips = db
    ? await db.clip.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
      })
    : [];
  const paths = clips.map((clip) => ({
    params: { code: clip.code.slice(0, clip.hashLength) },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({
  params,
}: {
  params: any;
}): Promise<{ notFound?: boolean; props?: CodeViewPageProps }> {
  const userCode = params.code;
  if (
    (userCode && typeof userCode === 'object') ||
    !isValidClipCode(userCode)
  ) {
    return { notFound: true };
  }

  try {
    const db =
      process.env.DATABASE_URL && !process.env.CI
        ? (await import('@utils/prisma')).db
        : null;
    const selectedClip = db
      ? await db.clip.findFirst({
          where: {
            code: {
              startsWith: userCode,
            },
          },
        })
      : null;

    if (!selectedClip) {
      return { notFound: true };
    }
    const additionalDetails =
      process.env.REDIS_HOST &&
      (await storeLinkPreviewInCache(selectedClip.url));

    return {
      props: {
        clip: JSON.stringify(selectedClip),
        oembed: additionalDetails ? JSON.stringify(additionalDetails) : null,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default CodeView;
