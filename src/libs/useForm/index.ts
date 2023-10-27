import React, { useEffect, useRef, useState } from 'react';
import {
  DeepKeys,
  DeepPartial,
  FieldElementType,
  FieldOptionsType,
  FieldValues,
  GetValueHandler,
  GetValuesHandler,
  HandleSubmitHandler,
  InputRefsType,
  OptionsType,
  PathValue,
} from './type';
import useRender from './useRender';
import { validateField } from './validation/validation';
import { set, get } from '../utils';

const useForm = <T = FieldValues>() => {
  const [errors, setErrors] = useState<DeepPartial<T>>({});
  const valuesRef = useRef<DeepPartial<T>>({});
  const inputRefs = useRef<InputRefsType<T>>({});
  const fieldOptions = useRef<FieldOptionsType<T>>({});
  const listeners = useRef<Set<DeepKeys<T>>>(new Set());
  const { reRender } = useRender();

  useEffect(() => {
    if (listeners.current.size > 0) {
      reRender();
    }
  }, []);

  const register = (name: DeepKeys<T>, options?: OptionsType) => {
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

            set(valuesRef.current, name, options.initialValue);
          }

          inputRefs.current[name] = element;

          if (options?.onMountFocus) inputRefs.current[name]?.focus();
        }

        return inputRefs.current[name];
      },

      onChange: ({ target }: React.ChangeEvent<FieldElementType>) => {
        const { name, value } = target;

        // validation
        if (options) {
          const [isError, errorMessage] = validateField(value, options);

          const curErrorMessageOfName = get(errors, name);
          // 이전에 발생한 에러가 아닐 때, 에러 업데이트
          if (isError && curErrorMessageOfName !== errorMessage) {
            setErrors((prev) => {
              const newErrors = set({ ...prev }, name, errorMessage);
              return newErrors;
            });
            // 에러가 발생하지 않았음에도 에러 메시지가 존재할 때 (에러 제거)
          } else if (!isError && curErrorMessageOfName) {
            setErrors((prev) => {
              const newErrors = set({ ...prev }, name, '');
              return newErrors;
            });
          }
        }

        const transformedValue = options?.setValueAs ? options.setValueAs(value) : value;
        set(valuesRef.current, name, transformedValue);

        if (listeners.current.has(name as DeepKeys<T>)) reRender();
      },
    };
  };

  const getValue: GetValueHandler<T> = (name) => {
    const value = get(valuesRef.current, name);
    listeners.current.add(name);

    return value;
  };

  const getValues: GetValuesHandler<T> = <K extends DeepKeys<T>>(names: K[]) => {
    const values = names.reduce((acc, name) => {
      listeners.current.add(name);
      const currentValue = get(valuesRef.current, name);
      if (currentValue !== undefined) {
        acc[name] = currentValue;
      }

      return acc;
    }, {} as { [P in K]?: PathValue<T, K> });

    return values;
  };

  function watch<K extends DeepKeys<T>>(name: K): PathValue<T, K> | undefined;
  function watch<K extends DeepKeys<T>>(...names: K[]): { [P in K]?: PathValue<T, K> };
  function watch<K extends DeepKeys<T>>(
    ...names: K[]
  ): PathValue<T, K> | { [P in K]?: PathValue<T, K> } | undefined {
    if (names.length === 1) {
      return getValue(names[0]);
    }
    return getValues(names);
  }

  const handleSubmit: HandleSubmitHandler<T> = (callback) => (e) => {
    e.preventDefault();

    // validation
    const targets = Object.values(inputRefs.current) as (EventTarget & FieldElementType)[];
    let [errorFlag, focusFlag] = [false, false];

    for (const target of targets) {
      const { name, value } = target;
      const options = fieldOptions.current[name as DeepKeys<T>];

      if (options) {
        const [isError, errorMessage] = validateField(value, options);

        const curErrorMessageOfName = get(errors, name);
        if (isError && curErrorMessageOfName !== errorMessage) {
          setErrors((prev) => {
            const newErrors = set({ ...prev }, name, errorMessage);
            errorFlag = true;
            return newErrors;
          });
        }

        if (isError && options?.onErrorFocus !== false && !focusFlag) {
          target.focus();
          focusFlag = true;
        }
      }
    }

    if (!errorFlag) callback(valuesRef.current as T);
  };

  return {
    register,
    handleSubmit,
    errors,
    watch,
  };
};

export default useForm;
