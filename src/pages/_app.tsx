import 'tailwindcss/tailwind.css';

import { Kbar } from '@components/Kbar';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <Kbar>
          <Component {...pageProps} />
        </Kbar>
      </ThemeProvider>
    </SessionProvider>
  );
}
export default MyApp;
