import React, { useRef, useState } from 'react';
import {
  FieldElementType,
  FieldValues,
  HandleSubmitType,
  InputRefsType,
  Options,
  UseFormReturnType,
} from './type';

const useForm = <T = FieldValues>(): UseFormReturnType<T> => {
  const [errors, setErrors] = useState<Partial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});
  const valuesRef = useRef<Partial<T>>({});

  const register = (name: keyof T, options?: Options) => {
    if (inputRefs.current?.[name]) return;

    return {
      name: String(name),

      ref: (element: FieldElementType) => {
        if (!element) return;

        // TODO nested 처리
        // set(inputRefs.current, nested 객체, element);

        inputRefs.current[name] = element;

        if (options?.value) {
          element.value = String(options?.value);

          // TODO nested 처리
          // set(valuesRef.current, nested 객체 , options.value);

          // Set Value
          valuesRef.current[name as keyof T] = options.value as T[keyof T];
        }

        if (options?.onMountFocus) inputRefs.current[name]?.focus();
      },

      onChange: ({ target: { name, value } }: React.ChangeEvent<FieldElementType>) => {
        // TODO 요효성 검사

        // Set Value
        const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;
        valuesRef.current[name as keyof T] = transformedValue as T[keyof T];
      },
    };
  };

  const handleSubmit: HandleSubmitType<T> = (callback) => (e) => {
    e.preventDefault();

    // TODO 유효성 검사

    const values = valuesRef.current as T;

    callback(values);
  };

  return {
    register,
    handleSubmit,
    errors,
  };
};

export default useForm;
