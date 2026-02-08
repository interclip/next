import 'tailwindcss/tailwind.css';

import { NextUIProvider } from '@nextui-org/react';
import { dropLink, droppable } from '@utils/dropLink';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NextNprogress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { DropEvent } from 'src/typings/interclip';

//@ts-ignore
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    ((document: Document) => {
      droppable(document.body, async (e: DropEvent) => {
        dropLink(e);
      });
    })(document);
  }, []);
  return (
    <SessionProvider refetchInterval={5 * 60} session={session}>
      <NextUIProvider>
        <ThemeProvider attribute="class">
          <NextNprogress
            color="#157EFB"
            height={2}
            options={{ showSpinner: false }}
            showOnShallow
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
export default MyApp;
