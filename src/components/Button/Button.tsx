import React from 'react';
import Link from 'next/link';

const Button = ({
  content,
  background_color,
  hover_color,
  focus_ring_color,
  url,
  onClick,
}: {
  content?: string;
  background_color?: string;
  hover_color?: string;
  focus_ring_color?: string;
  url?: any;
  onClick?: () => any;
}) => {
  const buttonClasses = `bg-${background_color} hover:bg-${hover_color} border dark:border-none text-white focus:ring-${focus_ring_color} px-4 py-1.5 rounded-lg font-bold disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-opacity-50 focus:ring-offset-1 outline-none`;
  return url ? (
    <>
      <Link href={`${url}`} passHref={true}>
        <button className={buttonClasses}>
          <div>{content}</div>
        </button>
      </Link>
    </>
  ) : (
    <>
      <button className={buttonClasses} onClick={onClick}>
        <div>{content}</div>
      </button>
    </>
  );
};

export default Button;
