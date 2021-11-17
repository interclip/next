import { ComponentProps, forwardRef } from 'react';
import React from 'react';

export const H1 = forwardRef<HTMLInputElement, ComponentProps<'h1'>>(
  function H1({ ...props }) {
    return (
      <h1 className="my-16 font-sans text-6xl font-semibold text-left">
        {props.children}
      </h1>
    );
  },
);

export const H2 = forwardRef<HTMLInputElement, ComponentProps<'h2'>>(
  function H2({ ...props }) {
    return (
      <h2 className="my-8 font-sans text-4xl font-semibold text-left">
        {props.children}
      </h2>
    );
  },
);

export const H3 = forwardRef<HTMLInputElement, ComponentProps<'h3'>>(
  function H3({ ...props }) {
    return (
      <h3 className="font-sans text-3xl font-semibold text-left">
        {props.children}
      </h3>
    );
  },
);
