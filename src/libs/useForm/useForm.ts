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

        if (options?.value) element.value = String(options?.value);
        inputRefs.current[name] = element;

        if (options?.onMountFocus) inputRefs.current[name]?.focus();
      },

      onChange: ({ target: { name, value } }: React.ChangeEvent<FieldElementType>) => {
        // TODO 요효성 검사
        // TODO values 업데이트 (어떻게 받은 타입에 맞게 업데이트 할 수 있을까?)

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

// 성공한 형태. 즉, values가 T가 되는 형태
// const values: T = Object.entries(inputRefs.current).reduce((acc, [name, element]) => {
//   acc[name as keyof T] = (element as FieldElementType)!.value as T[keyof T];
//   return acc;
// }, {} as T);

// HTML 입력 필드가 항상 문자열 값을 반환한다는 것이 너무 타입 지정을 어렵게하네
// 현재 Values의 타입의 age 프로퍼티는 number 타입이지만, ref의 element의 value에는 String 형식만이 들어갈 수 있기에 실제 Values의 타입과 일치하지 않아.
// 이는 추후 submit 이벤트가 발생했을 때, 타입 불일치라는 결과를 가져올 수 있어.
// 어떻게 해결할 수 있을까?
// setValueAs로 해결하는 거 좋다 이거야. 하지만 사용자에게 알려야할거아니야 어떻게 알릴거지?
