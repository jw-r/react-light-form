import React, { useEffect, useRef, useState } from 'react';
import {
  FieldElementType,
  FieldValues,
  GetValueHandler,
  GetValuesHandler,
  HandleSubmitHandler,
  InputRefsType,
  OptionsType,
  UseFormReturnType,
} from './type';

const useForm = <T = FieldValues>(): UseFormReturnType<T> => {
  const [errors, setErrors] = useState<Partial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});
  const valuesRef = useRef<Partial<T>>({});
  const listeners = useRef<Set<keyof T>>(new Set());
  const [, forceUpdate] = useState({});
  console.log(setErrors);

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
          if (options?.value) {
            element.value = String(options.value);

            // TODO nested 처리
            // set(valuesRef.current, nested 객체 , options.value);

            // Set Value
            valuesRef.current[name as keyof T] = options.value as T[keyof T];
          }

          inputRefs.current[name] = element;

          if (options?.onMountFocus) inputRefs.current[name]?.focus();
        }

        return inputRefs.current[name];
      },

      onChange: ({ target: { name, value } }: React.ChangeEvent<FieldElementType>) => {
        // TODO 요효성 검사

        // Set Value
        const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;
        valuesRef.current[name as keyof T] = transformedValue as T[keyof T];

        if (listeners.current.has(name as keyof T)) reRender();
      },
    };
  };

  const reRender = () => {
    forceUpdate({});
  };

  const getValue: GetValueHandler<T> = (name) => {
    const value = valuesRef.current[name] as T[keyof T];
    listeners.current.add(name);
    return value;
  };

  const getValues: GetValuesHandler<T> = (...names) => {
    const values = names.reduce((acc, name) => {
      listeners.current.add(name);
      acc[name] = valuesRef.current[name];
      return acc;
    }, {} as Partial<Record<keyof T, T[keyof T]>>);

    return values;
  };

  const handleSubmit: HandleSubmitHandler<T> = (callback) => (e) => {
    e.preventDefault();

    // TODO 유효성 검사

    const values = valuesRef.current as T;

    callback(values);
  };

  return {
    register,
    handleSubmit,
    errors,
    getValue,
    getValues,
  };
};

export default useForm;
