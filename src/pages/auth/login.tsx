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
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-gray-100 dark:bg-dark-secondary dark:text-dark-text text-black w-screen h-screen md:w-96 md:h-auto md:pt-8 md:rounded-lg pb-8 px-8 flex flex-col justify-center items-center">
          <div className="mb-8">
            <Logo width={128} height={128} />
          </div>
          {!IS_PROD && (
            <>
              <span className="text-gray-700 dark:text-light-text mb-4">
                Log in with email (development only)
              </span>
              <input
                type="text"
                className="w-full h-12 rounded-lg px-4 text-lg focus:ring-blue-600 mb-4 dark:bg-[#222222]"
                autoComplete="email"
                placeholder="Your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={inputEmail}
              />
              <button
                className="w-full h-12 rounded-lg bg-light-bg text-white font-bold hover:bg-blue-600 transition mb-4"
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
              <span className="text-gray-800 dark:text-light-text mb-4">
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
