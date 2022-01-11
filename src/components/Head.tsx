import Head from 'next/head';
import React from 'react';

/**
 * A dynamically configurable <head> of the site.
 * @param props -
 * @param props.titlePrefix - a string to be prepended to the site's `<title>` element.
 * @returns a Head element.
 */
const PageHead = (props: { titlePrefix?: string }): JSX.Element => {
  const { titlePrefix } = props;
  return (
    <Head>
      <title>{titlePrefix && `${titlePrefix} |`} Interclip</title>
    </Head>
  );
};

export default PageHead;
