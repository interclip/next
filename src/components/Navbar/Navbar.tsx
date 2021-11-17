import Logo from '@components/Logo';
import Link from '@components/Text/link';
import { Menu, Transition } from '@headlessui/react';
import {
  CogIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  LogoutIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { ComponentProps, forwardRef } from 'react';
import { Fragment } from 'react';

import { Button } from '../Button';
import NavbarItem from './NavbarItem';
import NavbarSection from './NavbarSection';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const MenuItem = ({
  title,
  link,
  type,
  onClick,
  children,
  openInNewTab,
}: {
  title: string;
  type: 'button' | 'link';
  link?: string;
  openInNewTab?: boolean;
  onClick?: () => any;
  children: JSX.Element;
}): JSX.Element => {
  const Button = forwardRef<HTMLInputElement, ComponentProps<'button'>>(
    function Button({ ...props }) {
      return <button {...props}>{props.children}</button>;
    },
  );

  const Wrapper = type === 'button' ? Button : Link;
  const additionalProps =
    type === 'link'
      ? { href: link, openInNewTab: openInNewTab || false }
      : { onClick: onClick };
  return (
    <Menu.Item>
      {({ active }) => (
        <Wrapper
          className={`dark:text-light-text py-4 lg:py-2 w-full text-left ${classNames(
            active
              ? 'bg-gray-100 dark:bg-[#4c4c4c] text-gray-900'
              : 'dark:bg-dark-secondary text-gray-700',
            'block px-4',
          )}`}
          {...additionalProps}
        >
          <div className="flex items-center text-xl lg:text-base">
            {children}
            {title}
          </div>
        </Wrapper>
      )}
    </Menu.Item>
  );
};

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="sticky top-0 z-50 flex justify-center w-full h-16 bg-white shadow-lg dark:bg-dark-secondary align-center">
        <div className="flex justify-around w-full max-w-6xl mx-4 md:mx-auto">
          <NavbarSection>
            <Logo height={50} width={50} />
          </NavbarSection>
          <NavbarSection>
            <NavbarItem url="/" name="Clip" />
            <NavbarItem url="/receive" name="Receive" />
            <NavbarItem url="/file" name="File" />
            {session ? (
              <>
                <NavbarItem url="/clips" name="My Clips" />
              </>
            ) : (
              <NavbarItem url="/about" name="About" />
            )}
          </NavbarSection>
          <NavbarSection>
            {session ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button>
                    <Image
                      src={
                        session?.user?.image ||
                        'https://avatar.tobi.sh/name.svg?'
                      }
                      height={50}
                      width={50}
                      alt="Your avatar"
                      className="rounded-full cursor-pointer"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 w-56 mt-2 bg-white shadow-lg origin-top-right rounded-md dark:bg-dark-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem title="Settings" type="link" link="/settings">
                        <CogIcon className="w-5 h-5 mr-2" />
                      </MenuItem>
                      <MenuItem
                        title="Report an issue"
                        type="link"
                        link="https://github.com/interclip/interclip-next/issues/new"
                        openInNewTab={true}
                      >
                        <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                      </MenuItem>
                      <MenuItem
                        title="About Interclip"
                        type="link"
                        link="/about"
                      >
                        <InformationCircleIcon className="w-5 h-5 mr-2" />
                      </MenuItem>
                      <MenuItem
                        title="Sign out"
                        type="button"
                        onClick={() => signOut()}
                      >
                        <LogoutIcon className="w-5 h-5 mr-2" />
                      </MenuItem>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
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
