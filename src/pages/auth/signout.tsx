import { Layout } from '@components/Layout';
import { signOut, getSession } from 'next-auth/react';
import Router from 'next/router';
import { NextApiRequest } from 'next';

export default function SignIn(): JSX.Element {
  return (
    <Layout>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-gray-100 text-black w-96 h-auto rounded-lg pt-8 pb-8 px-8 flex flex-col items-center">
          <label className="font-light text-4xl mb-4 font-bolder">
            Interclip
          </label>
          <span className="mb-2">Do you really want to log out?</span>
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
            className="w-full h-12 rounded-lg bg-red-600 text-gray-200 font-semibold hover:bg-blue-700 transition mb-4"
            onClick={() => alert('Cancelled')}
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
    return {};
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}
