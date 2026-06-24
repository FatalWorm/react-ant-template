import { useEffect, useRef, useState } from 'react';

/**
 * Хук для throttle значения.
 * Обновляет возвращаемое значение не чаще чем раз в intervalMs.
 *
 * @example
 * const throttledScroll = useThrottle(scrollPosition, 200);
 */
export function useThrottle<T>(value: T, intervalMs: number = 300): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= intervalMs) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, intervalMs - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, intervalMs]);

  return throttledValue;
}
