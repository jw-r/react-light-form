import React from 'react';
import { useForm } from './libs';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit, watch } = useForm<Values>();

  const nameValue = watch('name');

  // 어떻게 타입 추론이 가능하게 할 수 있을까?
  const onSubmit = (values: Values) => {
    values;
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>이름</div>
        <input
          {...register('name', {
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
