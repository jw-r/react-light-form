import { OptionsType } from '../type';
import { ValidateType, Validation } from './type';

export const validate: ValidateType = {
  required: (value, option) => {
    if (typeof option === 'boolean') {
      if (value === '') return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (value === '') return [true, option.message];
    }

    return [false, ''];
  },

  minLength: (value, option) => {
    if (typeof option === 'number') {
      if (value.length < option) return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (value.length < option.value) return [true, option.message];
    }

    return [false, ''];
  },

  min: (value, option) => {
    if (typeof option === 'number') {
      if (Number(value) < option) return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (Number(value) < option.value) return [true, option.message];
    }

    return [false, ''];
  },

  maxLength: (value, option) => {
    if (typeof option === 'number') {
      if (value.length > option) return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (value.length > option.value) return [true, option.message];
    }

    return [false, ''];
  },

  max: (value, option) => {
    if (typeof option === 'number') {
      if (Number(value) > option) return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (Number(value) > option.value) return [true, option.message];
    }

    return [false, ''];
  },

  pattern: (value, option) => {
    if (option instanceof RegExp) {
      if (!option.test(value)) return [true, '형식에 맞지 않는 값입니다'];
    } else {
      if (!option.value.test(value)) return [true, option.message];
    }

    return [false, ''];
  },

  // TODO: Custom Validation
  // validate: () => {},
};

export const validateField = (value: string, options: OptionsType) => {
  let [isError, errorMessage] = [false, ''];
  const { required, pattern, minLength, min, maxLength, max } = options;
  const entries = Object.entries({ required, pattern, minLength, min, maxLength, max });

  for (const [key, pair] of entries) {
    if (isError) break;
    if (!pair) continue;

    switch (key) {
      case 'required':
        [isError, errorMessage] = validate.required(value, pair as Validation<boolean>);
        break;
      case 'pattern':
        [isError, errorMessage] = validate.pattern(value, pair as Validation<RegExp>);
        break;
      case 'minLength':
        [isError, errorMessage] = validate.minLength(value, pair as Validation<number>);
        break;
      case 'min':
        [isError, errorMessage] = validate.min(value, pair as Validation<number>);
        break;
      case 'maxLength':
        [isError, errorMessage] = validate.maxLength(value, pair as Validation<number>);
        break;
      case 'max':
        [isError, errorMessage] = validate.max(value, pair as Validation<number>);
        break;
    }
  }

  return [isError, errorMessage] as const;
};
