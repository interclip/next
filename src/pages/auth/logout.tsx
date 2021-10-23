import { Layout } from '@components/Layout';
import { signOut, getSession } from 'next-auth/react';
import Router from 'next/router';
import { NextApiRequest } from 'next';
import Image from 'next/image';

export default function Logout(): JSX.Element {
  return (
    <Layout>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-gray-100 text-black w-screen h-screen md:w-96 md:h-auto md:pt-8 md:rounded-lg pt-[20vh] pb-8 px-8 flex flex-col items-center">
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
            className="w-full h-12 rounded-lg bg-blue-600 text-gray-200 font-semibold hover:bg-blue-700 transition mb-4"
            onClick={() => {
              signOut();
              Router.push('/');
            }}
          >
            Log me out
          </button>
          <button
            className="w-full h-12 rounded-lg bg-red-600 text-gray-200 font-semibold hover:bg-red-700 transition mb-4"
            onClick={() => Router.push('/')}
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
}

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
