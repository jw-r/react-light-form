import { Validation } from './validation/type';

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
  autoComplete: boolean;

  required: Validation<boolean>;
  maxLength: Validation<number>;
  minLength: Validation<number>;
  max: Validation<number>;
  min: Validation<number>;
  pattern: Validation<RegExp>;
  validate: Noop;

  initialValue: ValueTypes;
  setValueAs: (value: string) => ValueTypes;
}>;

export type HandleSubmitHandler<T> = (
  callback: (values: T) => void
) => (e: React.FormEvent) => void;

export type GetValueHandler<T> = <K extends keyof T>(name: K) => T[K] | undefined;

export type GetValuesHandler<T> = <K extends keyof T>(names: K[]) => { [P in K]?: T[P] };
