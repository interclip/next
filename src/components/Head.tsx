import Head from 'next/head';
import { useTheme } from 'next-themes';
import React from 'react';

/**
 * A dynamically configurable <head> of the site.
 * @param props -
 * @param props.titlePrefix - a string to be prepended to the site's `<title>` element.
 * @returns a Head element.
 */
const PageHead = (props: { titlePrefix?: string }): JSX.Element => {
  const { titlePrefix } = props;
  const theme = useTheme();
  console.log(theme);
  return (
    <Head>
      <title>{titlePrefix && `${titlePrefix} |`} Interclip</title>
      <meta
        content={theme.resolvedTheme === 'dark' ? '#151515' : '#167efb'}
        name="theme-color"
      />
    </Head>
  );
};

export default PageHead;
