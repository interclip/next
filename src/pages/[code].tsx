import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import Link from '@components/Text/link';
import { storeLinkPreviewInCache } from '@utils/clipPreview';
import getBestFavicon from '@utils/highestResolutionFavicon';
import { proxied } from '@utils/image';
import { db } from '@utils/prisma';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import { OEmbed } from 'src/typings/interclip';

const Redirect = ({
  code,
  url,
  returnedOembed,
}: {
  code: string;
  url: string;
  returnedOembed: string;
}) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const oembed: OEmbed = returnedOembed && JSON.parse(returnedOembed);
  const urlObject = new URL(url);
  const simplifiedURL = `${urlObject.hostname}${urlObject.pathname}`;
  return (
    <Layout titlePrefix={code}>
      <main className="my-auto h-full" id="maincontent">
        <div className="shadow-custom mb-8 flex rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="">
            <Image
              alt="Social preview image"
              className="rounded-xl"
              height={300}
              src={proxied(
                'https://opengraph.githubassets.com/00c3274228fa5ac12295ba4d6a3ca5881adf682ab038d8988f1713099c7ecc28/interclip/interclip-next',
                1200,
                600,
              )}
              width={600}
            />
            <h2 className="mt-2 mb-2 max-w-[40rem] text-2xl">
              {(oembed && oembed.title) || code}
            </h2>
            <h3 className="flex flex-row items-center justify-center justify-items-center gap-2 text-xl text-gray-400">
              {oembed && oembed.favicons.length > 0 && (
                <Image
                  alt="The site's favicon"
                  height={32}
                  src={`${proxied(
                    getBestFavicon(oembed.favicons)!,
                    300,
                    300,
                  )}}`}
                  width={32}
                />
              )}
              <Link className="no-underline" href={url}>
                {simplifiedURL}
              </Link>
              <QRIcon
                onClick={() => {
                  setQrCodeZoom(true);
                }}
              />
            </h3>
          </div>
          {qrCodeZoom && <QRModal setQrCodeZoom={setQrCodeZoom} url={url} />}
        </div>
      </main>
    </Layout>
  );
};

export async function getServerSideProps({
  query,
}: {
  query: NextApiRequest['query'];
}) {
  let userCode = query.code;

  if (userCode && typeof userCode === 'object') {
    return { notFound: true };
  }
  const isPreviewPage = userCode.endsWith('+');

  if (isPreviewPage) {
    userCode = userCode.slice(0, -1);
    try {
      const selectedClip = await db.clip.findFirst({
        where: {
          code: {
            startsWith: userCode,
          },
        },
      });

      if (!selectedClip) {
        return { notFound: true };
      }

      const additionalDetails = process.env.REDIS_HOST
        ? await storeLinkPreviewInCache(selectedClip.url)
        : null;

      return {
        props: {
          code: selectedClip.code.slice(0, selectedClip.hashLength),
          url: selectedClip.url,
          oembed: JSON.stringify(additionalDetails),
        },
      };
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }
  }

  try {
    const selectedClip = await db.clip.findFirst({
      where: { code: { startsWith: userCode } },
    });
    if (!selectedClip) {
      return { notFound: true };
    }
    return {
      redirect: {
        destination: selectedClip.url,
        permanent: true,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Redirect;
