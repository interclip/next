import { Layout } from '@components/Layout';
import Logo from '@components/Logo';
import { changeColorBrightness } from '@utils/colors';
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
import { useState } from 'react';
import React from 'react';
import toast from 'react-hot-toast';
import isEmail from 'validator/lib/isEmail';

import { IS_PROD } from '../../lib/constants';

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
  return (
    <Layout titlePrefix="Log in">
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center justify-center w-screen h-screen px-8 pb-8 text-black bg-gray-100 dark:bg-dark-secondary dark:text-dark-text md:w-96 md:h-auto md:pt-8 md:rounded-lg">
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
                className="w-full h-12 px-4 mb-4 text-lg rounded-lg focus:ring-blue-600 dark:bg-[#222222]"
                autoComplete="email"
                placeholder="Your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={inputEmail}
              />
              <button
                className="w-full h-12 mb-4 font-bold text-white rounded-lg bg-light-bg hover:bg-blue-600 transition"
                onClick={() => {
                  if (isEmail(inputEmail)) {
                    signIn('credentials', { email: inputEmail });
                  } else {
                    toast.error('Invalid email provided');
                  }
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
                provider.id !== 'credentials' &&
                provider.id && (
                  <button
                    className={
                      'w-full h-12 rounded-lg text-white font-bold transition mb-4 filter'
                    }
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
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const providers = await getProviders();
  const session = await getSession({ req });
  if (!session) {
    return {
      props: { providers },
    };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

export default LogIn;
