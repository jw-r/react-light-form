import { useForm } from './libs/useForm';
// import { useForm } from 'react-hook-form';
import './App.css';

interface Values {
  name: string;
  age: number;
  a: {
    b: string;
    c: string;
  };
}

function App() {
  const { register, handleSubmit, errors, values } = useForm<Values>({
    name: 'woody',
    age: 3,
  });

  const onSubmit = () => {
    console.log(values.name);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
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
