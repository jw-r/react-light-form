import { Validation, ValidationCallback } from './validation/type';

export type Noop = () => void;

export type InputRefsType<T> = {
  [K in DeepKeys<T>]?: FieldElementType;
};

export type ErrorsType<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? ErrorsType<U>[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[P] extends Record<string, any>
    ? ErrorsType<T[P]>
    : string;
};

export type FieldOptionsType<T> = Partial<Record<DeepKeys<T>, OptionsType>>;

export type FieldElementType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

export type ValueTypes = string | number | boolean | Date;
type Primitive = string | number | symbol | boolean | bigint | undefined | null;

export interface FieldValues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: unknown;
}

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
  validation: Validation<ValidationCallback>;

  initialValue: ValueTypes;
  setValueAs: (value: string) => ValueTypes;
}>;

export type HandleSubmitHandler<T> = (
  callback: (values: T) => void
) => (e: React.FormEvent) => void;

export type GetValueHandler<T> = <K extends DeepKeys<T>>(name: K) => PathValue<T, K> | undefined;

export type GetValuesHandler<T> = <K extends DeepKeys<T>>(
  names: K[]
) => { [P in K]?: PathValue<T, K> };

export type DeepKeys<T, U extends string = ''> = T extends Primitive
  ? U
  : T extends Array<infer R>
  ? U | `${U}[${number}]` | `${U}[${number}]${R extends Primitive ? '' : '.'}${DeepKeys<R, ''>}`
  :
      | U
      | {
          [P in keyof T]-?: P extends string | number
            ? DeepKeys<T[P], U extends '' ? `${P}` : `${U}.${P}`>
            : never;
        }[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[P] extends Record<string, any>
    ? DeepPartial<T[P]>
    : T[P];
};

type ArrayElement<T> = T extends Array<infer R> ? R : never;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : K extends `${infer ArrayKey}[${number}]`
    ? ArrayKey extends keyof T
      ? PathValue<ArrayElement<T[ArrayKey]>, R>
      : never
    : never
  : P extends `${infer K}[${number}]`
  ? K extends keyof T
    ? ArrayElement<T[K]>
    : never
  : P extends keyof T
  ? T[P]
  : never;
