import Link from 'next/link';
import React from 'react';

type NavbarItemProps = { url: string; name: string };

const NavbarItem: React.FC<NavbarItemProps> = ({ url, name }) => {
  return (
    <Link href={url} className="cursor-pointer rounded-md px-3 py-1 font-black text-light-bg hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
      {name}
    </Link>
  );
};

export default NavbarItem;
