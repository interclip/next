import { motion } from 'framer-motion';
import React from 'react';

export const QRCode = (props: {
  onClick: React.MouseEventHandler<SVGElement>;
}): JSX.Element => {
  return (
    <motion.svg
      whileTap={{ scale: 0.95, x: 2, y: 2 }}
      onClick={props.onClick}
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-auto text-black cursor-pointer fill-current dark:text-white"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <g>
          <path d="M3,11h8V3H3V11z M5,5h4v4H5V5z" />
          <path d="M3,21h8v-8H3V21z M5,15h4v4H5V15z" />
          <path d="M13,3v8h8V3H13z M19,9h-4V5h4V9z" />
          <rect height="2" width="2" x="19" y="19" />
          <rect height="2" width="2" x="13" y="13" />
          <rect height="2" width="2" x="15" y="15" />
          <rect height="2" width="2" x="13" y="17" />
          <rect height="2" width="2" x="15" y="19" />
          <rect height="2" width="2" x="17" y="17" />
          <rect height="2" width="2" x="17" y="13" />
          <rect height="2" width="2" x="19" y="15" />
        </g>
      </g>
    </motion.svg>
  );
};
