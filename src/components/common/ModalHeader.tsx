"use client";

import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-center text-2xl font-bold text-purple-800 dark:text-white">
        {title}
      </h1>
      <div className="absolute right-2 top-2">
        <button
          className="btn btn-ghost btn-sm dark:hover:bg-gray-600"
          onClick={onClose}
          tabIndex={-1}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
