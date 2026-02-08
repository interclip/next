import PageHead from '@components/Head';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Navbar } from '../Navbar';

const Layout: React.FC<{
  titlePrefix?: string;
  children: React.ReactNode;
}> = ({ children, titlePrefix }) => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="The next generation of sharing files and links with anyone."
        />
      </Head>
      <PageHead titlePrefix={titlePrefix} />
      <Toaster />
      <a
        className="absolute top-[-100px] left-0 z-[100] bg-black p-[8px] text-white focus:top-0"
        href="#maincontent"
      >
        Skip to main
      </a>

      <div className="flex h-full min-h-screen flex-col items-center bg-light-bg pb-8 text-light-text dark:bg-dark-bg dark:text-dark-text">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
