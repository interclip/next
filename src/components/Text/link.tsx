import { ComponentProps, forwardRef } from 'react';
import NextLink from 'next/link';

export const Link = forwardRef<HTMLInputElement, ComponentProps<'a'>>(
  function Link({ ...props }) {
    return (
      <NextLink href={props.href as string} passHref>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          {...props}
        >
          {props.children}
        </a>
      </NextLink>
    );
  },
);
