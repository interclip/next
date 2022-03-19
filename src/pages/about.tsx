import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { githubRepo } from '@utils/constants';
import React from 'react';

import { Layout } from '../components/Layout';

const About = (props: {
  clipCount: number | null;
  version: string;
}): JSX.Element => {
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
              Release: {props.version}{' '}
              <Link href={`${githubRepo}/releases/tag/v${props.version}`}>
                (changelog)
              </Link>
            </li>
            <li>Total clips made: {props.clipCount || 'n/a'}</li>

            <Link href="https://vercel.com/?utm_source=interclip&utm_campaign=oss">
              <img
                style={{ height: 50, marginTop: 50 }}
                src="/icons/powered-by-vercel.svg"
                alt={"Vercel's Logo"}
              />
            </Link>
          </ul>
        </div>
      </main>
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    const db = process.env.DATABASE_URL
      ? (await import('@utils/prisma')).db
      : null;
    const clipCount = db && (await db.clip.count());
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;
    return { props: { clipCount, version } };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default About;
