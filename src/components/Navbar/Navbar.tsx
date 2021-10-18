import React from 'react';
import NavbarItem from './NavbarItem';
import { Button } from '../Button';
import Image from 'next/image';
import NavbarSection from './NavbarSection';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="bg-white h-16 w-full shadow-lg sticky top-0 z-50 flex justify-center align-center">
        <div className="md:container md:mx-auto flex justify-around">
          <NavbarSection>
            <Image
              src="/images/Interclip.svg"
              alt="Interclip logo"
              width={50}
              height={50}
            />
          </NavbarSection>
          <NavbarSection>
            <NavbarItem url="/" name="Clip" />
            <NavbarItem url="/receive" name="Receive" />
            <NavbarItem url="/file" name="File" />
            <NavbarItem url="/about" name="About" />
          </NavbarSection>
          <NavbarSection>
            {session ? (
              <Image
                src="https://avatar.tobi.sh/name.svg?"
                height={50}
                width={50}
                className="rounded-full cursor-pointer"
                onClick={() => signOut()}
              />
            ) : (
              <Button
                content="Login"
                background_color="light-bg"
                hover_color="blue-600"
                focus_ring_color="blue-400"
                onClick={() => signIn()}
              />
            )}
          </NavbarSection>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
