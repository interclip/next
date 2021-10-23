import PageHead from '@components/Head';
import React from 'react';
import { Navbar } from '../Navbar';

const Layout: React.FC<{ titlePrefix?: string }> = ({
  children,
  titlePrefix,
}): JSX.Element => {
  return (
    <>
      <PageHead titlePrefix={titlePrefix} />
      <div className="flex flex-col items-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text pb-8 h-full min-h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
