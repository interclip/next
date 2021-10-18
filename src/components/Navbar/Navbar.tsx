import React from 'react';
import Link from 'next/link';
import NavbarItem from './NavbarItem';
import { Button } from '../Button';
import Image from 'next/image';
import NavbarSection from './NavbarSection';

const Navbar = () => {
  return (
    <>
      <nav className="bg-white h-16 w-full shadow-lg sticky top-0 z-50 flex justify-center align-center">
        <div className="w-full max-w-6xl md:mx-auto mx-4 flex justify-around">
          <NavbarSection>
            <Link href="/">
              <Image
                src="/images/Interclip.svg"
                alt="Interclip logo"
                width={50}
                height={50}
              />
            </Link>
          </NavbarSection>
          <NavbarSection>
            <NavbarItem url="/" name="Clip" />
            <NavbarItem url="/dashboard" name="Receive" />
            <NavbarItem url="/dashboard" name="File" />
            <NavbarItem url="/about" name="About" />
          </NavbarSection>
          <NavbarSection>
            <Button
              content="Login"
              background_color="light-bg"
              hover_color="blue-600"
              focus_ring_color="blue-400"
              url="/"
            />
          </NavbarSection>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
