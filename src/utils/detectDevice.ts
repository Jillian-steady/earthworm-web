"use client";

import { useEffect, useState } from "react";

const getDevice = (userAgent: string) => {
  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIphone = Boolean(userAgent.match(/iPhone|iPod/i));
  const isIpad = Boolean(
    (/macintosh|mac os x/i.test(userAgent) &&
      typeof window !== "undefined" &&
      window.screen.height > window.screen.width &&
      !userAgent.match(/(iPhone\sOS)\s([\d_]+)/)) ||
      userAgent.match(/(iPad).*OS\s([\d_]+)/)
  );
  const isOpera = Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = Boolean(userAgent.match(/IEMobile/i));
  const isSSR = Boolean(userAgent.match(/SSR/i));
  const isMobile = Boolean(isAndroid || isIphone || isOpera || isWindows);
  const isDesktop = !isMobile && !isSSR;

  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIphone,
    isIpad,
    isSSR,
  };
};

export function useDevice() {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  return getDevice(userAgent);
}

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const orientationListener = () => {
      const orientationType = window.screen.orientation.type;

      setIsLandscape(
        orientationType === "landscape-primary" ||
          orientationType === "landscape-secondary"
      );
    };

    orientationListener();
    screen.orientation.addEventListener("change", orientationListener);

    return () => {
      screen.orientation.removeEventListener("change", orientationListener);
    };
  }, []);

  return { isLandscape };
}
