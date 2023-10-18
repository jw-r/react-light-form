import React from 'react';
import { useForm } from './libs';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit, watch } = useForm<Values>();

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
            initialValue: 'woody',
            onMountFocus: true,
          })}
        />
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
