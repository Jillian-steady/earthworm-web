"use client";

import { useEffect, useRef, useMemo } from "react";

interface CourseCardProps {
  title: string;
  id: string;
  count: number | undefined;
  coursePackId: string;
  description: string;
  activeCourseId?: string;
}

export default function CourseCard({
  title,
  id,
  count,
  coursePackId,
  description,
  activeCourseId,
}: CourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const hasFinished = !!count;
  const isActiveCourse = activeCourseId === id;
  const dataTip = useMemo(
    () => `恭喜您，当前课程已完成 ${count} 次`,
    [count],
  );

  useEffect(() => {
    if (isActiveCourse && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isActiveCourse]);

  return (
    <div
      ref={isActiveCourse ? cardRef : undefined}
      className={[
        "relative h-[160px] w-full cursor-pointer rounded-xl border border-gray-400 p-4 pb-6 transition-all duration-300 dark:text-gray-100",
        "hover:text-purple-500 hover:shadow-lg hover:shadow-gray-300 hover:dark:text-purple-400 dark:hover:shadow-gray-500",
        hasFinished
          ? "border-2 border-emerald-500 hover:text-emerald-500 hover:shadow-emerald-200 hover:dark:text-emerald-300 dark:hover:shadow-emerald-700"
          : "",
        isActiveCourse
          ? "border-2 border-purple-500 hover:text-purple-500 hover:shadow-purple-200 hover:dark:text-purple-300 dark:hover:shadow-purple-700"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3 className="text-base font-bold">{title}</h3>
      <p
        className="mt-4 line-clamp-3 text-sm text-gray-500 dark:text-gray-400"
        title={description}
      >
        {description}
      </p>
      {hasFinished && (
        <div
          className={[
            "absolute bottom-1.5 right-2 h-5 w-7 rounded-md text-center text-xs leading-5 text-white",
            hasFinished ? "bg-emerald-600" : "",
            isActiveCourse ? "bg-purple-600" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          title={dataTip}
        >
          {count}
        </div>
      )}
    </div>
  );
}
