import React, { useEffect, useRef, useState } from 'react';
import {
  FieldElementType,
  FieldValues,
  GetValueHandler,
  GetValuesHandler,
  HandleSubmitHandler,
  InputRefsType,
  OptionsType,
} from './type';
import useRender from './useRender';
import { ValidateType, Validation } from './validation/type';

const useForm = <T = FieldValues>() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<Partial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});
  const valuesRef = useRef<Partial<T>>({});
  const listeners = useRef<Set<keyof T>>(new Set());
  const { reRender } = useRender();

  useEffect(() => {
    if (listeners.current.size > 0) {
      reRender();
    }
  }, []);

  const register = (name: keyof T, options?: OptionsType) => {
    return {
      name: String(name),

      ref: (element: FieldElementType) => {
        if (!element) return;

        if (!inputRefs.current[name]) {
          if (options?.initialValue) {
            element.value = String(options.initialValue);

            valuesRef.current[name as keyof T] = options.initialValue as T[keyof T];
          }

          inputRefs.current[name] = element;

          if (options?.onMountFocus) inputRefs.current[name]?.focus();
        }

        return inputRefs.current[name];
      },

      onChange: ({ target: { name, value } }: React.ChangeEvent<FieldElementType>) => {
        const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;
        valuesRef.current[name as keyof T] = transformedValue as T[keyof T];

        if (listeners.current.has(name as keyof T)) reRender();
      },

      onBlur: ({ target }: React.FocusEvent<FieldElementType>) => {
        if (!options) return;
        const { name, value } = target;
        let [isError, errorMessage] = [false, '형식에 맞지 않는 값입니다'];

        const { required, minLength } = options;
        Object.entries({ required, minLength }).forEach(([key, pair]) => {
          if (key === 'required' && pair) {
            [isError, errorMessage] = validate.required(value, pair as Validation<boolean>);
          } else if (key === 'minLength' && pair) {
            [isError, errorMessage] = validate.minLength(value, pair as Validation<number>);
          }
        });

        if (isError) {
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          target.focus();
        }
      },
    };
  };

  const validate: ValidateType = {
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

  const getValue: GetValueHandler<T> = (name) => {
    const value = valuesRef.current[name];
    listeners.current.add(name);

    return value;
  };

  const getValues: GetValuesHandler<T> = (names) => {
    const values = names.reduce((acc, name) => {
      listeners.current.add(name);
      const currentValue = valuesRef.current[name];
      if (currentValue !== undefined) {
        acc[name] = currentValue;
      }
      return acc;
    }, {} as Pick<T, (typeof names)[number]>);

    return values;
  };

  function watch<K extends keyof T>(name: K): T[K] | undefined;
  function watch<K extends keyof T>(...names: K[]): { [P in K]?: T[P] };
  function watch<K extends keyof T>(...names: K[]): T[K] | { [P in K]?: T[P] } | undefined {
    if (names.length === 1) {
      return getValue(names[0]);
    }
    return getValues(names);
  }

  const handleSubmit: HandleSubmitHandler<T> = (callback) => (e) => {
    e.preventDefault();

    // TODO: 유효성 검사

    const values = valuesRef.current as T;

    callback(values);
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
  };
};

export default useForm;
