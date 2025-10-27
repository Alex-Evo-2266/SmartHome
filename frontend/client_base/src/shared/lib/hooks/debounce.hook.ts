import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
){
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouced = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(()=>callback(...args), delay)
    },
    [callback, delay]
  )

  useEffect(()=>{
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  },[])

  return debouced
}