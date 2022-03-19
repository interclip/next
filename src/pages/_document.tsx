import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

type Props = Record<string, unknown> & DocumentProps;

class InterclipDocument extends Document<Props> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <link href="/icons/logo.svg" rel="icon" />
          <link href="/manifest.json" rel="manifest" />
          <link
            href="/pwa/favicon-196.png"
            rel="icon"
            sizes="196x196"
            type="image/png"
          />

          <meta
            content="/pwa/mstile-icon-128.png"
            name="msapplication-square70x70logo"
          />
          <meta
            content="/pwa/mstile-icon-270.png"
            name="msapplication-square150x150logo"
          />
          <meta
            content="/pwa/mstile-icon-558.png"
            name="msapplication-square310x310logo"
          />
          <meta
            content="/pwa/mstile-icon-558-270.png"
            name="msapplication-wide310x150logo"
          />

          <link href="/pwa/apple-icon-180.png" rel="apple-touch-icon" />

          <meta content="yes" name="apple-mobile-web-app-capable" />

          <link
            href="/pwa/apple-splash-dark-2048-2732.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2732-2048.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1668-2388.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2388-1668.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1536-2048.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2048-1536.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1668-2224.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2224-1668.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1620-2160.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2160-1620.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1284-2778.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2778-1284.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1170-2532.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2532-1170.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1125-2436.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2436-1125.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1242-2688.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2688-1242.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-828-1792.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1792-828.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1242-2208.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-2208-1242.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-750-1334.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1334-750.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-640-1136.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            rel="apple-touch-startup-image"
          />
          <link
            href="/pwa/apple-splash-dark-1136-640.jpg"
            media="(prefers-color-scheme: dark) and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            rel="apple-touch-startup-image"
          />
          <meta content="The next generation of sharing" name="description" />
          <meta content="website" property="og:type" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default InterclipDocument;
