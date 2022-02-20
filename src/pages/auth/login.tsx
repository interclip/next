import { Layout } from '@components/Layout';
import MetaMaskLoginButton from '@components/Login/web3';
import Logo from '@components/Logo';
import { changeColorBrightness } from '@utils/colors';
import { IS_PROD } from '@utils/constants';
import useHover from '@utils/hooks/useHover';
import { NextApiRequest } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { KeyboardEventHandler, useState } from 'react';
import React from 'react';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

const brandColors = {
  gitlab: '#fc6d26',
  discord: '#7289da',
  google: '#4285f4',
  github: '#4078c0',
  apple: '#000000',
};

const LogIn = ({
  providers,
}: {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}): React.ReactNode => {
  const [inputEmail, setEmail] = useState<string>('');

  const handleDevSignIn = () => {
    const parsedEmail = inputEmail.trim();
    if (isEmail(parsedEmail)) {
      signIn('devlogin', { email: parsedEmail });
    } else {
      toast.error('Invalid email provided');
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      return handleDevSignIn();
    }
  };

  return (
    <Layout titlePrefix="Log in">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 px-8 pb-8 text-black dark:bg-dark-secondary dark:text-dark-text md:h-auto md:w-96 md:rounded-lg md:pt-8">
          <div className="mb-8">
            <Logo width={128} height={128} />
          </div>
          {!IS_PROD && (
            <>
              <span className="mb-4 text-gray-700 dark:text-light-text">
                Log in with email (development only)
              </span>
              <input
                type="text"
                className="mb-4 h-12 w-full rounded-lg px-4 text-lg focus:ring-blue-600 dark:bg-[#222222]"
                autoComplete="email"
                placeholder="Your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                value={inputEmail}
              />
              <button
                className="mb-4 h-12 w-full rounded-lg bg-light-bg font-bold text-white transition hover:bg-blue-600"
                onClick={() => {
                  handleDevSignIn();
                }}
              >
                Login
              </button>
              <span className="mb-4 text-gray-800 dark:text-light-text">
                or
              </span>
            </>
          )}
          {providers &&
            Object.values(providers).map((provider) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [hoverRef, isHovered] = useHover();
              return (
                Object.keys(brandColors).includes(provider.id) &&
                !['devlogin', 'web3'].includes(provider.id) &&
                provider.id && (
                  <button
                    className={
                      'mb-4 h-12 w-full rounded-lg font-bold text-white filter transition'
                    }
                    key={provider.id}
                    style={{
                      backgroundColor: changeColorBrightness(
                        // @ts-ignore
                        brandColors[provider.id],
                        !isHovered ? 0 : -0.15,
                      ),
                    }}
                    onClick={() => signIn(provider.id)}
                    // @ts-ignore
                    ref={hoverRef}
                  >
                    Login with {provider.name}
                  </button>
                )
              );
            })}
          <MetaMaskLoginButton />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const providers = await getProviders();
  const session = await getSession({ req });
  return !session
    ? {
        props: { providers },
      }
    : {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
}

export default LogIn;
