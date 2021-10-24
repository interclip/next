import { ComponentProps, forwardRef } from 'react';
import NextLink from 'next/link';

interface Props extends ComponentProps<'a'> {
  openInNewTab?: boolean;
}

export const Link = forwardRef<HTMLInputElement, Props>(function Link({
  openInNewTab = true,
  ...props
}) {
  return (
    <NextLink href={props.href as string}>
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
