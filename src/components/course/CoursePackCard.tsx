"use client";

import { ReactNode } from "react";

interface CoursePackCardProps {
  coursePack: {
    id: string;
    title: string;
    description: string;
    cover: string;
    isFree: boolean;
  };
  actions?: ReactNode;
  onCardClick?: (coursePack: CoursePackCardProps["coursePack"]) => void;
}

export default function CoursePackCard({
  coursePack,
  actions,
  onCardClick,
}: CoursePackCardProps) {
  return (
    <div
      className="course-pack-card flex cursor-pointer flex-col overflow-hidden rounded-md rounded-t-xl border bg-white transition-all duration-300 hover:text-purple-500 hover:shadow-lg hover:shadow-gray-300 hover:dark:text-purple-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:shadow-gray-500"
      style={{ width: "100%", maxWidth: "100%", height: "100%" }}
      onClick={() => onCardClick?.(coursePack)}
    >
      <figure className="relative aspect-video overflow-hidden">
        <img
          src={coursePack.cover}
          width={288}
          height={180}
          className="inset-0 h-full w-full object-cover"
          alt={coursePack.title}
        />
      </figure>
      <div className="flex flex-grow flex-col p-4 sm:p-3">
        <h2 className="truncate text-lg font-semibold sm:text-base">
          {coursePack.title}
        </h2>
        <p
          className="my-2 line-clamp-2 flex-grow overflow-hidden text-sm text-gray-500 sm:text-xs"
          title={coursePack.description}
        >
          {coursePack.description}
        </p>
        {actions}
      </div>
    </div>
  );
}
