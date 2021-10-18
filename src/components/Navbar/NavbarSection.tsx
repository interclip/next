import React from 'react';

const NavbarSection = (props: any): JSX.Element => {
  return <div className="flex items-center space-x-4"> {props.children}</div>;
};

export default NavbarSection;
