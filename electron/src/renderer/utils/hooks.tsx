import { useRef, useEffect, useContext } from 'react';

import { ScriptServiceContext } from '../contexts';

// eslint-disable-next-line import/prefer-default-export
export function usePrevious<ValueType>(value: ValueType) {
  const ref = useRef<ValueType>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

export function useScriptService() {
  return useContext(ScriptServiceContext);
}
