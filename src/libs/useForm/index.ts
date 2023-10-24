import React, { useEffect, useRef, useState } from 'react';
import {
  DeepPartial,
  FieldElementType,
  FieldValues,
  GetValueHandler,
  GetValuesHandler,
  HandleSubmitHandler,
  InputRefsType,
  OptionsType,
} from './type';
import useRender from './useRender';
import { Validation } from './validation/type';
import { validate } from './validation/validation';
import { set, get } from '../utils';

const useForm = <T = FieldValues>() => {
  const [errors, setErrors] = useState<DeepPartial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});
  const fieldOptions = useRef<Partial<Record<keyof T, OptionsType>>>({});
  const valuesRef = useRef<Partial<T>>({});
  const listeners = useRef<Set<keyof T>>(new Set());
  const { reRender } = useRender();

  useEffect(() => {
    if (listeners.current.size > 0) {
      reRender();
    }
  }, []);

  const register = (name: keyof T, options?: OptionsType) => {
    fieldOptions.current[name] = options;

    return {
      id: name,

      name: String(name),

      autoComplete: options?.autoComplete === false ? 'off' : 'on',

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

      onChange: ({ target }: React.ChangeEvent<FieldElementType>) => {
        const { name, value } = target;

        // validation
        let [isError, errorMessage] = [false, ''];
        if (options) {
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

          const curErrorMessageOfName = get(errors, name);
          // 이전에 발생한 에러가 아닐 때, 에러 업데이트
          if (isError && curErrorMessageOfName !== errorMessage) {
            setErrors((prev) => {
              const newErrors = set({ ...prev }, name, errorMessage);
              return newErrors;
            });
            // 에러가 발생하지 않았음에도 에러 메시지가 존재할 때 (에러 제거)
          } else if (!isError && errors[name as keyof T]) {
            setErrors((prev) => {
              const newErrors = set({ ...prev }, name, '');
              return newErrors;
            });
          }

          const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;
          valuesRef.current[name as keyof T] = transformedValue as T[keyof T];

          if (listeners.current.has(name as keyof T)) reRender();
        }
      },
    };
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

    // validation
    const targets = Object.values(inputRefs.current) as (EventTarget & FieldElementType)[];
    let focusFlag = false;

    for (const target of targets) {
      const { name, value } = target;

      const options = fieldOptions.current[name as keyof T];
      if (!options) break;

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

      const curErrorMessageOfName = get(errors, name);
      if (isError && curErrorMessageOfName !== errorMessage) {
        setErrors((prev) => {
          const newErrors = set({ ...prev }, name, errorMessage);
          return newErrors;
        });
      }

      if (isError && options?.onErrorFocus !== false && !focusFlag) {
        target.focus();
        focusFlag = true;
      }
    }

    callback(valuesRef.current as T);
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
  };
};

export default useForm;
