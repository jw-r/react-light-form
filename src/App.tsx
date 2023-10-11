import { useForm } from './libs/useForm';
// import { useForm } from 'react-hook-form';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit, getValue, getValues } = useForm<Values>();

  console.log(getValue('name'));
  console.log(getValues('name', 'age'));

  // 어떻게 타입 추론이 가능하게 할 수 있을까?
  const onSubmit = (values: Values) => {
    console.log(typeof values.age);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name', {
            onMountFocus: true,
            value: 'woody',
          })}
        />
        <input
          {...register('age', {
            value: 3,
            setValueAs: (value) => Number(value),
          })}
        />
      </form>
    </div>
  );
}

export default App;

// const {
//   register,
//   handleSubmit,
//   formState: { errors },
// } = useForm<Values>();
