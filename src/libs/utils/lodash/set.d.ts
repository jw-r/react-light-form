// set.d.ts
export default function set<T extends object>(
  obj: T,
  path: string | number | symbol,
  value: unknown
): T;
