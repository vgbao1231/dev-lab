import { useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'motion-lab:mode';

const readMode = (): ThemeMode => {
  try {
    const stored = globalThis.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    // Private mode or blocked storage: fall back to the system preference.
    return 'system';
  }
};

/**
 * The lab's mode control. `system` leaves `<html data-mode>` unset so the
 * `prefers-color-scheme` default in styles.css applies; the other two override
 * it. The inline script in index.html applies the stored value before React
 * mounts, so a returning reader never sees the wrong palette flash.
 */
export const useTheme = (): [ThemeMode, (mode: ThemeMode) => void] => {
  const [mode, setMode] = useState<ThemeMode>(readMode);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'system') {
      delete root.dataset.mode;
    } else {
      root.dataset.mode = mode;
    }

    try {
      globalThis.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage is optional: the choice just does not persist.
    }
  }, [mode]);

  return [mode, setMode];
};
