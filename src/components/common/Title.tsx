"use client";

import type { ReactNode } from "react";

interface TitleProps {
  title: string;
  description: string[];
  children?: ReactNode;
}

export default function Title({ title, description, children }: TitleProps) {
  return (
    <div className="mx-auto my-5 text-center">
      <h2 className="bg-gradient-to-r from-purple-600 to-gray-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-purple-600 dark:to-gray-100 lg:text-4xl xl:text-5xl">
        {title}
      </h2>

      <div className="mt-5">
        {description.map((descItem, descIndex) => (
          <p
            key={descIndex}
            className="pt-2 text-center text-sm text-gray-800 dark:text-gray-300 lg:text-xl"
          >
            {descItem}
          </p>
        ))}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
