"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import HttpErrorProvider from "@/components/layout/HttpErrorProvider";
import { Theme } from "@/hooks/useDarkMode";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    const cached = localStorage.getItem("DARK_MODE") as Theme | null;
    const isDarkMedia =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (cached === Theme.DARK || (!cached && isDarkMedia)) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      setDarkMode(Theme.DARK);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      setDarkMode(Theme.LIGHT);
    }
  }, []);

  return (
    <HttpErrorProvider>
      {children}
      <Toaster
        theme={darkMode === Theme.DARK ? "dark" : "light"}
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode === Theme.DARK ? "#c084fc" : "#f3e8ff",
            color: darkMode === Theme.DARK ? "#000" : "#6b21a8",
          },
        }}
      />
    </HttpErrorProvider>
  );
}
