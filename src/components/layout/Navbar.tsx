"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { isAuthenticated, signIn } from "@/services/auth";
import { useUserStore } from "@/stores/user";

interface AnchorAttributes {
  name: string;
  href: string;
  target?: string;
}

const SCROLL_THRESHOLD = 8;

const HEADER_OPTIONS: AnchorAttributes[] = [
  {
    name: "文档",
    href: process.env.NEXT_PUBLIC_HELP_DOCS_URL || "https://earthworm-docs.cuixueshe.com",
    target: "_blank",
  },
  { name: "功能", href: "#features" },
  { name: "问题", href: "#faq" },
  { name: "联系我们", href: "#contact" },
];

interface NavbarProps {
  onOpenUserMenu?: () => void;
}

export default function Navbar({ onOpenUserMenu }: NavbarProps) {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isStickyNavBar = useMemo(
    () => ["/", "/user/setting", "/mastered-elements"].includes(pathname),
    [pathname],
  );

  const isScrolled = scrollY >= SCROLL_THRESHOLD;

  const authenticated = isAuthenticated();

  const handleSignIn = useCallback(() => {
    signIn();
  }, []);

  return (
    <header
      className={`w-full px-5 font-customFont transition-all duration-300 ease-linear ${
        isStickyNavBar ? "sticky top-0 z-10" : ""
      } ${
        isStickyNavBar && isScrolled
          ? "glass bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-md"
          : ""
      }`}
    >
      <div className="mx-auto max-w-screen-xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/">
              <div className="logo flex items-center">
                <Image
                  width={48}
                  height={48}
                  className="mr-6 hidden overflow-hidden rounded-md md:block"
                  src="/logo.png"
                  alt="earth-worm-logo"
                />
                <h1 className="text-wrap text-2xl font-extrabold leading-normal dark:text-white">
                  Earthworm
                </h1>
              </div>
            </Link>

            {pathname === "/" && !authenticated && (
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center text-base">
                  {HEADER_OPTIONS.map((optItem, optIndex) => (
                    <li key={optIndex} className="px-4">
                      <a
                        className="text-nowrap hover:text-purple-600 dark:text-white dark:hover:text-purple-400"
                        href={optItem.href}
                        target={optItem.target ?? "_self"}
                      >
                        {optItem.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="flex items-center">
            {authenticated ? (
              <div className="logged-in flex items-center">
                <div
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition-all hover:scale-125 hover:opacity-90 dark:bg-gray-700"
                  onClick={onOpenUserMenu}
                >
                  {user?.avatar && (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
            ) : (
              <button
                aria-label="Login"
                className="btn btn-sm mr-1 border-none bg-purple-500 text-white shadow-md hover:bg-purple-600 focus:outline-none"
                onClick={handleSignIn}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
