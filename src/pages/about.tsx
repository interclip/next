import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { githubRepo } from '@utils/constants';
import { GIT_COMMIT_SHA } from '@utils/runtimeInfo';
import React from 'react';

import { Layout } from '../components/Layout';

interface AboutProps {
  props: {
    clipCount: number | null;
    version: string;
    GIT_COMMIT_SHA: string;
  };
}

const About = ({
  clipCount,
  version,
  GIT_COMMIT_SHA,
}: AboutProps['props']): JSX.Element => {
  return (
    <Layout titlePrefix="About">
      <main className="flex w-full flex-col items-center" id="maincontent">
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
            <Link href={githubRepo}>GitHub</Link>. The project is mostly written
            in pure PHP and JS, but there are some{' '}
            <Link href="https://docs.interclip.app/legal">
              libraries and designs
            </Link>{' '}
            we use to make it easier upon ourselves.
          </p>
          <H2>Facts about Interclip</H2>
          <ul className="facts">
            <li>
              Release: {version}{' '}
              <Link href={`${githubRepo}/releases/tag/v${version}`}>
                (changelog)
              </Link>
            </li>
            <li>
              Deployed from{' '}
              <Link href={`${githubRepo}/commit/${GIT_COMMIT_SHA}`}>
                <code>{GIT_COMMIT_SHA || 'n/a'}</code>
              </Link>
            </li>
            <li>Total clips made: {clipCount || 'n/a'}</li>

            <Link href="https://vercel.com/?utm_source=interclip&utm_campaign=oss">
              <img
                alt={"Vercel's Logo"}
                src="/icons/powered-by-vercel.svg"
                style={{ height: 50, marginTop: 50 }}
              />
            </Link>
          </ul>
        </div>
      </main>
    </Layout>
  );
};

export async function getStaticProps(): Promise<
  AboutProps | { notFound: boolean }
> {
  try {
    const db = process.env.DATABASE_URL
      ? (await import('@utils/prisma')).db
      : null;
    const clipCount = db && (await db.clip.count());
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;
    return { props: { clipCount, version, GIT_COMMIT_SHA } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default About;
