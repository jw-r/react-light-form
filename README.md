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

아래는 `useForm` 훅을 사용하는 기본적인 예시입니다.

```tsx
interface Values {
  username: string;
}

function App() {
  const { register, handleSubmit } = useForm<Values>();

  const onSubmit = (values: Values) => {
    somePostRequest(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>이름</div>
      <input
        {...register('username', {
          onMountFocus: true,
        })}
      />
      <button>제출</button>
    </form>
  );
}
```

## register

`useForm`의 `register` 함수는 폼 필드를 등록하고 유효성 검사 규칙을 적용하는 강력한 기능을 제공합니다.
이 함수를 사용하여, 폼 필드와 관련된 여러 옵션들을 지정할 수 있습니다. 각 옵션의 사용 방법은 다음과 같습니다.

### Validation Options

값 유효성 검사 옵션은 다음과 같이 설정할 수 있습니다.

1. 값으로 설정 (에러 발생 시, errors 객체에 기본 에러 메시지가 부여됩니다)

```tsx
{...register('username', {
  maxLength: 10,
})}
```

2. 객체로 설정 (에러 발생 시의 Error message를 직접 설정합니다)

```tsx
{...register('username', {
  maxLength: {
    value: 10,
    message: '사용자 이름은 최대 10글자까지 입력할 수 있습니다',
  },
})}
```

- **required**: 이 필드가 필수로 입력해야 하는지 여부를 정의합니다.

```tsx
register('username', { required: true });
// 또는 사용자 지정 에러 메시지와 함께
register('username', {
  required: {
    value: true,
    message: '사용자 이름을 입력해야 합니다',
  },
});
```

- **maxLength**: 필드의 최대 길이를 지정합니다.

```tsx
register('username', { maxLength: 20 });
// 또는 사용자 지정 에러 메시지와 함께
register('username', {
  maxLength: {
    value: 20,
    message: '사용자 이름은 20자를 초과할 수 없습니다',
  },
});
```

- **minLength**: 필드의 최소 길이를 지정합니다.

```tsx
register('password', { minLength: 6 });
// 또는 사용자 지정 에러 메시지와 함께
register('password', {
  minLength: {
    value: 6,
    message: '비밀번호는 최소 6자 이상이어야 합니다',
  },
});
```

- **max**: 숫자 입력 필드의 최대 값을 설정합니다.

```tsx
register('age', { max: 99 });
// 또는 사용자 지정 에러 메시지와 함께
register('age', {
  max: {
    value: 99,
    message: '나이는 99세 이하여야 합니다',
  },
});
```

- **min**: 숫자 입력 필드의 최소 값을 설정합니다.

```tsx
register('age', { min: 18 });
// 또는 사용자 지정 에러 메시지와 함께
register('age', {
  min: {
    value: 18,
    message: '나이는 18세 이상이어야 합니다',
  },
});
```

- **pattern**: 필드 값이 일치해야 하는 정규 표현식을 지정합니다.

```tsx
register('phoneNumber', {
  pattern: /[0-9]/g,
});
// 또는 사용자 지정 에러 메시지와 함께
register('phoneNumber', {
  pattern: {
    value: /[0-9]/g,
    message: '전화번호는 숫자만 포함해야 합니다',
  },
});
```

- **validation**: 사용자 정의 유효성 검사 함수를 지정할 수 있습니다. 이 함수는 입력 값을 매개변수로 받아 유효성 여부를 boolean 값으로 반환합니다.

```tsx
register('email', {
  validation: (inputValue) => inputValue.includes('@'),
  // 또는
  validation: {
    value: (inputValue) => inputValue.includes('@'),
    message: '이메일 형식에는 @가 포함되어야 합니다',
  },
});
```

### 그 외 Options

- **onErrorFocus**: 유효성 검사 실패 시 해당 필드에 자동으로 포커스를 맞출지를 결정합니다. 기본값은 `true`입니다.

```tsx
register('username', { onErrorFocus: true });
```

- **onMountFocus**: 컴포넌트가 마운트될 때 해당 필드에 자동으로 포커스를 맞출 것인지 결정합니다. 이는 사용자가 폼을 더 빠르게 입력하기 시작할 수 있도록 도와줍니다. 기본값은 `false`입니다.

```tsx
register('username', { onMountFocus: true });
```

- **autoComplete**: 브라우저가 해당 필드에 대해 자동완성 기능을 사용할지 여부를 결정합니다. 보안이 중요한 필드(예: 비밀번호)에 대해서는 `false`로 설정하여 자동완성을 비활성화할 수 있습니다. 기본값은 `false`입니다.

```tsx
register('password', { autoComplete: false });
```

- **initialValue**: 필드의 초기 값을 설정합니다. 이 값을 통해 폼 필드에 기본값을 제공할 수 있으며, 사용자가 폼을 열었을 때 해당 값이 이미 입력되어 있게 합니다.

```tsx
register('username', { initialValue: 'user123' });
```

- **setValueAs**: 필드의 값을 변환하여 저장할 때 사용되는 함수를 정의합니다. 이를 통해 사용자가 입력한 값을 내부적으로 사용하기에 적합한 다른 형태로 변환할 수 있습니다.
  - **Submit 시에 반환받은 값의 타입이 string 이외의 값이길 기대한다면 반드시 setValueAs 함수를 통해 타입을 설정해야합니다.**

```tsx
register('birthdate', {
  setValueAs: (value) => new Date(value),
});
```

또는, 사용자가 입력한 숫자 형식의 문자열을 실제 숫자로 변환하려면 다음과 같이 할 수 있습니다.

```tsx
register('age', {
  setValueAs: (value) => parseInt(value, 10),
});
```

## handleSubmit

`handleSubmit` 함수는 폼 제출(submit) 이벤트를 처리합니다. 이 함수는 모든 폼 입력의 유효성을 검사하고, 오류가 없을 경우에만 콜백 함수를 호출합니다.
이 콜백 함수는 유효한 폼 데이터로 작업을 수행하는 데 사용됩니다.

```tsx
interface Values {
  username: string;
}

function App() {
  const { register, handleSubmit } = useForm<Values>();

  const onSubmit = (values: Values) => {
    somePostRequest(values); // values === { username: <inputValue> }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} />
      <button>제출</button>
    </form>
  );
}
```

## errors

`errors` 상태는 폼 필드의 유효성 검사 중 발생하는 오류 메시지를 저장합니다.
폼 제출 시 또는 입력에 의해 필드의 유효 상태에 변경이 있을 때 errors 객체가 업데이트되고 리렌더링이 트리거됩니다.

```tsx
const { errors } = useForm();
{
  errors.username && <p>{errors.username.message}</p>;
}
```

## watch

`watch` 함수는 지정한 하나 이상의 폼 필드 값의 변화를 관찰하고 싶을 때 사용합니다.

```tsx
interface Values {
  username: string;
  password: number;
}

function App() {
  const { register, watch } = useForm<Values>();

  // 타입이 string
  const usernameValue = watch('username');

  // 타입이 { username: string, password: number }
  const usernameAndPassword = watch('username', 'password');

  return (
    <form>
      <input {...register('username')} />
      <input
        {...register('password', {
          setValueAs: (value) => Number(value),
        })}
      />
    </form>
  );
}
```
