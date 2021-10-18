import React from 'react';
import Link from 'next/link';

const NavbarItem = ({ url, name }: { url?: any; name?: string }) => {
  return (
    <Link href={url} passHref={true}>
      <a className="px-3 py-1 rounded-md font-black cursor-pointer text-light-bg dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
        {name}
      </a>
    </Link>
  );
};

export default NavbarItem;
