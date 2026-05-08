import { useState, useCallback } from "react";

export function useUserMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const openUserMenu = useCallback(() => {
    setIsUserMenuOpen(true);
  }, []);

  const closeUserMenu = useCallback(() => {
    setIsUserMenuOpen(false);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  return {
    isUserMenuOpen,
    openUserMenu,
    closeUserMenu,
    toggleUserMenu,
  };
}
