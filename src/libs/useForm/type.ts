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

export type OptionsType = Partial<{
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

export type HandleSubmitHandler<T> = (
  callback: (values: T) => void
) => (e: React.FormEvent) => void;

export type GetValueHandler<T> = (name: keyof T) => T[keyof T];

export type GetValuesHandler<T> = (...names: (keyof T)[]) => Partial<Record<keyof T, T[keyof T]>>;

export type UseFormReturnType<T> = {
  register: (
    name: keyof T,
    options?: OptionsType
  ) => {
    name: string;
    ref: (element: FieldElementType) => void;
    onChange: (e: React.ChangeEvent<FieldElementType>) => void;
  } | void;
  handleSubmit: HandleSubmitHandler<T>;
  errors: Partial<T>;
  getValue: GetValueHandler<T>;
  getValues: GetValuesHandler<T>;
};
