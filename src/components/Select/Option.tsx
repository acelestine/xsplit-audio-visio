import * as React from 'react';

export interface Props {
  children: string;
  value: string;
}

function Option({ children, value }: Props) {
  return <div data-value={value}>{children}</div>;
}

export default Option;
