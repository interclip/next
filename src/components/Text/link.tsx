import NextLink from 'next/link';
import { ComponentProps, forwardRef } from 'react';
import React from 'react';

interface Props extends ComponentProps<'a'> {
  openInNewTab?: boolean;
}

const Link = forwardRef<HTMLInputElement, Props>(function Link({
  openInNewTab = true,
  ...props
}) {
  return (
    <NextLink href={props.href as string}>
      <a
        className="underline"
        rel={openInNewTab ? 'noopener noreferrer' : ''}
        target={openInNewTab ? '_blank' : ''}
        {...props}
      >
        {props.children}
      </a>
    </NextLink>
  );
});

export default Link;
