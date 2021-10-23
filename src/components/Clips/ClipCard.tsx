import Link from 'next/link';

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const ClipCard = ({ clip }: { clip: Clip }) => {
  const relativeTimeDiff = dayjs().to(dayjs(clip.createdAt));

  return (
    <Link href={`/${clip.code}+`} passHref>
      <div className="max-w-sm bg-white border-2 cursor-pointer border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
        <>
          <div id="header" className="flex items-center mb-4">
            <div id="header-text" className="leading-5 sm">
              <h4 id="name" className="text-xl font-semibold text-gray-800">
                Code: {clip.code}
              </h4>
              <h5 id="job" className="font-semibold text-blue-600">
                Created {relativeTimeDiff}
              </h5>
            </div>
          </div>
          <div id="quote">
            <span className="italic break-words text-gray-600">{clip.url}</span>
          </div>
        </>
      </div>
    </Link>
  );
};

export default ClipCard;
