import { H1, H2 } from '@components/Text/headings';
import type { NextPage } from 'next';
import { Link } from '@components/Text/link';
import React from 'react';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
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
              Latest release: 0.420.0{' '}
              <Link href="https://github.com/interclip/interclip/releases/tag/v1.0">
                (changelog)
              </Link>
            </li>
            <li>Total clips made: 69</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
