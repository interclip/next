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
      <section className="my-auto h-full">
        <div className="shadow-custom mb-8 flex rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="">
            <Image
              alt="Social preview image"
              src={proxied(
                'https://opengraph.githubassets.com/00c3274228fa5ac12295ba4d6a3ca5881adf682ab038d8988f1713099c7ecc28/interclip/interclip-next',
                1200,
                600,
              )}
              width={600}
              className="rounded-xl"
              height={300}
            />
            <h2 className="mt-2 mb-2 max-w-[40rem] text-2xl">
              {oembed.title || code}
            </h2>
            <h3 className="flex flex-row items-center justify-center justify-items-center gap-2 text-xl text-gray-400">
              {oembed.favicons.length > 0 && (
                <Image
                  src={`${proxied(
                    getBestFavicon(oembed.favicons)!,
                    300,
                    300,
                  )}}`}
                  alt="The site's favicon"
                  width={32}
                  height={32}
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
  const isPreviewPage = userCode.indexOf('+') === userCode.length - 1;
  if (userCode && typeof userCode === 'object') {
    return { notFound: true };
  }

  if (isPreviewPage) {
    try {
      const selectedClip = await db.clip.findFirst({
        where: {
          code: {
            startsWith: userCode.slice(0, -1),
          },
        },
      });

      if (!selectedClip) {
        return { notFound: true };
      }
      const additionalDetails = await storeLinkPreviewInCache(selectedClip.url);

      return {
        props: {
          code: selectedClip.code,
          url: selectedClip.url,
          oembed: {
            title: additionalDetails?.title || null,
            description: additionalDetails?.description || null,
            favicons: additionalDetails?.favicons,
          },
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
    const selectedClip = await db.clip.findUnique({
      where: { code: userCode },
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
