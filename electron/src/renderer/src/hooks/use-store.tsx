import {useEffect, useState} from "react";

export function useStore<T>(key: string): [T | null, (value: T) => void] {
  const [state, setState] = useState<T | null>(null)

  useEffect(() => {
    setState(window.store.get(key))
  }, []);

  function handleChange(value: T) {
    window.store.set(key, value)
    setState(value)
  }

  return [state, handleChange]
}
