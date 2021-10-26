import React from 'react';

const NavbarSection: React.FC = ({ children }) => {
  return (
    <div className="flex items-center space-x-4 dark:bg-dark-secondary">
      {children}
    </div>
  );
};

export default NavbarSection;
