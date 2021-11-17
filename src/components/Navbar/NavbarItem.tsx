import Link from 'next/link';
import React from 'react';

type NavbarItemProps = { url: string; name: string };

const NavbarItem: React.FC<NavbarItemProps> = ({ url, name }) => {
  return (
    <Link href={url} passHref>
      <a className="px-3 py-1 font-black cursor-pointer rounded-md text-light-bg dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
        {name}
      </a>
    </Link>
  );
};

export default NavbarItem;
