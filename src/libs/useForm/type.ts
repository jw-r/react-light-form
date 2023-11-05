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
type ArrayKeys = number;

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
  ? U // 만약 T가 기본 타입이면 (즉, 더 이상 내부에 중첩된 프로퍼티가 없으면) 현재의 경로(U)를 반환
  : T extends Array<infer R>
  ? // T가 배열이라면, 다음 중 하나를 반환
    | U // 현재 경로(U)를 반환
      | `${U}[${ArrayKeys}]` // 현재 경로에 배열 인덱스를 추가한 문자열을 반환 (ex. nodes[0])
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

type ArrayElement<T> = T extends Array<infer R> ? R : never;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : P extends `${infer K}[${number}]`
  ? K extends keyof T
    ? ArrayElement<T[K]>
    : never
  : P extends keyof T
  ? T[P]
  : never;
