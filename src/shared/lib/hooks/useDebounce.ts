import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Хук для debounce значения.
 * Возвращает значение, обновлённое только после задержки.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Хук для debounce callback-функции.
 * Возвращает обёрнутую функцию, которая вызывается только после задержки.
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query);
 * }, 300);
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callbackRef.current(...(args as Parameters<T>)), delay);
    },
    [delay],
  );
}
