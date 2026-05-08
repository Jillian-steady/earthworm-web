"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  title?: string;
  content?: string;
  showCancel?: boolean;
  cancelText?: string;
  showConfirm?: boolean;
  confirmText?: string;
  open?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

export default function Dialog({
  title = "",
  content = "",
  showCancel = false,
  cancelText = "取消",
  showConfirm = false,
  confirmText = "确认",
  open = false,
  onCancel,
  onConfirm,
  onClose,
}: DialogProps) {
  const handleCancel = useCallback(() => {
    onClose?.();
    onCancel?.();
  }, [onClose, onCancel]);

  const handleConfirm = useCallback(() => {
    onClose?.();
    onConfirm?.();
  }, [onClose, onConfirm]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleCancel}
      />
      {/* Modal */}
      <div className="relative w-full sm:max-w-lg rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <div className="flex h-52 flex-col justify-between p-6 text-gray-900 dark:text-white">
          <h2 className="mb-8 text-2xl font-bold">{title}</h2>
          <p className="mb-8 text-base text-gray-700 dark:text-gray-300">
            {content}
          </p>
          <div className="flex w-full justify-end space-x-4">
            {showCancel && (
              <button
                className="btn btn-ghost px-6"
                onClick={handleCancel}
              >
                {cancelText || "取消"}
              </button>
            )}
            {showConfirm && (
              <button
                className="btn btn-primary px-6"
                onClick={handleConfirm}
              >
                {confirmText || "确认"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
