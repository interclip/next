import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React from 'react';
import { ClipWithPreview } from 'src/typings/interclip';
dayjs.extend(relativeTime);

const ClipCard = ({ clip }: { clip: ClipWithPreview }) => {
  const shortCode = clip.code.slice(0, clip.hashLength);
  return (
    <Link href={`/new/${shortCode}`} passHref>
      <div className="h-full p-6 tracking-wide bg-white shadow-lg cursor-pointer max-w-none sm:max-w-sm dark:bg-dark-secondary dark:text-dark-text rounded-2xl hover:scale-[0.99]">
        <div className="flex items-center mb-4">
          <div className="leading-5 sm">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
              {clip.oembed?.title || `Code: ${shortCode}`}
            </h4>
            <h5 className="font-semibold text-blue-600">
              Created {dayjs().to(dayjs(clip.createdAt))}
            </h5>
          </div>
        </div>
        <span className="italic text-gray-600 break-words dark:text-dark-text">
          {clip.url}
        </span>
      </div>
    </Link>
  );
};

export default ClipCard;
