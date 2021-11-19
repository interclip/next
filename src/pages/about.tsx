import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { db } from '@utils/prisma';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CountUp } from 'use-count-up';

import { Layout } from '../components/Layout';

const About = (props: {
  clipCount: number;
  userCount: number;
  version: string;
}): JSX.Element => {
  const [contributorsCount, setContributorsCount] = useState(0);

  useEffect(() => {
    fetch('https://api.github.com/repos/interclip/interclip-next/contributors')
      .then((res) => res.json())
      .then((res) => {
        setContributorsCount(
          res.filter(
            (user: { login: string; id: number }) =>
              !user.login.includes('bot'),
          ).length,
        );
      })
      .catch(() => {
        console.error('There was an error when fetching from github api');
      });
  }, []);

  return (
    <Layout titlePrefix="About">
      <section className="flex flex-col items-center w-full">
        <div className="w-[30em] max-w-[93vw]">
          <H1>About Interclip</H1>
          <H2>What is Interclip?</H2>
          <p>
            Interclip is a handy-dandy clipboard sharing tool to share URLs
            between devices and users. You can read on in my article{' '}
            <Link href="https://docs.interclip.app/#what-is-interclip">
              What even is Interclip
            </Link>{' '}
            or visit{' '}
            <Link href="https://docs.interclip.app/">Interclip's docs</Link> for
            usage guides and many other docs.
          </p>
          <H2>Interclip's code</H2>
          <p>
            Interclip's code is in its entirety published on{' '}
            <Link href="https://github.com/interclip/interclip-next">
              GitHub
            </Link>
            . The project is mostly written in pure PHP and JS, but there are
            some{' '}
            <Link href="https://docs.interclip.app/legal">
              libraries and designs
            </Link>{' '}
            we use to make it easier upon ourselves.
          </p>
          <H2>Facts about Interclip</H2>
          <p className="flex justify-around w-full py-2 mb-2 border-gray-300 border-y dark:border-gray-700">
            <Fact title="Total clips made" value={props.clipCount} />
            <Fact title="Users" value={props.userCount} />
            <Fact title="Contributors" value={contributorsCount} />
          </p>
          <ul className="facts">
            <li>
              Release: {props.version}{' '}
              <Link
                href={`https://github.com/interclip/interclip/releases/tag/v${props.version}`}
              >
                (changelog)
              </Link>
            </li>
          </ul>
          <H2>Mobile app</H2>
          <div className="items-start w-full">
            {' '}
            <div className="relative h-16 m-2">
              <Link href="https://apps.apple.com/cz/app/interclip/id1546777494">
                <Image
                  src="/images/appstore.png"
                  layout="fill"
                  objectFit="scale-down"
                  objectPosition="left"
                  alt="Apple app store"
                />
              </Link>{' '}
            </div>
            <div className="relative h-16 m-2">
              <Link href="https://play.google.com/store/apps/details?id=com.filiptronicek.iclip">
                <Image
                  src="/images/googleplay.webp"
                  layout="fill"
                  objectFit="scale-down"
                  objectPosition="left"
                  alt="Google play"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const Fact = ({
  title,
  value,
}: {
  title: string;
  value: number;
}): JSX.Element => {
  return (
    <div className="w-full text-center cursor-pointer">
      <h3 className="font-sans text-3xl font-semibold">
        <CountUp isCounting end={value} duration={1.4} />
      </h3>
      {title}
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const clipCount = await db.clip.count();
    const userCount = await db.user.count();
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;
    return { props: { clipCount, userCount, version } };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default About;
