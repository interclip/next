import PageHead from '@components/Head';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../Navbar';
import { NextSeo } from 'next-seo';

const Layout: React.FC<{ titlePrefix?: string }> = ({
  children,
  titlePrefix,
}): JSX.Element => {
  return (
    <>
      <NextSeo
        title={`${titlePrefix && `${titlePrefix} |`} Interclip`}
        description="The next generation of sharing files and links with anyone."
      />
      <PageHead titlePrefix={titlePrefix} />
      <Toaster />
      <div className="flex flex-col items-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text pb-8 h-full min-h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
