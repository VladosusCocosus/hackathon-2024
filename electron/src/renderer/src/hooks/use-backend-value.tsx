import {useEffect, useState} from "react";


export function useBackendValue<T>(timeMs: number | null  = 10_000, callback: () => Promise<T>): T | null {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    callback().then((result) => {
      setValue(result)
    })

    if (!timeMs) {
      return;
    }
    setInterval(() => {
      callback().then((result) => {
        setValue(result)
      }).catch((e) => {
        console.error(e)
      })
    }, timeMs)
  }, []);

  return value
}
