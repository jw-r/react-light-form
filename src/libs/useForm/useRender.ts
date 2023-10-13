import { useState } from 'react';

const useRender = () => {
  const [, forceUpdate] = useState({});

  const reRender = () => {
    forceUpdate({});
  };

  return { reRender };
};

export default useRender;
