"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { parseShortcut, useShortcutKeyMode } from "@/hooks/useShortcutKey";

export default function CustomShortcutDialog() {
  const {
    showModal,
    shortcutKeyStr,
    shortcutKeyTip,
    hasSameShortcutKey,
    handleCloseDialog,
    handleKeydown,
  } = useShortcutKeyMode();

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleCloseDialog} />
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="mb-4 text-center text-base font-bold">
          请先按下单键/组合键，通过回车键（Enter ⏎）来设置
        </h3>
        <div className="h-8 rounded border border-solid text-center leading-8">
          {shortcutKeyStr}
        </div>
        <div className="mt-2 flex h-8 justify-center gap-0.5 text-center">
          {shortcutKeyTip && (
            <div className="flex gap-0.5">
              {parseShortcut(shortcutKeyTip).map((key, index) => (
                <kbd key={index} className="kbd kbd-sm">
                  {key}
                </kbd>
              ))}
            </div>
          )}
        </div>
        {hasSameShortcutKey && (
          <div className="mt-4 text-center text-xs text-[rgba(136,136,136,1)]">
            已有相同的按键绑定，请重新设置
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
