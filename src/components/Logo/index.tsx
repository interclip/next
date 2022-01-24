import dayjs from 'dayjs';
import Image from 'next/image';
import NextLink from 'next/link';
import { ComponentProps, forwardRef } from 'react';
import React from 'react';

const currentDate = dayjs().format('MM/DD');
let logoName: string;

switch (currentDate) {
  case '10/31':
    logoName = 'seasonal/halloween.png';
    break;
  case '12/24':
  case '12/25':
    // Todo(ft): Add xmas logo
    logoName = 'logo.svg';
    break;
  default:
    logoName = 'logo.svg';
}

const Logo = forwardRef<HTMLInputElement, ComponentProps<'img'>>(function Logo({
  ...props
}) {
  return (
    <NextLink href="/">
      <Image
        src={`/icons/${logoName}`}
        alt="Interclip logo"
        className="md:hide show cursor-pointer"
        width={props.width}
        height={props.height}
      />
    </NextLink>
  );
});

export default Logo;
