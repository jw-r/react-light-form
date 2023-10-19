import React from 'react';
import { useForm } from './libs';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit, errors } = useForm<Values>();

  const onSubmit = (values: Values) => {
    // console.log(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='name'>이름</label>
        <input
          {...register('name', {
            maxLength: 5,
            required: { value: true, message: 'ㅇㅇㅇㅇ' },
            onErrorFocus: false,
            autoComplete: false,
          })}
        />
        <p>{errors.name}</p>

        <label htmlFor='age'>나이</label>
        <input
          {...register('age', {
            setValueAs: (value) => Number(value),
          })}
        />
        <button>제출</button>
      </form>
    </>
  );
}

export default App;
