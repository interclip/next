import React from 'react';
import { Navbar } from '../Navbar';

const Layout = (props: any): JSX.Element => {
  return (
    <>
      <div className="flex flex-col justify-center align-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
        <Navbar />
        {props.children}
      </div>
    </>
  );
};

export default Layout;
