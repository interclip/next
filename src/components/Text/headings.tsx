import { ComponentProps, forwardRef } from 'react';
import React from 'react';

export const H1 = forwardRef<HTMLInputElement, ComponentProps<'h1'>>(
  function H1({ ...props }) {
    return (
      <h1 className="text-left my-16 font-semibold text-6xl font-sans">
        {props.children}
      </h1>
    );
  },
);

export const H2 = forwardRef<HTMLInputElement, ComponentProps<'h2'>>(
  function H2({ ...props }) {
    return (
      <h2 className="text-left my-8 font-semibold text-4xl font-sans">
        {props.children}
      </h2>
    );
  },
);

export const H3 = forwardRef<HTMLInputElement, ComponentProps<'h3'>>(
  function H3({ ...props }) {
    return (
      <h3 className="text-left font-semibold text-3xl font-sans">
        {props.children}
      </h3>
    );
  },
);
