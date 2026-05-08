"use client";

export default function Divider() {
  return (
    <div className="w-full pt-24">
      <span className="relative flex justify-center">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75" />
        <div className="absolute -top-1 flex h-2 w-5 items-center justify-center rounded-lg bg-gray-600 dark:bg-gray-400 lg:-top-2 lg:h-3.5 lg:w-8">
          <div className="h-1 w-3.5 rounded-lg bg-white dark:bg-theme-dark lg:h-2 lg:w-6" />
        </div>
      </span>
    </div>
  );
}
