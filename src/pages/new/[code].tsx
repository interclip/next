import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import Link from '@components/Text/link';
import getBestFavicon from '@utils/highestResolutionFavicon';
import { db } from '@utils/prisma';
import truncate from '@utils/smartTruncate';
import { getLinkPreview } from 'link-preview-js';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { OEmbed } from 'src/typings/interclip';

const CodeView = ({
  code,
  url,
  oembed,
  codeLength,
}: {
  code: string;
  url: string;
  oembed: OEmbed;
  codeLength: number;
}) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const urlObject = new URL(url);
  const simplifiedURL = truncate(urlObject, 40);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center w-full h-full max-w-2xl pt-[100px]">
        <div className="flex p-4 mb-8 text-black bg-white rounded-2xl dark:text-white dark:bg-[#262A2B] shadow-custom">
          <div className="mr-6">
            <h2 className="mx-auto mb-2 text-4xl text-center">
              Created clip with code:{' '}
              <div
                className="flex items-center justify-center cursor-pointer"
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
                <span>{code.slice(0, codeLength)}</span>
                <svg
                  className="w-10 h-10 ml-2"
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
        <div className="flex justify-between w-full p-4 mb-8 text-black bg-white rounded-2xl dark:text-white dark:bg-[#262A2B] shadow-custom">
          <div className="mr-6">
            <h2 className="mb-2 text-4xl max-w-[30rem]">
              {oembed.title || code}
            </h2>
            <h3 className="text-2xl text-gray-400">
              <Link className="no-underline" href={url} title={url}>
                {simplifiedURL}
              </Link>
            </h3>
            <p>
              {console.log(oembed.description?.length)}
              {oembed.description?.substr(0, 250)}
              {(oembed.description?.length ?? 0) > 250 && '...'}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {oembed.favicons.length > 0 && (
              <Image
                src={`https://images.weserv.nl/?url=${getBestFavicon(
                  oembed.favicons,
                )}&w=300&h=300`}
                alt="The site's favicon"
                className="rounded"
                width={72}
                height={72}
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
  if (userCode && typeof userCode === 'object') {
    return { notFound: true };
  }

  try {
    const selectedClip = await db.clip.findUnique({
      where: { code: userCode },
      select: { code: true, hashLength: true, url: true },
    });

    if (!selectedClip) {
      return { notFound: true };
    }
    const additionalDetails = (await getLinkPreview(
      selectedClip.url,
    )) as OEmbed;

    return {
      props: {
        code: selectedClip.code,
        codeLength: selectedClip.hashLength,
        url: selectedClip.url,
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
