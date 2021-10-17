import Head from "next/head";
import React from "react";

/**
 * A dynamically configurable <head> of the site.
 * @param props -
 * @param props.titlePrefix - a string to be prepended to the site's `<title>` element.
 * @param props.name - a name of an event which is currently counted down to.
 * @param props.date - a formatted difference between the current time and the event.
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
