import React from 'react';
import { useForm } from './libs';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit, watch, errors } = useForm<Values>();
  console.log(errors);
  const nameValue = watch('name'); // 타입이 string | undefined
  const values = watch('name', 'age'); // 타입이 { age?: number | undefined; name?: string | undefined; }

  const onSubmit = (values: Values) => {
    console.log(values);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>이름</div>
        <input
          {...register('name', {
            // initialValue: 'woody',
            onMountFocus: true,
            required: { value: true, message: '이름 정보는 필수입니다' },
            minLength: 10,
          })}
        />
        <p style={{ color: 'red' }}>{errors.name}</p>
        <div>나이</div>
        <input
          {...register('age', {
            setValueAs: (value) => Number(value),
          })}
        />
        <div>크루의 이름은 {nameValue}</div>
        <button>제출</button>
      </form>
    </div>
  );
}

export default App;
