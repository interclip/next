import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import { H3 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { ipfsGateway, minimumCodeLength } from '@utils/constants';
import getBestFavicon from '@utils/highestResolutionFavicon';
import { proxied } from '@utils/image';
import { db } from '@utils/prisma';
import truncate from '@utils/smartTruncate';
import { recoverPersonalSignature } from 'eth-sig-util';
import { getLinkPreview } from 'link-preview-js';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ReactTooltip from 'react-tooltip';
import { OEmbed } from 'src/typings/interclip';

const CodeView = ({
  code,
  fullCode,
  url,
  oembed,
  ipfsHash,
  signature,
}: {
  code: string;
  fullCode: string;
  url: string;
  ipfsHash?: string;
  signature?: string;
  oembed: OEmbed;
}) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const urlObject = new URL(url);
  const simplifiedURL = truncate(urlObject, 40);
  const [isCopied, setIsCopied] = useState(false);
  const [isFaviconShown, setIsFaviconShown] = useState<boolean>(true);
  const address =
    signature && recoverPersonalSignature({ data: fullCode, sig: signature });

  return (
    <Layout>
      <section className="flex h-full w-full max-w-2xl flex-col items-center justify-center pt-[100px]">
        <div className="shadow-custom mb-8 flex rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="mr-6">
            <h2 className="mx-auto mb-2 text-center text-4xl">
              Created clip with code:{' '}
              <div
                className="flex cursor-pointer items-center justify-center"
                title="Copy code to the clipboard"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast.success('Successfully copied to clipboard');
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 6900);
                }}
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
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
              {oembed.title || code}
            </h2>
            <h3 className="text-2xl text-gray-400">
              <Link className="no-underline" href={url} title={url}>
                {simplifiedURL}
              </Link>
            </h3>
            <p>
              {oembed.description?.slice(0, 250)}
              {(oembed.description?.length ?? 0) > 250 && '...'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {oembed.favicons.length > 0 && isFaviconShown && (
              <Image
                src={proxied(getBestFavicon(oembed.favicons)!, 300, 300)}
                alt="The site's favicon"
                className="rounded"
                width={72}
                height={72}
                onError={() => {
                  setIsFaviconShown(false);
                }}
              />
            )}
            <QRIcon
              onClick={() => {
                setQrCodeZoom(true);
              }}
            />
          </div>
          {qrCodeZoom && <QRModal url={url} setQrCodeZoom={setQrCodeZoom} />}
        </div>
        {(ipfsHash || signature) && (
          <div className="shadow-custom mb-8 flex w-full flex-col justify-between rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
            <H3>Special</H3>
            {ipfsHash && (
              <div
                className="flex cursor-pointer flex-col"
                title="Copy code to the clipboard"
              >
                <a
                  href={`${ipfsGateway}/ipfs/${ipfsHash}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  title="Backed up to IPFS"
                  className="mt-4 flex flex-row items-center gap-1 underline"
                >
                  <Image
                    alt="IPFS logo"
                    src={'/images/ipfs-logo.svg'}
                    width={20}
                    height={20}
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
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
            {signature && (
              <div className="mt-4 flex flex-row items-center gap-1">
                <Image
                  alt="Ethereum logo"
                  src={'/images/ethereum-logo.svg'}
                  width={20}
                  height={20}
                />
                <span>Signed by </span>
                <ReactTooltip effect="solid" place="bottom" />
                <a
                  href={`https://debank.com/profile/${address}`}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  title="Show wallet details"
                  className="underline"
                  data-tip={address}
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </a>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export async function getServerSideProps({
  query,
}: {
  query: NextApiRequest['query'];
}) {
  const userCode = query.code;
  if (
    (userCode && typeof userCode === 'object') ||
    userCode.length < minimumCodeLength
  ) {
    return { notFound: true };
  }

  try {
    const selectedClip = await db.clip.findFirst({
      where: {
        code: {
          startsWith: userCode,
        },
      },
      select: {
        code: true,
        hashLength: true,
        url: true,
        ipfsHash: true,
        signature: true,
      },
    });

    if (!selectedClip) {
      return { notFound: true };
    }
    const additionalDetails = (await getLinkPreview(
      selectedClip.url,
    )) as OEmbed;

    return {
      props: {
        code: selectedClip.code.slice(0, selectedClip.hashLength),
        fullCode: selectedClip.code,
        url: selectedClip.url,
        ipfsHash: selectedClip.ipfsHash,
        signature: selectedClip.signature,
        oembed: {
          title: additionalDetails.title || additionalDetails.siteName || null,
          description: additionalDetails.description || null,
          favicons: additionalDetails.favicons,
        },
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default CodeView;
