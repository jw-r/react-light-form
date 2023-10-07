import React from 'react';

export type Noop = () => void;

export type FieldElementType = HTMLInputElement | HTMLTextAreaElement | null;

export type ValueTypes = string | number | boolean;

export interface FieldValues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export type InputRefsType<T> = {
  [K in keyof T]?: FieldElementType;
};

export type Options = Partial<{
  onErrorFocus: boolean;
  onMountFocus: boolean;

  required: boolean;
  maxLength: number;
  minLength: number;
  max: number;
  min: number;
  pattern: RegExp;
  validate: Noop;

  value: ValueTypes;
  setValueAs: (value: string) => ValueTypes;
}>;

export type HandleSubmitType<T> = (callback: (values: T) => void) => (e: React.FormEvent) => void;

export type UseFormReturnType<T> = {
  register: (
    name: keyof T,
    options?: Options
  ) => {
    name: string;
    ref: (element: FieldElementType) => void;
    onChange: (e: React.ChangeEvent<FieldElementType>) => void;
  } | void;
  handleSubmit: HandleSubmitType<T>;
  errors: Partial<T>;
};
