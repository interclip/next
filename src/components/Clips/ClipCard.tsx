import Link from 'next/link';

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const ClipCard = ({ clip }: { clip: Clip }) => {
  const relativeTimeDiff = dayjs().to(dayjs(clip.createdAt));

  return (
    <Link href={`/${clip.code}+`}>
      <a href={`/${clip.code}+`}>
        <div className="max-w-none sm:max-w-sm bg-white dark:bg-dark-secondary dark:text-dark-text border-2 cursor-pointer border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
          <>
            <div className="flex items-center mb-4">
              <div className="leading-5 sm">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
                  Code: {clip.code}
                </h4>
                <h5 className="font-semibold text-blue-600">
                  Created {relativeTimeDiff}
                </h5>
              </div>
            </div>
            <div>
              <span className="italic break-words text-gray-600 dark:text-dark-text">
                {clip.url}
              </span>
            </div>
          </>
        </div>
      </a>
    </Link>
  );
};

export default ClipCard;
