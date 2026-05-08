import { useState, useCallback } from "react";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

const DARK_MODE = "DARK_MODE";
const DARK_THEME_CLASS = "dark";
const LIGHT_THEME_CLASS = "light";

export function useDarkMode() {
  const [darkMode, setDarkModeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return Theme.LIGHT;
    const cached = localStorage.getItem(DARK_MODE) as Theme | null;
    if (cached) {
      return cached;
    }
    const isDarkMedia =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDarkMedia ? Theme.DARK : Theme.LIGHT;
  });

  const setDarkMode = useCallback((state: boolean = false) => {
    const themeClass = state ? DARK_THEME_CLASS : LIGHT_THEME_CLASS;
    const themeValue = state ? Theme.DARK : Theme.LIGHT;

    document.documentElement.classList.toggle(DARK_THEME_CLASS, state);
    document.documentElement.setAttribute("data-theme", themeClass);
    setDarkModeState(themeValue);
    localStorage.setItem(DARK_MODE, themeValue);
  }, []);

  const initDarkMode = useCallback(() => {
    const cached = localStorage.getItem(DARK_MODE) as Theme | null;
    const isDarkMedia =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDarkMedia && !cached) {
      setDarkMode(true);
      return;
    }
    setDarkMode(cached === Theme.DARK);
  }, [setDarkMode]);

  const toggleDarkMode = useCallback(
    (event: React.MouseEvent) => {
      const isDark = document.documentElement.classList.contains("dark");
      const isAppearanceTransition =
        // @ts-expect-error: startViewTransition may not exist
        document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!isAppearanceTransition) {
        setDarkMode(!isDark);
        return;
      }

      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      );

      const transition = document.startViewTransition(() => {
        setDarkMode(!isDark);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: isDark ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 300,
            easing: "ease-in",
            pseudoElement: isDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          },
        );
      });
    },
    [setDarkMode],
  );

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    initDarkMode,
  };
}
