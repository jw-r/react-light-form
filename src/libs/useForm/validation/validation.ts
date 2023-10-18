import { ValidateType } from './type';

export const validate: ValidateType = {
  // onBlue와 onSubmit 이벤트 발생시 검사
  required: (value, option) => {
    if (value !== '') return [false, 'No Error'];

    if (typeof option === 'boolean') {
      return [true, '형식에 맞지 않는 값입니다'];
    }

    return [true, option.message];
  },
  minLength: (value, option) => {
    console.log(value, option);
    return [false, '형식에 맞지 않는 값입니다'];
  },

  // onChange와 onSubmit 이벤트 발생 시 검사
  maxLength: (value, option) => {
    console.log(value, option);
    return [false, '형식에 맞지 않는 값입니다'];
  },
  max: (value, option) => {
    console.log(value, option);
    return [false, '형식에 맞지 않는 값입니다'];
  },
  min: (value, option) => {
    console.log(value, option);
    return [false, '형식에 맞지 않는 값입니다'];
  },
  pattern: (value, option) => {
    console.log(value, option);
    return [false, '형식에 맞지 않는 값입니다'];
  },
  // TODO: Custom Validation
  // validate: () => {},
};
