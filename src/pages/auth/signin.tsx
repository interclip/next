import { Layout } from '@components/Layout';
import { getProviders, signIn } from 'next-auth/react';
import useHover from '@utils/hooks/useHover';

const brandColors = {
  gitlab: '#fc6d26',
  discord: '#7289da',
  google: '#4285f4',
  github: '#4078c0',
  apple: '#000000',
};

function changeBrightness(color: string, luminosity: number) {
  color = new String(color).replace(/[^0-9a-f]/gi, '');
  if (color.length < 6) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  luminosity = luminosity || 0;

  let newColor = '#',
    c,
    i,
    black = 0,
    white = 255;
  for (i = 0; i < 3; i++) {
    c = parseInt(color.substr(i * 2, 2), 16);
    c = Math.round(
      Math.min(Math.max(black, c + luminosity * white), white),
    ).toString(16);
    newColor += ('00' + c).substr(c.length);
  }
  return newColor;
}

export default function SignIn({ providers }: { providers: any }): JSX.Element {
  return (
    <Layout>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-gray-100 text-black w-96 h-auto rounded-lg pt-8 pb-8 px-8 flex flex-col items-center">
          <label className="font-light text-4xl mb-4 font-bolder">
            Interclip
          </label>
          <span className="mb-2">Sign in with email (development only)</span>
          <input
            type="text"
            className="w-full h-12 rounded-lg px-4 text-lg focus:ring-blue-600 mb-4"
            autoComplete="email"
            placeholder="Email"
          />
          <button
            className="w-full h-12 rounded-lg bg-blue-600 text-gray-200 uppercase font-semibold hover:bg-blue-700 transition mb-4"
            onClick={() => signIn('credentials')}
          >
            Login
          </button>
          <label className="text-gray-800 mb-4">or</label>
          {Object.values(providers).map((provider: any) => {
            const [hoverRef, isHovered] = useHover();
            return provider.id !== 'credentials' ? (
              <button
                className={`w-full h-12 rounded-lg text-white uppercase font-semibold transition mb-4 filter`}
                style={{
                  backgroundColor: changeBrightness(
                    // @ts-ignore
                    brandColors[provider.id],
                    !isHovered ? 0 : -0.15,
                  ),
                }}
                onClick={() => signIn(provider.id)}
                // @ts-ignore
                ref={hoverRef}
              >
                Sign in with {provider.name}
              </button>
            ) : (
              <></>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
