import { useForm } from './libs/useForm';
// import { useForm } from 'react-hook-form';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit } = useForm<Values>();

  // 어떻게 타입 추론이 가능하게 할 수 있을까?
  const onSubmit = (values: Values) => {
    console.log(typeof values.age);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('age', {
            onMountFocus: true,
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
