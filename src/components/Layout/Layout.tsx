import React from "react";

const Layout = (props: any): JSX.Element => {
  return (
    <>
      <div className="flex justify-center align-center bg-black">
        {props.children}
      </div>
    </>
  );
};

export default Layout;
