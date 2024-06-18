import {useEffect, useState} from "react";

export function useOnline (): boolean {
  const [ online, setOnline ] = useState(false)

  useEffect(() => {
    setOnline(navigator.onLine)

    window.addEventListener('offline', () => setOnline(false))
    window.addEventListener('online', () => setOnline(true))

    return () => {
      window.removeEventListener('offline', () => setOnline(false))
      window.removeEventListener('online', () => setOnline(true))
    }
  }, []);

  return online
}
