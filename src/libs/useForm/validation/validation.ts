import { ValidateType } from './type';

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
