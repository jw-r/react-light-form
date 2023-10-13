import React from 'react';
import { useForm } from './libs';
import './App.css';

interface Values {
  name: string;
  age: number;
  ok: true;
}

function App() {
  const { register, handleSubmit, watch } = useForm<Values>();

  const nameValue = watch('name');

  const onSubmit = (values: Values) => {
    console.log(values);
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
