import { Layout } from '@components/Layout';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getSession, signOut } from 'next-auth/react';
import React from 'react';

const Logout = (): React.ReactNode => {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-screen w-screen flex-col items-center bg-gray-100 px-8 pb-8 pt-[20vh] text-black dark:bg-dark-secondary dark:text-dark-text md:h-auto md:w-96 md:rounded-lg md:pt-8">
          <div className="mb-4">
            <Image
              src="/images/Interclip.svg"
              alt="Interclip's logo"
              width={128}
              height={128}
            />
          </div>
          <span className="mb-8 text-xl">Do you really want to log out?</span>
          <button
            className="mb-4 h-12 w-full rounded-lg bg-blue-600 font-semibold text-gray-200 transition hover:bg-blue-700"
            onClick={() => {
              signOut();
              router.push('/');
            }}
          >
            Log me out
          </button>
          <button
            className="mb-4 h-12 w-full rounded-lg bg-red-600 font-semibold text-gray-200 transition hover:bg-red-700"
            onClick={() => {
              router.push('/');
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req }: { req: NextApiRequest }) {
  const session = await getSession({ req });
  return session
    ? { props: {} }
    : {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
}

export default Logout;
