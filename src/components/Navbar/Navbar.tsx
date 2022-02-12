import Logo from '@components/Logo';
import Avatar from '@components/shared/Avatar';
import Link from '@components/Text/link';
import { Menu, Transition } from '@headlessui/react';
import {
  CogIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  LogoutIcon,
} from '@heroicons/react/solid';
import { githubRepo } from '@utils/constants';
import clsx from 'clsx';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { ComponentProps, forwardRef, Fragment } from 'react';

import { Button } from '../Button';
import NavbarItem from './NavbarItem';
import NavbarSection from './NavbarSection';
import { User } from '.prisma/client';

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
          className={`w-full py-4 text-left dark:text-light-text lg:py-2 ${clsx(
            active
              ? 'bg-gray-100 text-gray-900 dark:bg-[#4c4c4c]'
              : 'text-gray-700 dark:bg-dark-secondary',
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
      <nav className="align-center sticky top-0 z-50 flex h-16 w-full justify-center bg-white shadow-lg dark:bg-dark-secondary">
        <div className="mx-4 flex w-full max-w-6xl justify-around md:mx-auto">
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
                    <Avatar user={session.user as User} size={50} />
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
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-secondary">
                    <div className="py-1">
                      <MenuItem title="Settings" type="link" link="/settings">
                        <CogIcon className="mr-2 h-5 w-5" />
                      </MenuItem>
                      <MenuItem
                        title="Report an issue"
                        type="link"
                        link={`${githubRepo}/issues/new`}
                        openInNewTab={true}
                      >
                        <ExclamationCircleIcon className="mr-2 h-5 w-5" />
                      </MenuItem>
                      <MenuItem
                        title="About Interclip"
                        type="link"
                        link="/about"
                      >
                        <InformationCircleIcon className="mr-2 h-5 w-5" />
                      </MenuItem>
                      <MenuItem
                        title="Sign out"
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                      >
                        <LogoutIcon className="mr-2 h-5 w-5" />
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
