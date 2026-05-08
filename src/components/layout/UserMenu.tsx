"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  Book,
  BookOpen,
  Globe,
  HandHelping,
  LogOut,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import MembershipBadge from "@/components/layout/MembershipBadge";
import { Theme, useDarkMode } from "@/hooks/useDarkMode";
import { signOut } from "@/services/auth";
import { useUserStore } from "@/stores/user";

interface UserMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function UserMenu({ open, onClose }: UserMenuProps) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isDarkMode = darkMode === Theme.DARK;

  const handleSetting = useCallback(() => {
    onClose();
    router.push("/user/setting");
  }, [onClose, router]);

  const handleMasteredElements = useCallback(() => {
    onClose();
    router.push("/mastered-elements");
  }, [onClose, router]);

  const handleGoToEditor = useCallback(() => {
    onClose();
    window.open("https://earthworm-editor.cuixueshe.com", "_blank");
  }, [onClose]);

  const handleHelpDocs = useCallback(() => {
    onClose();
    window.open(
      process.env.NEXT_PUBLIC_HELP_DOCS_URL || "https://earthworm-docs.cuixueshe.com",
      "_blank",
    );
  }, [onClose]);

  const handleFeedback = useCallback(() => {
    onClose();
    window.open("https://txc.qq.com/products/652508", "_blank");
  }, [onClose]);

  const handleThemeToggle = useCallback(
    (e: React.MouseEvent) => {
      toggleDarkMode(e);
    },
    [toggleDarkMode],
  );

  const handleLogout = useCallback(() => {
    onClose();
    setShowLogoutDialog(true);
  }, [onClose]);

  const handleConfirmLogout = useCallback(async () => {
    setShowLogoutDialog(false);
    await signOut();
  }, []);

  const menuOptions = useMemo(
    () => [
      { title: "设置", name: "setting", action: handleSetting, icon: Settings },
      { title: "掌握列表", name: "mastered", action: handleMasteredElements, icon: Book },
      { title: "编辑器", name: "editor", action: handleGoToEditor, icon: Globe },
      { title: "帮助文档", name: "helpDocs", action: handleHelpDocs, icon: BookOpen },
      { title: "建议反馈", name: "feedback", action: handleFeedback, icon: HandHelping },
      {
        title: "主题切换",
        name: "changeTheme",
        action: handleThemeToggle,
        icon: isDarkMode ? Moon : Sun,
      },
      { title: "登出", name: "logout", action: handleLogout, icon: LogOut },
    ],
    [
      handleSetting,
      handleMasteredElements,
      handleGoToEditor,
      handleHelpDocs,
      handleFeedback,
      handleThemeToggle,
      handleLogout,
      isDarkMode,
    ],
  );

  if (!open) return (
    <Dialog
      open={showLogoutDialog}
      title="退出登录"
      content="是否确认退出登录？"
      showCancel
      showConfirm
      onCancel={() => setShowLogoutDialog(false)}
      onClose={() => setShowLogoutDialog(false)}
      onConfirm={handleConfirmLogout}
    />
  );

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Slideover */}
      <div className="fixed inset-y-0 right-0 z-50 w-screen max-w-80 bg-white shadow-xl transition-transform dark:bg-gray-800">
        <div className="flex h-full flex-col">
          {/* User info header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-14 w-14">
                  {user?.avatar && (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex gap-2">
                  <div className="text-xl font-bold">{user?.username}</div>
                  <MembershipBadge />
                </div>
                <div className="text-sm opacity-75">{user?.name}</div>
              </div>
            </div>

            <button
              className="btn btn-ghost btn-sm dark:hover:bg-gray-600"
              onClick={onClose}
              tabIndex={-1}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu options */}
          <div className="flex-grow p-4">
            {menuOptions.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="mb-2 flex w-full items-center rounded-lg p-1 transition-all duration-200 ease-in-out hover:bg-base-200 hover:shadow-md dark:hover:bg-gray-600"
                tabIndex={-1}
              >
                <item.icon className="mr-3 h-7 w-7" />
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Footer info */}
          <div className="p-4 text-center text-xs opacity-50">版本 v1.0.0</div>
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog
        open={showLogoutDialog}
        title="退出登录"
        content="是否确认退出登录？"
        showCancel
        showConfirm
        onCancel={() => setShowLogoutDialog(false)}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
      />
    </>,
    document.body,
  );
}
