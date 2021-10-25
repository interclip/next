import { ComponentProps, forwardRef } from 'react';
import NextLink from 'next/link';

interface Props extends ComponentProps<'a'> {
  openInNewTab?: boolean;
}

const Link = forwardRef<HTMLInputElement, Props>(function Link({
  openInNewTab = true,
  ...props
}) {
  return (
    <NextLink href={props.href as string} passHref>
      <a
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className="underline"
        {...props}
      >
        {props.children}
      </a>
    </NextLink>
  );
});

export default Link;
