import { ValidateType } from './type';

export const validate: ValidateType = {
  // onBlue와 onSubmit 이벤트 발생시 검사
  required: (value, option) => {
    if (value !== '') return [false, ''];

    if (typeof option === 'boolean') {
      return [true, '형식에 맞지 않는 값입니다'];
    }

    return [true, option.message];
  },

  minLength: (value, option) => {
    return [false, ''];
  },

  min: (value, option) => {
    return [false, ''];
  },

  // onChange와 onSubmit 이벤트 발생 시 검사
  maxLength: (value, option) => {
    if (typeof option === 'number') {
      if (value.length > option) {
        return [true, '형식에 맞지 않는 값입니다'];
      }
    } else {
      if (value.length > option.value) {
        return [true, option.message];
      }
    }

    return [false, ''];
  },

  max: (value, option) => {
    return [false, ''];
  },

  pattern: (value, option) => {
    return [false, ''];
  },

  // TODO: Custom Validation
  // validate: () => {},
};
