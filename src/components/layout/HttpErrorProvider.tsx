"use client";

import type { ReactNode } from "react";

interface HttpErrorProviderProps {
  children: ReactNode;
}

export default function HttpErrorProvider({ children }: HttpErrorProviderProps) {
  return <>{children}</>;
}
