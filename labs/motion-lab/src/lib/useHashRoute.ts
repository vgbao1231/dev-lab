import { useEffect, useState } from 'react';

const readRoute = (): string => globalThis.location.hash.replace(/^#/, '');

/**
 * Tiny hash router. Hash routing keeps the lab a static site: no server rewrite
 * rules are needed, and every demo has a shareable address.
 */
export const useHashRoute = (): string => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = (): void => {
      setRoute(readRoute());
    };

    globalThis.addEventListener('hashchange', onChange);
    return () => globalThis.removeEventListener('hashchange', onChange);
  }, []);

  return route;
};
