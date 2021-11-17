import React, { forwardRef } from 'react';
import { ComponentProps } from 'react';

type SelectOption = { label: string; value: string }[];

interface Props extends ComponentProps<'select'> {
  options?: SelectOption;
}

export const Select = forwardRef<HTMLInputElement, Props>(function Input({
  ...props
}) {
  return (
    <select
      className="w-full bg-white border-2 border-[#EAEAEA] rounded-xl px-2.5 py-1.5 text-[#333333] dark:text-dark-text dark:bg-dark-secondary"
      {...props}
    >
      {props.options &&
        props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  );
});

export default Select;
