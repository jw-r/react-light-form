/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeepKeys, DeepPartial, ErrorsType, PathValue } from '../../useForm/type';

// get.d.ts
export default function get<T, K extends DeepKeys<T>>(
  obj: DeepPartial<T> | ErrorsType<T>,
  path: K,
  defaultValue?: unknown
): PathValue<T, K>;
