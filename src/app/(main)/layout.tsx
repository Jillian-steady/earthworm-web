"use client";

import { useCallback } from "react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import UserMenu from "@/components/layout/UserMenu";
import { useUserMenu } from "@/hooks/useUserMenu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isUserMenuOpen, openUserMenu, closeUserMenu } = useUserMenu();

  return (
    <div className="h-full w-full bg-white text-slate-600 transition-colors dark:bg-[#111111] dark:text-slate-300">
      <div className="m-auto flex h-fit min-h-screen flex-col items-center">
        <Navbar onOpenUserMenu={openUserMenu} />
        <div className="flex w-full flex-1 px-5">
          <div className="mx-auto flex w-full max-w-screen-xl flex-1">
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <UserMenu open={isUserMenuOpen} onClose={closeUserMenu} />
    </div>
  );
}
