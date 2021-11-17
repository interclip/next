import PageHead from '@components/Head';
import { NextSeo } from 'next-seo';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import { Navbar } from '../Navbar';

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
      <div className="flex flex-col items-center h-full min-h-screen pb-8 bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
