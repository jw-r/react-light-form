export type Validation<T> = T | { value: T extends boolean ? true : T; message: string };

type validateHandler<T> = (value: string, option: Validation<T>) => [boolean, string];

export interface ValidateType {
  required: validateHandler<boolean>;
  minLength: validateHandler<number>;

  maxLength: validateHandler<number>;
  max: validateHandler<number>;
  min: validateHandler<number>;
  pattern: validateHandler<RegExp>;

  // TODO: Custom Validation
  // validate: Noop;
}
