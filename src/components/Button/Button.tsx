import { changeColorBrightness } from '@utils/colors';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { forwardRef } from 'react';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'button'> {
  content?: string;
  background_color?: string;
  hover_color?: string;
  focus_ring_color?: string;
  url?: string;
  onClick?: () => any;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button({
  ...props
}) {
  const theme = useTheme();
  const backgroundColor =
    props.background_color || theme.theme === 'dark' ? 'light-bg' : 'white';

  const textColor =
    props.background_color || theme.theme === 'dark' ? 'white' : 'black';

  const hoverColor =
    props.hover_color || `[${changeColorBrightness(backgroundColor, -0.15)}]`;

  const buttonClasses = `bg-${
    !props.disabled ? backgroundColor : '[#a8a29e]'
  } hover:bg-${hoverColor} border dark:border-none text-${textColor} focus:ring-${
    props.focus_ring_color
  } px-4 py-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none`;

  return props.url ? (
    <>
      <Link href={`${props.url}`} passHref={true}>
        <button
          className={`${buttonClasses} ${props.className}`}
          disabled={props.disabled}
        >
          <div>{props.content}</div>
        </button>
      </Link>
    </>
  ) : (
    <>
      <button
        className={`${buttonClasses} ${props.className}`}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <div>{props.content}</div>
      </button>
    </>
  );
});

export default Button;
