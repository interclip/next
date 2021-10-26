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
    <NextLink href={props.href as string}>
      <a
        target={openInNewTab ? '_blank' : ''}
        rel={openInNewTab ? 'noopener noreferrer' : ''}
        className="underline"
        {...props}
      >
        {props.children}
      </a>
    </NextLink>
  );
});

export default Link;
