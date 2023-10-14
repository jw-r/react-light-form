# react-lightweight-form

애플리케이션 내에 `text`, `textArea` type의 Input Field만을 사용하는데 어마어마한 크기의 `react-hook-form`을 다운로드 할 필요는 없습니다

여러분의 `프로토타입` 혹은 `많은 종류의 Input Field를 전문적으로 다루지 않는 애플리케이션`을 위해 더이상 무거운 react-hook-form을 다운로드하지 마세요

이 패키지를 사용해 매 입력마다 리렌더링을 발생시키지 않으면서 onChange 방식으로 `강력한 유효성 검사`를 수행할 수 있습니다!

물론 강력한 `타입 시스템`을 장점 역시 충분히 누릴 수 있습니다👍

## 설치

```bash
npm i react-lightweight-form

yarn add react-lightweight-form
```

## 사용 방법

```tsx
interface Values {
  name: string;
}

function App() {
  const { register, handleSubmit } = useForm<Values>();

  const onSubmit = (values: Values) => {
    somePostRequest(url, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>이름</div>
      <input {...register('name')} />
      <button>제출</button>
    </form>
  );
}
```
