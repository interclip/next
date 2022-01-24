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
      className="w-full rounded-xl border-2 border-[#EAEAEA] bg-white px-2.5 py-1.5 text-[#333333] dark:bg-dark-secondary dark:text-dark-text"
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
