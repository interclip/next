import React from 'react';

const NavbarSection: React.FC = ({ children }) => {
  return <div className="flex items-center space-x-4"> {children}</div>;
};

export default NavbarSection;
