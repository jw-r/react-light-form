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

type Primitive = string | number | symbol | boolean | bigint | undefined | null;

type ArrayKeys = number;

export type DeepKeys<T, U extends string = ''> = T extends Primitive
  ? U // 만약 T가 기본 타입이면 현재의 경로(U)를 반환.
  : T extends Array<infer R>
  ?
      | U
      | `${U}[${ArrayKeys}]`
      | `${U}[${ArrayKeys}]${R extends Primitive ? '' : '.'}${DeepKeys<R, ''>}` // 배열의 경우, 배열 자체, 배열 요소, 배열 내 객체의 경로를 처리.
  :
      | U
      | {
          [P in keyof T]-?: P extends string | number
            ? DeepKeys<T[P], U extends '' ? `${P}` : `${U}.${P}`>
            : never;
        }[keyof T]; // 객체의 경우, 객체 자체와 객체 내 프로퍼티의 경로를 처리.

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T[P] extends Record<string, any>
    ? DeepPartial<T[P]>
    : T[P];
};
