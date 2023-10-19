import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { Validation } from './validation/type';
import { validate } from './validation/validation';

const useForm = <T = FieldValues>() => {
  const [errors, setErrors] = useState<Partial<T>>({});
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
        const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;

        // validation
        let [isError, errorMessage] = [false, ''];
        if (options) {
          const { maxLength, max, pattern } = options;

          Object.entries({ maxLength, max, pattern }).forEach(([key, pair]) => {
            if (isError) return;

            if (key === 'maxLength' && pair) {
              [isError, errorMessage] = validate.maxLength(value, pair as Validation<number>);
            }
          });

          if (isError && errors[name as keyof T] !== errorMessage) {
            setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          } else if (!isError && errors[name as keyof T]) {
            setErrors((prev) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [name as keyof T]: _, ...rest } = prev;
              return rest as Partial<T>;
            });
          }

          valuesRef.current[name as keyof T] = transformedValue as T[keyof T];
          if (listeners.current.has(name as keyof T)) reRender();
        }
      },

      onBlur: ({ target }: React.FocusEvent<FieldElementType>) => {
        // validation
        if (!options) return;
        const { name, value } = target;
        let [isError, errorMessage] = [false, ''];

        const { required, minLength, min } = options;
        Object.entries({ required, minLength, min }).forEach(([key, pair]) => {
          if (isError) return;

          if (key === 'required' && pair) {
            [isError, errorMessage] = validate.required(value, pair as Validation<boolean>);
          } else if (key === 'minLength' && pair) {
            [isError, errorMessage] = validate.minLength(value, pair as Validation<number>);
          }
        });

        if (isError && options.onErrorFocus !== false) target.focus();

        if (isError && errors[name as keyof T] !== errorMessage) {
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        } else if (!isError && errors[name as keyof T]) {
          setErrors((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [name as keyof T]: _, ...rest } = prev;
            return rest as Partial<T>;
          });
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

  const handleSubmit: HandleSubmitHandler<T> = useCallback(
    (callback) => (e) => {
      e.preventDefault();

      // validation
      const targets = Object.values(inputRefs.current) as (EventTarget & FieldElementType)[];
      let focusFlag = false;

      targets.forEach((target) => {
        const { name, value } = target;

        let [isError, errorMessage] = [false, ''];
        const options = fieldOptions.current[name as keyof T];
        if (!options) return;

        const { required, maxLength, minLength, max, min, pattern } = options;
        const entries = Object.entries({ required, maxLength, minLength, max, min, pattern });
        for (let i = 0; i < entries.length; i++) {
          if (isError) break;
          const [key, pair] = entries[i];

          if (key === 'required' && pair) {
            [isError, errorMessage] = validate.required(value, pair as Validation<boolean>);
            if (isError) break;
          } else if (key === 'maxLength' && pair) {
            [isError, errorMessage] = validate.maxLength(value, pair as Validation<number>);
            if (isError) break;
          }
        }

        if (isError && errors[name as keyof T] !== errorMessage) {
          console.log('대체 왜?');
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
        }

        if (options?.onErrorFocus !== false && !focusFlag) {
          target.focus();
          focusFlag = true;
        }
      });

      callback(valuesRef.current as T);
    },
    []
  );

  return {
    register,
    handleSubmit,
    errors,
    watch,
  };
};

export default useForm;
