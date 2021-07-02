import React, { FC } from 'react';

const TSTest: FC = () => {

  const sum = (a:number,b:number) => {
    return a+b;
  };

  sum(1,1);

  return (
    <div>{sum(123, 5)}</div>
  );
};

export default TSTest;