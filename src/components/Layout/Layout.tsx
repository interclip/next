import React from 'react';

const Layout = (props: any): JSX.Element => {
  return (
    <>
      <div className="flex justify-center align-center bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
        {props.children}
      </div>
    </>
  );
};

export default Layout;
