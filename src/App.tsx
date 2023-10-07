// import { useForm } from './libs/useForm';
import { useForm } from 'react-hook-form';
import './App.css';

interface Values {
  name: string;
  age: number;
}

function App() {
  const { register, handleSubmit } = useForm<Values>();

  // 어떻게 타입 추론이 가능하게 할 수 있을까?
  const onSubmit = (values: Values) => {
    console.log(values);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('age', {
            // onMountFocus: true,
            // value: true,
            // string이 아닌 타입이라면 setValueAs를 반드시 넣어줘야해
            // 그렇지 않으면 submit 시, Values 타입과 일치하지 않는 문제가 발생해
            // setValueAs: (value) => Number(value),
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
