import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { db } from '@utils/prisma';
import React from 'react';

import { Layout } from '../components/Layout';

const About = (props: { clipCount: number; version: string }): JSX.Element => {
  return (
    <Layout titlePrefix="About">
      <section className="w-full flex flex-col items-center">
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
          <ul className="facts">
            <li>
              Release: {props.version}{' '}
              <Link
                href={`https://github.com/interclip/interclip/releases/tag/v${props.version}`}
              >
                (changelog)
              </Link>
            </li>
            <li>Total clips made: {props.clipCount}</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const clipCount = await db.clip.count();
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;
    return { props: { clipCount, version } };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default About;
