import { useLayoutEffect, useState } from 'react';

/**
 * @returns a react hook used to get the window's height and width
 * @license CC BY-SA 4.0 (changes made)
 * @author @sophiebits
 */
export function useWindowSize(): number[] {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}
