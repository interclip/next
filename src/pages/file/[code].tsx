import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import { APIError, getClip } from '@utils/api/client/requestClip';
import { NextApiRequest } from 'next';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import isMagnetURI from 'validator/lib/isMagnetURI';
import WebTorrent from 'webtorrent';

function download(fileUrl: string, fileName?: string) {
  const a = document.createElement('a');
  a.href = fileUrl;
  a.setAttribute('download', fileName || 'file');
  a.click();
}

const DownloadP2PFile = ({ code }: { code: string }) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  const [progressingTorrent, setProgressingTorrent] =
    useState<null | WebTorrent.Torrent>(null);
  useEffect(() => {
    (async () => {
      if (WebTorrent.WEBRTC_SUPPORT) {
        try {
          const clipMagnet = await getClip(code);

          if (!clipMagnet) {
            toast.error('This clip does not exist');
            return;
          }

          if (clipMagnet.status === 'error') {
            toast.error(`Error getting the clip ${clipMagnet.result}`);
            return;
          }

          if (clipMagnet && !isMagnetURI(clipMagnet.result.url)) {
            toast.error(
              `It looks like this clip isn't a torrent! ${clipMagnet.result.url}`,
            );
            return;
          }

          const client = new WebTorrent();
          client.add(clipMagnet.result.url, (torrent: WebTorrent.Torrent) => {
            // Got torrent metadata!
            console.log('Client is downloading:', torrent.infoHash);
            for (const file of torrent.files) {
              console.log(file.name);
              const interval = setInterval(() => {
                console.log(
                  `Progress: ${(torrent.progress * 100).toFixed(1)}%`,
                );
                setProgressingTorrent(torrent);
              }, 200);

              torrent.on('done', () => {
                console.log('Progress: 100%');
                clearInterval(interval);
              });
              file.getBlobURL((err, url) => {
                if (err) throw err;
                if (!url) return;
                download(url, file.name);
              });
            }
          });
        } catch (error) {
          if (error instanceof APIError) {
            toast.error(`API request failed: ${error.message}`);
          } else {
            toast.error(error as string);
          }
        }
      } else {
        toast.error('WebRTC is not supported');
      }
    })();
  }, [code]);
  return (
    <Layout>
      <section className="my-auto h-full">
        <div className="shadow-custom mb-8 flex rounded-2xl bg-white p-4 text-black dark:bg-[#262A2B] dark:text-white">
          <div className="mr-6">
            <h2 className="mb-2 max-w-[30rem] text-4xl">
              {progressingTorrent?.name || code}
            </h2>
            <h3 className="text-2xl text-gray-400">
              {progressingTorrent &&
                (progressingTorrent.progress * 100).toFixed(1)}
              %
            </h3>
          </div>
          <div className="flex flex-col items-center">
            <QRIcon
              onClick={() => {
                setQrCodeZoom(true);
              }}
            />
          </div>
          {qrCodeZoom && (
            <QRModal
              setQrCodeZoom={setQrCodeZoom}
              url={progressingTorrent?.magnetURI || ''}
            />
          )}
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
  const code = query.code;
  return {
    props: {
      code,
    },
  };
}

export default DownloadP2PFile;
