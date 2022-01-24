import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ClipWithPreview } from 'src/typings/interclip';
dayjs.extend(relativeTime);

const ClipCard = ({ clip }: { clip: ClipWithPreview }) => {
  const shortCode = clip.code.slice(0, clip.hashLength);
  return (
    <Link href={`/new/${shortCode}`} passHref>
      <div
        className="h-full max-w-none cursor-pointer rounded-2xl bg-white p-6 tracking-wide shadow-lg hover:scale-[0.99] dark:bg-dark-secondary dark:text-dark-text sm:max-w-sm"
        tabIndex={0}
      >
        <div className="mb-4 flex items-center">
          <div className="sm leading-5">
            <h4 className="flex flex-row items-center gap-2 text-xl font-semibold text-gray-800 dark:text-dark-text">
              {clip.oembed?.title || `Code: ${shortCode}`}{' '}
              {clip.ipfsHash && (
                <Image
                  title="Backed up to IPFS"
                  alt="IPFS logo"
                  src={'/images/ipfs-logo.svg'}
                  width={20}
                  height={20}
                />
              )}
            </h4>
            <h5 className="font-semibold text-blue-600">
              Created {dayjs().to(dayjs(clip.createdAt))}
            </h5>
          </div>
        </div>
        <span className="break-words italic text-gray-600 dark:text-dark-text">
          {clip.url}
        </span>
      </div>
    </Link>
  );
};

export default ClipCard;
