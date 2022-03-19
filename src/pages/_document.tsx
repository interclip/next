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
