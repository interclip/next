import React from 'react';
import Image from 'next/image';

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-full h-[4em] bg-white shadow-lg flex align-center">
      <div className="flex align-center w-full container">
        <Image
          src="/images/Interclip.svg"
          alt="Interclip logo"
          width={50}
          height={50}
        />
      </div>
    </nav>
  );
};

export default Navbar;
