import React, { useState } from 'react';
import { Layout } from '@components/Layout';
import { db } from '@utils/prisma';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import QRModal from '@components/shared/QRModal';
import { QRIcon } from '@components/Icons';
import { Link } from '@components/Text/link';
import { getLinkPreview } from 'link-preview-js';
import getBestFavicon from '@utils/highestResolutionFavicon';

interface OEmbed {
  url: string;
  title: string;
  siteName: string | null;
  description: string | null;
  mediaType: string;
  contentType: string | null;
  images: string[];
  videos: {}[];
  favicons: string[];
}

const Redirect = ({
  code,
  url,
  oembed,
}: {
  code: string;
  url: string;
  oembed: OEmbed;
}) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const urlObject = new URL(url);
  const simplifiedURL = `${urlObject.hostname}${urlObject.pathname}`;
  return (
    <Layout>
      <section className="w-full h-full flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl mb-8 flex text-black dark:text-white bg-white dark:bg-[#262A2B] shadow-custom">
          <div className="mr-6">
            <h2 className="text-4xl mb-2 max-w-[30rem]">
              {oembed.title || code}
            </h2>
            <h3 className="text-2xl text-gray-400">
              <Link className="no-underline" href={url}>
                {simplifiedURL}
              </Link>
            </h3>
          </div>
          <div className="flex flex-col items-center">
            {oembed.favicons.length > 0 && (
              <Image
                src={`https://images.weserv.nl/?url=${getBestFavicon(
                  oembed.favicons,
                )}&w=300&h=300`}
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
        <div className="p-4 rounded-2xl mb-8 flex text-black dark:text-white bg-white dark:bg-[#262A2B] shadow-custom">
          <div className="mr-6">
            <h2 className="text-4xl mb-2 text-center mx-auto">Code: {code}</h2>
          </div>
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

export default Redirect;
