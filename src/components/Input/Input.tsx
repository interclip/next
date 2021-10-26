import React, { forwardRef } from 'react';
import { ComponentProps } from 'react';

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  function Input({ ...props }) {
    return (
      <input
        className={`border-2 border-[#EAEAEA] rounded-xl px-2.5 py-1.5 text-[#333333] bg-white dark:text-dark-text ${
          props.disabled ? 'dark:bg-[#474747]' : 'dark:bg-dark-secondary'
        } w-full`}
        {...props}
      />
    );
  },
);

export default Input;
