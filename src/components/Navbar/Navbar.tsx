import React from 'react';
import NavbarItem from './NavbarItem';
import { Button } from '../Button';
import Image from 'next/image';
import NavbarSection from './NavbarSection';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="bg-white dark:bg-[#262626] h-16 w-full shadow-lg sticky top-0 z-50 flex justify-center align-center">
        <div className="w-full max-w-6xl md:mx-auto mx-4 flex justify-around">
          <NavbarSection>
            <Link href="/">
              <Image
                src="/images/Interclip.svg"
                alt="Interclip logo"
                className="cursor-pointer"
                width={50}
                height={50}
              />
            </Link>
          </NavbarSection>
          <NavbarSection>
            <NavbarItem url="/" name="Clip" />
            <NavbarItem url="/receive" name="Receive" />
            <NavbarItem url="/file" name="File" />
            <NavbarItem url="/about" name="About" />
            {session && (
              <>
                <NavbarItem url="/clips" name="My Clips" />
                <NavbarItem url="/settings" name="Settings" />
              </>
            )}
          </NavbarSection>
          <NavbarSection>
            {session ? (
              <Image
                src={session?.user?.image || 'https://avatar.tobi.sh/name.svg?'}
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
