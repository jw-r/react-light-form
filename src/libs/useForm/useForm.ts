import React, { useRef, useState } from 'react';
import { FieldElementType, FieldValues, InputRefsType, Noop } from './type';

const useForm = <T = FieldValues>(initValues?: Partial<T>) => {
  const [errors, setErrors] = useState<Partial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});

  const register = (name: keyof T) => {
    if (inputRefs.current?.[name]) return;

    return {
      ref: (element: FieldElementType) => {
        if (!element) return;

        if (initValues?.[name]) element.value = String(initValues?.[name]);
        inputRefs.current[name] = element;

        return inputRefs.current[name];
      },
    };
  };

  const handleSubmit = (callback: Noop) => (e: React.FormEvent) => {
    e.preventDefault();

    callback();
  };

  return {
    register,
    handleSubmit,
    errors,
    values: inputRefs.current,
  };
};

export default useForm;
