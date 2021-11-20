import { QRIcon } from '@components/Icons';
import { Layout } from '@components/Layout';
import QRModal from '@components/shared/QRModal';
import { NextApiRequest } from 'next';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import WebTorrent from 'webtorrent';

const Redirect = ({ hash }: { hash: string }) => {
  const [qrCodeZoom, setQrCodeZoom] = useState<boolean>(false);
  useEffect(() => {
    if (WebTorrent.WEBRTC_SUPPORT) {
      // WebRTC is supported
      const client = new WebTorrent();

      client.add(
        'magnet:?xt=urn:btih:ced304fa232aaf44fb804b8ac9f891f15702ce42&dn=DSC00014.JPG&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
        (torrent: WebTorrent.Torrent) => {
          // Got torrent metadata!
          console.log('Client is downloading:', torrent.infoHash);
          torrent.files.forEach((file) => {
            console.log(file.name);
            file.getBlobURL((err, url) => {
              if (err) throw err;
              if (!url) return;
              const a = document.createElement('a');
              a.download = file.name;
              a.href = url;
              a.textContent = 'Download ' + file.name;
              document.body.appendChild(a);
            });
          });
        },
      );
    } else {
      // Use a fallback
      toast.error('WebRTC is not supported');
    }
  }, [hash]);
  return (
    <Layout>
      <section className="h-full my-auto">
        <div className="flex p-4 mb-8 text-black bg-white rounded-2xl dark:text-white dark:bg-[#262A2B] shadow-custom">
          <div className="mr-6">
            <h2 className="mb-2 text-4xl max-w-[30rem]">{hash}</h2>
            <h3 className="text-2xl text-gray-400">{hash}</h3>
          </div>
          <div className="flex flex-col items-center">
            <QRIcon
              onClick={() => {
                setQrCodeZoom(true);
              }}
            />
          </div>
          {qrCodeZoom && <QRModal url={hash} setQrCodeZoom={setQrCodeZoom} />}
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
  const hash = query.hash;
  return {
    props: {
      hash,
    },
  };
}

export default Redirect;
