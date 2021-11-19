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
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex flex-col items-center w-screen h-screen px-8 pb-8 text-black bg-gray-100 dark:bg-dark-secondary dark:text-dark-text md:w-96 md:h-auto md:pt-8 md:rounded-lg pt-[20vh]">
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
            className="w-full h-12 mb-4 font-semibold text-gray-200 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              signOut();
              router.push('/');
            }}
          >
            Log me out
          </button>
          <button
            className="w-full h-12 mb-4 font-semibold text-gray-200 bg-red-600 rounded-lg hover:bg-red-700 transition"
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
  if (session) {
    return { props: {} };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

export default Logout;
