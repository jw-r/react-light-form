/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeepPartial } from '../../useForm/type';

// get.d.ts
export default function get<T>(
  obj: DeepPartial<T>,
  path: string | number | symbol,
  defaultValue?: unknown
): string | number | object;
