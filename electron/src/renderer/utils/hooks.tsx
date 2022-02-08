import { useRef, useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export function usePrevious<ValueType>(value: ValueType) {
  const ref = useRef<ValueType>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
