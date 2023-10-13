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
          if (options?.value) {
            element.value = String(options.value);

            valuesRef.current[name as keyof T] = options.value as T[keyof T];
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
    };
  };

  const getValue: GetValueHandler<T> = (name) => {
    const value = valuesRef.current[name] as T[keyof T];
    listeners.current.add(name);

    return value;
  };

  const getValues: GetValuesHandler<T> = (names) => {
    const values = names.reduce((acc, name) => {
      listeners.current.add(name);
      acc[name] = valuesRef.current[name];
      return acc;
    }, {} as Partial<Record<keyof T, T[keyof T]>>);

    return values;
  };

  function watch(name: keyof T): T[keyof T];
  function watch(name: keyof T, ...rest: (keyof T)[]): Partial<Record<keyof T, T[keyof T]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function watch(name: keyof T, ...rest: (keyof T)[]): any {
    if (rest.length === 0) {
      return getValue(name);
    }
    return getValues([name, ...rest]);
  }

  const handleSubmit: HandleSubmitHandler<T> = (callback) => (e) => {
    e.preventDefault();

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
