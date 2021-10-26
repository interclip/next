import Link from 'next/link';

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const ClipCard = ({ clip }: { clip: ClipWithPreview }) => {
  return (
    <Link href={`/new/${clip.code}`} passHref>
      <div className="max-w-none sm:max-w-sm bg-white dark:bg-dark-secondary dark:text-dark-text cursor-pointer h-full p-6 rounded-2xl tracking-wide shadow-lg hover:scale-[0.99]">
        <div className="flex items-center mb-4">
          <div className="leading-5 sm">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
              {clip.oembed?.title || `Code: ${clip.code}`}
            </h4>
            <h5 className="font-semibold text-blue-600">
              Created {dayjs().to(dayjs(clip.createdAt))}
            </h5>
          </div>
        </div>
        <span className="italic break-words text-gray-600 dark:text-dark-text">
          {clip.url}
        </span>
      </div>
    </Link>
  );
};

export default ClipCard;
