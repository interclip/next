import React from 'react';

const Input: React.FC = (props: any) => {
  return (
    <input
      {...props}
      className="border-2 border-[#EAEAEA] rounded-xl px-2.5 py-1.5 text-[#333333] dark:text-dark-text w-full "
    />
  );
};

export default Input;
