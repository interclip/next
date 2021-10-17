import React from 'react';
<<<<<<< HEAD
import { Navbar } from '../Navbar';

const Layout = (props: any): JSX.Element => {
  return (
    <>
      <div className="flex flex-col justify-center align-center">
        <Navbar />
        {props.children}
      </div>
    </>
=======

const Layout = (props: any): JSX.Element => {
  return (
    <div className="flex justify-center align-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
      {props.children}
    </div>
>>>>>>> 8cdbada4d522244e4fba7dc2756e3b6c289c24b4
  );
};

export default Layout;
