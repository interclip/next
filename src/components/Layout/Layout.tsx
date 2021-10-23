import PageHead from '@components/Head';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '../Navbar';

const Layout: React.FC<{ titlePrefix?: string }> = ({
  children,
  titlePrefix,
}): JSX.Element => {
  return (
    <>
      <PageHead titlePrefix={titlePrefix} />
      <Toaster />
      <div className="flex flex-col items-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
